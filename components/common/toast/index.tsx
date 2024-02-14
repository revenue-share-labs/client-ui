import React, { ReactNode, useEffect, useState } from 'react';
import { Notification } from '@mantine/core';
import infoCircle from 'public/icons/information-circle.svg';
import errorImg from 'public/icons/error.svg';
import checkMark from 'public/icons/circle-checkmark.svg';
import close from 'public/icons/close.svg';
import { mergeClasses } from 'utils/string';
import { ToastType } from 'types/common/ToastType';
import Image from 'next/image';
import styles from './Toast.module.scss';

type ToastProps = {
    title: string;
    description?: string | ReactNode;
    onClose: () => void;
    type: ToastType;
    id: string,
}

const styleImg = {
    width: '18.75px',
    height: '18.75px',
};

const imgError = <Image src={errorImg.src} alt="Error image" style={styleImg} height={17.84} width={18.98} />;
const imgSuccess = <Image src={checkMark.src} alt="Success image" style={styleImg} height={19.5} width={19.5} />;
const imgInfo = <Image src={infoCircle.src} alt="Information image" style={styleImg} height={18.75} width={18.75} />;

function Toast({
    title, description, onClose, type, id,
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    const titleSection = (
        <div className={styles.titleSection}>
            <div className={styles.left}>
                {type === ToastType.ERROR && imgError}
                {type === ToastType.SUCCESS && imgSuccess}
                {type === ToastType.INFO && imgInfo}
                {title}
            </div>
            <div className={styles.closeImg} onClick={onClose}>
                <Image src={close.src} alt="Close btn" width={12.75} height={12.75} />
            </div>
        </div>
    );

    const rootClasses = mergeClasses(
        styles.root,
        styles[['root', type.toLocaleLowerCase()].join('_')],
    );

    useEffect(() => {
        setTimeout(() => {
            setIsVisible(true);
        }, 10);
    }, []);

    return (
        <Notification
            key={id}
            title={titleSection}
            classNames={{
                root: `${rootClasses} ${isVisible ? styles.opacity : ''}`,
                body: styles.body,
            }}
            disallowClose
            style={{ width: !description ? '350px' : '480px' }}
        >
            {description && <div className={styles.description}>{description}</div>}
        </Notification>
    );
}

export default Toast;
