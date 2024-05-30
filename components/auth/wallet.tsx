import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import AuthService from 'services/api/auth';
import { setCookies } from 'cookies-next';
import { observer } from 'mobx-react-lite';
import { ErrorType } from 'types/ErrorType';
import userService from 'services/api/user';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
    useAccount, useDisconnect, useNetwork, useSignMessage,
} from 'wagmi';

import { ROUTES } from 'constants/routes';
import { getProvider } from 'utils/getProvider';
import { useAuthStore } from 'stores/AuthStore';
import { TOKEN_COOKIE_NAME } from 'services/jwtToken';
import styles from './login.module.scss';

import CustomButton from '../common/button/CustomButton';
import { TrackGoogleAnalyticsEvent } from '../../utils/google-analytics';

function Wallet() {
    const router = useRouter();

    const { openConnectModal } = useConnectModal();
    const {
        isConnected,
        address,
    } = useAccount();
    const { chain } = useNetwork();
    const { signMessageAsync } = useSignMessage();
    const { disconnect } = useDisconnect();

    const [error, setError] = useState<ErrorType>();
    const [userId, setUserId] = useState<string>('');

    const { connector } = useAccount();
    const authStore = useAuthStore();

    useEffect(() => {
        const handleAuth = async () => {
            const userData = {
                address,
                chain: chain?.id,
                network: 'evm',
            };

            const { data } = await AuthService.getNonce(userData.address);
            const message = data.nonce;
            console.log('message=', message);

            try {
                const signature = await signMessageAsync({ message });
                console.log('signature=', signature);
                const provider = connector ? getProvider(connector?.id) : 'META_MASK';
                console.log('provider=', provider);
                console.log('connector?.id=', connector?.id);
                console.log('connector=', connector);
                const res = await AuthService.nonceSign(message, signature, provider);
                const { data } = res;
                authStore.setIsAuthenticated(true);
                setCookies(TOKEN_COOKIE_NAME, data?.token);

                const token = JSON.parse(atob(data.token.split('.')[1]));
                setUserId(token?.sub);
                if (data.newUser) {
                    TrackGoogleAnalyticsEvent('signup');
                } else {
                    TrackGoogleAnalyticsEvent('login');
                }
            } catch (e: any) {
                disconnect();
                console.error(e);
            }
        };

        if (isConnected) {
            handleAuth();
        }
    }, [isConnected]);

    useEffect(() => {
        (async () => {
            if (userId) {
                const user = await getUser(userId);
                if (user) {
                    router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
                }
            }
        })()
            .then(() => {
                // router.push(`${ROUTES.CONTRACTS}/?type=my&status=published`)
            });
    }, [userId]);

    const getUser = async (id: string) => {
        try {
            return await userService.getUser(id);
        } catch (e: any) {
            setError(e);
            return false;
        }
    };

    return (
        <div className={styles.form}>
            {openConnectModal && (
                <CustomButton
                    name="Connect with wallet"
                    color="light-blue"
                    variant="filled"
                    style={{
                        width: 330,
                        height: 44,
                    }}
                    onClick={openConnectModal}
                />
            )}
        </div>
    );
}

export default observer(Wallet);
