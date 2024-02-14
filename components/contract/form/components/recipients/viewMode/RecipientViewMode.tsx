import React from 'react';
import { Recipient } from 'types/contract/Recipient';
import { Table } from '@mantine/core';
import { truncateFromMiddle } from 'utils/string';
import lockClosed from 'public/icons/lock-closed-red.svg';
import lockOpen from 'public/icons/lock-open-green.svg';
import copyImg from 'public/icons/copy.svg';
import Image from 'next/image';
import { COPY_WALLET } from 'constants/notificationMessage';
import { useNotificationStore } from 'stores/NotificationStore';
import linkImg from 'public/icons/external-link.svg';
import { ContractStatusType } from 'types/common/ContractStatusType';
import styles from './RecipientViewMode.module.scss';
import { viewOnBlockExplorer } from '../../../common/viewOnBlockExplorer';

type RecipientViewModeProps = {
    recipients: Recipient[];
    mutabilityRecipients?: boolean;
    controller?: string;
    chain?: string;
    status?: string;
};

function RecipientViewMode({
    recipients,
    mutabilityRecipients,
    controller,
    chain,
    status,
}: RecipientViewModeProps) {
    const notificationStore = useNotificationStore();
    const isDraft = status === ContractStatusType.DRAFT;

    async function copy(value?: string) {
        if (!value) return;
        try {
            await navigator?.clipboard?.writeText(value);
            notificationStore?.success(COPY_WALLET);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    }

    const rows = recipients.map((element) => (
        <tr key={`${element.id}`} className={styles.row}>
            <td className={styles.value}>{element.name || '-'}</td>
            <td className={styles.address}>
                {element.address ? truncateFromMiddle(element.address) : '-'}
                {element.address
                    && (
                        <Image
                            alt="copy icon"
                            src={copyImg.src}
                            className={styles.copyImg}
                            width={16}
                            height={16}
                            onClick={() => copy(element.address)}
                        />
                    )}
            </td>
            <td className={styles.value}>{element.revenue ? `${element.revenue}%` : '-'}</td>
        </tr>
    ));

    const controllerLink = (
        <div className={styles.controller}>
            <div className={styles.link}>
                <div onClick={() => viewOnBlockExplorer(chain, controller)}>
                    {controller && truncateFromMiddle(controller)}
                </div>
                <Image
                    src={linkImg.src}
                    className={styles.infoImg}
                    alt="Link image"
                    width={16}
                    height={16}
                />
            </div>
            <Image
                alt="Copy icon"
                src={copyImg.src}
                width={16}
                height={16}
                onClick={() => copy(controller)}
                className={styles.copy}
            />
        </div>
    );
    const recipientsLockedSection = (
        <div className={styles.recipientsLocked}>

            <Image
                src={mutabilityRecipients ? lockOpen.src : lockClosed.src}
                alt="XLA"
                width={16}
                height={16}
            />

            <div className={styles.desc}>
                {mutabilityRecipients
                    ? (
                        <div className={styles.mutability}>
                            {
                                isDraft ? <div> Сan be edited by controller</div>

                                    : (
                                        <>
                                            {' '}
                                            <div> Сan be edited by&nbsp;</div>
                                            { controller && controllerLink}
                                        </>
                                    )
                            }

                        </div>
                    )
                    : 'Locked for editing'}
            </div>
        </div>
    );

    return (
        <>
            <div className={styles.header}>
                <div className={styles.title}>Recipients</div>
                {recipientsLockedSection}
            </div>
            <div className={styles.info}>

                <Table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.column}>Nickname</th>
                            <th className={styles.column}>Wallet address</th>
                            <th className={styles.column}>Shares</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </div>
        </>

    );
}

export default RecipientViewMode;
