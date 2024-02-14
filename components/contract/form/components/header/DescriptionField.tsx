import React, { useEffect, useState } from 'react';
import { useNotificationStore } from 'stores/NotificationStore';
import { ContractDto } from 'types/contract/ContractDto';
import { contractService } from 'services/api/contract';
import { Textarea } from '@mantine/core';
import { mapUpdateContractDto } from '../../common/dataMapping';

import styles from './HeaderEditor.module.scss';

type DescriptionFieldProps = {
    form: any;
    contract?: ContractDto;
    setContract?: (value: ContractDto) => void;
    isAuthor?: boolean;
    isDraft?: boolean;
    isOwner?: boolean;
  };

const DescriptionField = ({
    form, contract, setContract, isAuthor, isDraft, isOwner,
}: DescriptionFieldProps) => {
    const [description, setDescription] = useState(form.getInputProps('description').value);
    const [isFieldEdited, setIsFieldEdited] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const countInput = 256 - description.length ?? 0;

    const notificationStore = useNotificationStore();

    const openEditingField = () => {
        setIsFieldEdited(true);
    };

    let abilityEdit;
    if (isDraft) {
        abilityEdit = contract?.id ? isOwner || isAuthor : true;
    } else {
        abilityEdit = isOwner;
    }

    useEffect(() => {
        if (!isFocused && (isOwner || isAuthor)) {
            saveDescription();
        }
    }, [isFocused]);

    useEffect(() => {
        if (isFieldEdited) {
            document.getElementById('contract-description')?.focus();
        }
    }, [isFieldEdited]);

    const saveDescription = async () => {
        const value = form.getInputProps('description').value?.trim();
        form.setFieldValue('description', value);
        if (!contract || !contract.id || contract.description === value) {
            return;
        }

        try {
            const contractDto = mapUpdateContractDto(contract, { description });
            const data = await contractService.update(contract.id, contractDto);
            if (data && setContract) {
                setContract(data);
                setIsFieldEdited(false);
                form.setDirty({ description: false });
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const description = e.target.value;
        setDescription(description);
        form.setFieldValue('description', description);
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            saveDescription();
        }
    };

    if (!abilityEdit && !description) {
        return null;
    }

    return (
        <div className={styles.descriptionField}>
            <div onClick={openEditingField}>
                <Textarea
                    id="contract-description"
                    placeholder="Add description..."
                    autosize
                    classNames={{
                        input: abilityEdit ? styles.description_style : styles.description_nostyle,
                    }}
                    onChange={(event) => onChange(event)}
                    onKeyDown={() => onKeyDown}
                    value={description}
                    maxLength={256}
                    withAsterisk
                    readOnly={!abilityEdit}
                    disabled={!abilityEdit}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {isFocused && (
                    <div className={styles.description_count}>
                        {countInput}
                        /256
                    </div>
                )}
            </div>
        </div>
    );
};

export default DescriptionField;
