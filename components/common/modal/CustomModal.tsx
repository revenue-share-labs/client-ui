import { Loader, Modal } from '@mantine/core';
import React from 'react';
import Image from 'next/image';

import closeIcon from 'public/icons/close.svg';

import styles from './CustomModal.module.scss';
import CustomButton from '../button/CustomButton';

type CustomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmBtnLabel?: string;
  confirmBtnLoading?: boolean;
  title?: string;
  description?: string | React.ReactNode;
  loading?: boolean;
  iconClose?: boolean;
  cancelBtn?: boolean;
  children?: JSX.Element
};

function CustomModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmBtnLabel,
    confirmBtnLoading,
    loading,
    children,
    iconClose = false,
    cancelBtn = true,
}: CustomModalProps) {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            centered
            withCloseButton={false}
            classNames={{
                modal: styles.modal,
                inner: styles.inner,
            }}
        >
            <div className={styles.title}>
                {title}
                {iconClose && <Image onClick={onClose} src={closeIcon} alt="close icon" />}
            </div>
            <div className={styles.description}>{description}</div>
            {children && children}
            {loading && (
                <div className={styles.loading}>
                    <Loader color="#3e4fea" size="lg" variant="bars" />
                </div>
            )}
            {!loading && (
                <div className={styles.btns}>
                    {
                        cancelBtn
                        && (
                            <CustomButton
                                name="Cancel"
                                variant="ghost"
                                color="black"
                                style={{ width: 92, height: 48 }}
                                onClick={onClose}
                            />
                        )
                    }
                    {onConfirm && (
                        <CustomButton
                            name={confirmBtnLabel}
                            color="blue"
                            style={{ minWidth: 92, height: 48, padding: '12px 20px' }}
                            onClick={onConfirm}
                            disabled={confirmBtnLoading}
                            isLoading={confirmBtnLoading}
                        />
                    )}

                </div>
            )}
        </Modal>
    );
}

export default CustomModal;
