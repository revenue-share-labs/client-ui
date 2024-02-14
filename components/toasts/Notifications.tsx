import Toast from 'components/common/toast';
import React, { useEffect } from 'react';
import { ToastDescriptionType } from 'types/common/ToastDescriptionType';
import { useRouter } from 'next/router';
import { ROUTES } from 'constants/routes';
import { observer } from 'mobx-react-lite';
import { DescriptionObjectType, useNotificationStore } from 'stores/NotificationStore';
import styles from './Notifications.module.scss';
import { NotificationContainer } from './NotificationContainer';

const ContractPublishedDescription = (title: string, contractId: string, toContract: any, isUpdated?: boolean) => {
    return (
        <>
            <div>
                <span className={styles.bold}>
                    {title}
                </span>
                &nbsp;has been
                {' '}
                {isUpdated ? 'updated' : 'created'}
                .
            </div>
            <div>
                You can check it on&nbsp;
                <span onClick={() => toContract(contractId)} className={styles.link}>this link</span>
            </div>
        </>
    );
};

const DraftCreatedDescription = (title: string) => {
    return (
        <div>
            <span className={styles.bold}>{title}</span>
            &nbsp;has been saved as draft.
        </div>
    );
};

const Notifications: React.FC = observer(() => {
    const router = useRouter();

    const notificationStore = useNotificationStore();

    if (!notificationStore || !notificationStore.notifications) {
        return null;
    }

    useEffect(() => {
        notificationStore?.clear();
    }, [router.asPath]);

    const toContract = (id: string) => {
        router.push(`${ROUTES.NEW_CONTRACT}/${id}`);
    };

    const getDescription = (description: DescriptionObjectType): React.ReactNode => {
        const {
            type,
            contractTitle,
            contractId,
            text,
        } = description;

        if (type && contractTitle) {
            if (type === ToastDescriptionType.CONTRACT_UPDATED && contractId) {
                return ContractPublishedDescription(contractTitle, contractId, toContract, true);
            }

            if (type === ToastDescriptionType.CONTRACT_PUBLISHED && contractId) {
                return ContractPublishedDescription(contractTitle, contractId, toContract);
            }

            if (type === ToastDescriptionType.DRAFT_CREATED) {
                return DraftCreatedDescription(contractTitle);
            }
        }

        return <div>{text}</div>;
    };

    if (!notificationStore) return null;

    return (
        <NotificationContainer>
            {notificationStore?.notifications.map(({
                id,
                type,
                title,
                description,
            }) => {
                return (
                    <Toast
                        title={title}
                        key={id}
                        description={description ? getDescription(description) : ''}
                        onClose={() => {
                            notificationStore.remove(id);
                        }}
                        id={id}
                        type={type}
                    />
                );
            })}
        </NotificationContainer>
    );
});

export default Notifications;
