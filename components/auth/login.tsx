import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import xlaLogo from 'public/images/XLA_logo.svg';
import { useRouter } from 'next/router';
import AuthService from 'services/api/auth';
import { setCookies } from 'cookies-next';
import userService from 'services/api/user';
import { ROUTES } from 'constants/routes';
import { useAuthStore } from 'stores/AuthStore';
import { useNotificationStore } from 'stores/NotificationStore';
import { TOKEN_COOKIE_NAME } from 'services/jwtToken';
import { TrackGoogleAnalyticsEvent } from 'utils/google-analytics';
import CustomSpinner from '../common/spinner';
import Wallet from './wallet';
import { AuthForm } from './authForm';
import styles from './login.module.scss';

export const Login = () => {
    const router = useRouter();
    const notificationStore = useNotificationStore();
    const authStore = useAuthStore();

    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        if (router.query && router.query.token) {
            setIsLoading(true);
            AuthService.getAuthToken(router.query.token)
                .then((res) => {
                    const { data } = res;
                    authStore.setIsAuthenticated(true);
                    setCookies(TOKEN_COOKIE_NAME, data.token);
                    const token = JSON.parse(atob(data.token.split('.')[1]));
                    setUserId(token?.sub);
                    if (data.newUser) {
                        TrackGoogleAnalyticsEvent('signup');
                    } else {
                        TrackGoogleAnalyticsEvent('login');
                    }
                })
                .catch((e) => {
                    authStore.setIsAuthenticated(false);
                    notificationStore?.error({ text: e.message });
                });
        }
    }, [router, router.query]);

    useEffect(() => {
        (async () => {
            if (userId) {
                const user = await getUser(userId);
                if (user) {
                    router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
                }
            }
        })();
    }, [userId]);

    const getUser = async (id: string) => {
        try {
            return await userService.getUser(id);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
            return false;
        }
    };

    return (
        <>
            <div className={styles.loader}>
                {isLoading && <CustomSpinner width={39} height={39} type="with-arrow" />}
            </div>
            <div className={`${styles.backAuth} ${styles.container} ${isLoading && styles.blur}`}>

                <div className={`${styles.content}`}>
                    <div className={styles.formContainer}>
                        <div className={styles.loginTop}>
                            <Image
                                src={xlaLogo.src}
                                alt="XLA"
                                width={102}
                                height={32}
                                priority
                            />

                            <div className={styles.title}>
                                Login to XLA Contracts
                            </div>
                        </div>

                        <div className={styles.authForm}>
                            <AuthForm />
                        </div>

                        <div className={styles.walletForm}>
                            <Wallet />
                        </div>

                    </div>
                </div>

                <div className={styles.copyContainer}>
                    Copyright © XLA 2023. All rights reserved.
                </div>
            </div>

        </>
    );
};
