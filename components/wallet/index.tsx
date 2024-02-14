import React, { useRef, useState } from 'react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { truncateFromMiddle } from 'utils/string';
import CustomButton from 'components/common/button/CustomButton';
import copy from 'public/icons/copy-white.svg';
import logout from 'public/icons/log-out.svg';
import { useHasMounted } from 'utils/hooks/useHasMounted';
import Image from 'next/image';
import CustomModal from 'components/common/modal/CustomModal';
import { useOnClickOutside } from 'utils/hooks/useOnClickOutside';
import { useWalletConnected } from 'utils/hooks/useWalletConnected';
import userStore from 'stores/UserStore';
import userService from 'services/api/user';
import { COPY_WALLET } from 'constants/notificationMessage';
import { useNotificationStore } from 'stores/NotificationStore';
import styles from './Wallet.module.scss';

function Wallet() {
    const notificationStore = useNotificationStore();

    const hasMounted = useHasMounted();
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [confirmDisconnect, setConfirmDisconnect] = useState(false);

    useWalletConnected();
    const { openConnectModal } = useConnectModal();
    const { disconnect } = useDisconnect();
    const { address, isConnected } = useAccount();

    const menuRef = useRef<HTMLDivElement | null>(null);
    // Call hook passing in the ref and a function to call on outside click
    useOnClickOutside(menuRef, () => setIsOpenMenu(false));

    async function copyAddress() {
        if (!address) return;

        try {
            await navigator?.clipboard?.writeText(address);
            notificationStore?.success(COPY_WALLET);
            setIsOpenMenu(false);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    }

    async function checkSignInType() {
        // check how user was signed in
        if (isXsollaLogin()) {
            await disconnectWallet();
            setIsOpenMenu(false);
        } else {
            setIsOpenMenu(false);
            setConfirmDisconnect(true);
        }
    }

    async function disconnectWallet() {
        try {
            if (isXsollaLogin()) {
                await removeWallet();
                disconnect();
            } else {
                disconnect();
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    }

    const removeWallet = async () => {
        const { activeWallet } = userStore.userData;
        if (!activeWallet || !activeWallet.address) return;

        const res = await userService.removeWallet(activeWallet?.address);
        userStore.updateUser(res);
    };

    const onConfirmDisconnect = async () => {
        await disconnectWallet();
        setConfirmDisconnect(false);
    };

    const isXsollaLogin = () => {
        // check how user was signed in
        const user = userStore.userData;
        return user.createdBy === 'EMAIL';
    };

    if (!hasMounted) {
        return null;
    }

    if (isConnected && address) {
        return (
            <>
                <CustomModal
                    isOpen={confirmDisconnect}
                    onClose={() => setConfirmDisconnect(false)}
                    onConfirm={onConfirmDisconnect}
                    confirmBtnLabel="Disconnect"
                    title="Disconnect Wallet / Sign Out"
                    description="You have been authorized with the wallet.
                    Disconnecting wallet will lead to sign out from the app."
                />

                <div className={styles.wallet}>
                    <CustomButton
                        onClick={() => setIsOpenMenu(!isOpenMenu)}
                        color="violet"
                        name={truncateFromMiddle(address)}
                        radius={12}
                        style={{ height: 40 }}
                    />

                    {isOpenMenu && (
                        <div className={styles.menu} ref={menuRef}>
                            <div className={styles.option} onClick={copyAddress}>
                                <Image
                                    src={copy.src}
                                    alt="Copy address icon"
                                    width={24}
                                    height={24}
                                />
                                Copy Address
                            </div>

                            <div className={styles.option} onClick={checkSignInType}>
                                <Image
                                    src={logout.src}
                                    alt="Disconnect icon"
                                    width={24}
                                    height={24}
                                />
                                Disconnect
                            </div>
                        </div>
                    )}
                </div>
            </>
        );
    }

    return (
        <CustomButton
            onClick={openConnectModal}
            color="black"
            name="Connect Wallet"
            variant="filled"
            radius={12}
            style={{ height: 40 }}
        />
    );
}

export default Wallet;
