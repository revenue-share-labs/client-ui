import React, { useState } from 'react';
import { CustomInput } from 'components/common/input/CustomInput';
import { ActionIcon, Group } from '@mantine/core';
import trashImg from 'public/icons/trash.svg';
import { truncateFromMiddle } from 'utils/string';
import Image from 'next/image';
import styles from '../Recipients.module.scss';

type RecipientRowProps = {
  recipientsCount: number;
  removeRecipient: (id: number) => void;
  id: number;
  onChangeRevenue: (id: number, value: string) => void;
  form: any;
};

function RecipientRow({
    id,
    recipientsCount,
    removeRecipient,
    onChangeRevenue,
    form,
}: RecipientRowProps) {
    const [address, setAddress] = useState(
        form.getInputProps(`${'recipients'}.${id}.${'address'}`).value,
    );
    const [isFocused, setIsFocused] = useState(false);

    const onChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
        form.setFieldValue(
            `${'recipients'}.${id}.${'address'}`,
            event.target.value,
        );
    };

    return (
        <Group position="apart" align="normal">
            <div className={styles.column}>
                <CustomInput
                    style={{
                        width: '330px',
                    }}
                    maxLength={100}
                    {...form.getInputProps(`${'recipients'}.${id}.${'name'}`)}
                    placeholder="Enter name"
                />
            </div>

            <div className={styles.column}>
                <CustomInput
                    style={{
                        width: '330px',
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={isFocused ? address : truncateFromMiddle(address)}
                    onChange={onChangeAddress}
                    maxLength={100}
                    error={form.errors[`${'recipients'}.${id}.${'address'}`]}
                    placeholder="0x0000...0000"
                />
            </div>

            <div className={styles.column}>
                <CustomInput
                    style={{
                        width: '100px',
                    }}
                    maxLength={8}
                    {...form.getInputProps(`${'recipients'}.${id}.${'revenue'}`)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChangeRevenue(id, event.target.value)}
                    placeholder="0.00%"
                />
            </div>

            <ActionIcon
                variant="transparent"
                disabled={recipientsCount === 1}
                onClick={() => removeRecipient(id)}
            >
                <Image src={trashImg.src} alt="Delete icon" width={24} height={24} />
            </ActionIcon>
        </Group>
    );
}

export default RecipientRow;
