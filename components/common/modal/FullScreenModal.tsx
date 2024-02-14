import { Modal } from '@mantine/core';
import React from 'react';
import Image from 'next/image';
import { COPY_WALLET } from 'constants/notificationMessage';
import { observer } from 'mobx-react-lite';
import copy from 'public/icons/copy.svg';
import twitter from 'public/icons/logo-twitter.svg';
import instagram from 'public/icons/logo-instagram.svg';
import facebook from 'public/icons/logo-facebook.svg';
import { useNotificationStore } from 'stores/NotificationStore';
import { viewOnBlockExplorer } from 'components/contract/form/common/viewOnBlockExplorer';
import CustomButton from '../button/CustomButton';
import styles from './FullScreenModal.module.scss';

type FullScreenModalProps = {
    isOpen: boolean;
    isRedeploy: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmBtnLabel: string;
    title?: string;
    contractAddress?: string;
    contractId?: string;
    chain?: string;
};

function FullScreenModal({
    isOpen,
    isRedeploy,
    onClose,
    onConfirm,
    title,
    confirmBtnLabel,
    contractAddress,
    contractId,
    chain,
}: FullScreenModalProps) {
    const notificationStore = useNotificationStore();

    async function copyWallet(address?: string) {
        if (!address) return;
        try {
            await navigator?.clipboard?.writeText(address);
            notificationStore?.success(COPY_WALLET);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    }

    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            fullScreen
            withCloseButton={false}
            classNames={{
                modal: styles.modal,
                inner: styles.inner,
            }}
        >
            <div className={styles.subtitle}>
                You have
                {isRedeploy ? ' updated' : ' created'}
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.path}>
                <span onClick={() => viewOnBlockExplorer(chain, contractAddress)}>{contractAddress}</span>
                <Image
                    src={copy.src}
                    alt="Copy address icon"
                    width={24}
                    height={24}
                    onClick={() => copyWallet(contractAddress)}
                />
            </div>
            {/* <div className={styles.description}>Show it to the world with social</div> */}
            {/* <div className={styles.socials}> */}
            {/*    <Image */}
            {/*        src={facebook.src} */}
            {/*        alt="facebook" */}
            {/*        width={40} */}
            {/*        height={40} */}
            {/*    /> */}
            {/*    <Image */}
            {/*        src={instagram.src} */}
            {/*        alt="instagram" */}
            {/*        width={40} */}
            {/*        height={40} */}
            {/*    /> */}
            {/*    <Image */}
            {/*        src={twitter.src} */}
            {/*        alt="twitter" */}
            {/*        width={40} */}
            {/*        height={40} */}
            {/*    /> */}
            {/* </div> */}
            <CustomButton
                name={confirmBtnLabel}
                color="blue"
                style={{
                    minWidth: 92,
                    height: 56,
                    padding: '16px 24px',
                    fontSize: '16px',
                }}
                onClick={onConfirm}
            />

        </Modal>
    );
}

export default observer(FullScreenModal);
