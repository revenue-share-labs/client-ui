import { useEffect, useState } from 'react';
import {
    useAccount, useConnect,
} from 'wagmi';
import userStore from 'stores/UserStore';
import userService from 'services/api/user';
import { CONNECT_WALLET } from 'constants/notificationMessage';
import { WalletDto } from 'types/user/WalletDto';
import { useNotificationStore } from 'stores/NotificationStore';
import { useHasMounted } from './useHasMounted';
import { useSignOut } from './useSignOut';
import { getProvider } from '../getProvider';

export function useWalletConnected() {
    const {
        address, isConnected, isDisconnected, connector,
    } = useAccount();
    const notificationStore = useNotificationStore();
    const hasMounted = useHasMounted();
    const { connect, connectors } = useConnect();

    const signOut = useSignOut();

    useEffect(() => {
        const processingData = async () => {
            try {
                const { email, activeWallet, createdBy } = userStore.userData;
                const isXsollaLogin = createdBy === 'EMAIL';

                if (hasMounted && isConnected && address) {
                    // if we sign in using one wallet, after change wallet in metamask,
                    // we need to make signout for this user
                    if (!isXsollaLogin) {
                        signOut();
                        return;
                    }

                    if (!activeWallet || address !== activeWallet.address) {
                        await addWallet(address);
                        notificationStore?.success(CONNECT_WALLET);
                    }
                }

                if (!isConnected) {
                    await processWallet(activeWallet, isXsollaLogin);
                }
            } catch (e: any) {
                notificationStore?.error({ text: e.message });
            }
        };

        processingData();
    }, [address, isConnected]);

    const processWallet = async (activeWallet?: WalletDto, isXsollaLogin?: boolean): Promise<void> => {
        if (activeWallet?.address && connectors && isXsollaLogin) {
            const { provider } = activeWallet;
            const connectorId = provider && getProvider(provider);
            const connector = connectors.find((item) => item.id === connectorId);
            if (connector) {
                connect({ connector });
                return;
            }
        }

        if (isXsollaLogin) {
            await removeWallet(activeWallet?.address);
        } else {
            signOut();
        }
    };

    const addWallet = async (address: string) => {
        if (!connector) return;

        const res = await userService.addWallet(address, getProvider(connector.id));
        userStore.updateUser(res);
    };

    const removeWallet = async (wallet?: string) => {
        if (!wallet) return;
        const res = await userService.removeWallet(wallet);
        userStore.updateUser(res);
    };
}
