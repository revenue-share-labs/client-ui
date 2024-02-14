import React from 'react';
import { Group } from '@mantine/core';
import Image from 'next/image';
import { v4 } from 'uuid';
import { Recipient } from 'types/contract/Recipient';
import CustomButton from 'components/common/button/CustomButton';
import plusImg from 'public/icons/plus.svg';
import { removeSpecialSymbols, truncateToFiveDecimalPlaces } from 'utils/string';
import ProgressBar from '../../progressBar';
import RecipientRow from './RecipientRow';
import styles from './RecipientEditMode.module.scss';

type RecipientEditMode = {
    form: any
}

const RecipientEditMode = ({ form } : RecipientEditMode) => {
    const { recipients, progressPercent } = form.values;

    const isBtnDisabled = recipients.length >= 60;

    const splitEvenly = () => {
        const { recipients } = form.values;
        const count = recipients.length;

        const value: any = toFixed(100 / count, 5);
        const diff = countDiff(value, count, 100);

        const newRecipients = getNewArray(recipients, value, diff);
        form.setFieldValue('recipients', newRecipients);
        countProgressPercent(newRecipients);
    };

    const splitRemaining = () => {
        const { recipients } = form.values;
        const emptyRecipients = getRecipientsWithoutRevenue();
        const percent = (100 - progressPercent) / emptyRecipients.length;

        const value: any = +toFixed(percent, 5);
        const diff = countDiff(
            value,
            emptyRecipients.length,
            100 - progressPercent,
        );

        const array1 = recipients.filter((item: Recipient) => {
            return !!(item.revenue && item.revenue !== '0');
        });

        const array2 = getNewArray(emptyRecipients, value, diff);
        const newRecipients = [...array1, ...array2];

        form.setFieldValue('recipients', newRecipients);
        countProgressPercent(newRecipients);
    };

    const countDiff = (part: number, count: number, amount: number) => +(part * count - amount).toFixed(5);

    const getNewArray = (recipients: Recipient[], value: number, diff: number) => recipients.map((item: Recipient, index: number) => ({
        ...item,
        revenue: index === 0 ? (value - diff).toString() : value.toString(),
    }));

    // eslint-disable-next-line no-bitwise
    const toFixed = (n: number, fixed: number): number => ~~(10 ** fixed * n) / 10 ** fixed;

    const isSplitRemainingEnable = () => {
        const emptyRecipients = getRecipientsWithoutRevenue();
        return emptyRecipients.length === 0 || progressPercent >= 100;
    };

    const getRecipientsWithoutRevenue = () => recipients.filter((item: Recipient) => {
        return !item.revenue || item.revenue === '0';
    });

    const countProgressPercent = (recipients = form.values.recipients) => {
        let progressPercent = 0;
        recipients.forEach((item: Recipient) => {
            progressPercent += Number(item.revenue);
        });
        form.setFieldValue('progressPercent', +progressPercent.toFixed(5));
    };

    const addRecipient = () => {
        form.insertListItem('recipients', {
            id: v4(), name: '', address: '', revenue: '',
        });
    };

    const removeRecipient = (index: any) => {
        form.removeListItem('recipients', index);

        const newRecipients = form.values.recipients.filter(
            (item: Recipient, ind: number) => ind !== index,
        );
        countProgressPercent(newRecipients);
    };

    const onChangeRevenue = (index: number, value: string) => {
        const revenue = parseRevenueValue(value);

        const { recipients } = form.values;
        const newRecipients = recipients
            .map((item: Recipient, ind: number) => (ind !== index ? item : { ...item, revenue }));
        form.setFieldValue('recipients', newRecipients);

        if (revenue) {
            form.setFieldError(`${'recipients'}.${index}.${'revenue'}`, '');
        }
        countProgressPercent(newRecipients);
    };

    const parseRevenueValue = (value: string) => {
        if (!value) return value;

        const noSpecialChars = removeSpecialSymbols(value);
        return truncateToFiveDecimalPlaces(noSpecialChars);
    };

    return (
        <>

            <div className={styles.header}>
                <div className={styles.title}>Recipients</div>
            </div>

            <Group mt={24} spacing={24}>
                <div className={styles.columnWidth}>Nickname</div>
                <div className={`${styles.columnWidth}`}>
                    <div className={`${styles.label} ${styles.address}`}>
                        Wallet address
                    </div>
                </div>
                <div>
                    <div className={`${styles.label} ${styles.shares}`}>
                        Shares
                    </div>
                </div>
            </Group>
            <div className={styles.values}>
                {recipients.map((item: Recipient, index: number) => (
                    <RecipientRow
                        key={`${item.id}`}
                        id={index}
                        removeRecipient={removeRecipient}
                        recipientsCount={recipients.length}
                        onChangeRevenue={onChangeRevenue}
                        form={form}
                    />
                ))}
            </div>

            <div className={styles.btns}>
                <CustomButton
                    name="Add Recipient"
                    color="violet"
                    style={{ width: '563px', height: '40px' }}
                    rightIcon={<Image src={plusImg.src} alt="add icon" width={15.5} height={15.5} />}
                    disabled={isBtnDisabled}
                    onClick={addRecipient}
                />

                <div className={styles.primary}>
                    <CustomButton
                        name="Split Evenly"
                        color="violet"
                        variant="outlined"
                        style={{ width: '111px', height: '40px' }}
                        radius={12}
                        onClick={splitEvenly}
                    />

                    <CustomButton
                        name="Split Remaining"
                        color="violet"
                        variant="outlined"
                        style={{ width: '140px', height: '40px' }}
                        radius={12}
                        disabled={isSplitRemainingEnable()}
                        onClick={splitRemaining}
                    />
                </div>
            </div>

            <div className={styles.divider} />

            <ProgressBar
                value={progressPercent}
                error={form.errors.progressPercent}
            />
        </>
    );
};

export default RecipientEditMode;
