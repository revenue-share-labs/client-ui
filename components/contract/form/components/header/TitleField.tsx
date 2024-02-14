import React, { useEffect, useState } from 'react';
import { CustomInput } from 'components/common/input/CustomInput';
import { ContractDto } from 'types/contract/ContractDto';
import { contractService } from 'services/api/contract';
import { useAccount } from 'wagmi';
import { isValidString } from 'utils/string';
import { validateTitle } from 'utils/form';
import { useNotificationStore } from 'stores/NotificationStore';
import { TITLE_ERROR } from 'utils/validationMessages';
import { Tooltip } from '@mantine/core';
import { mapUpdateContractDto } from '../../common/dataMapping';
import styles from './HeaderEditor.module.scss';

type TitleFieldProps = {
  form: any;
  contract?: ContractDto;
  setContract?: (value: ContractDto) => void;
  isOwner?: boolean;
  isAuthor?: boolean;
  isDraft?: boolean;
};

const fieldName = 'title';

const TitleField = ({
    form,
    contract,
    setContract,
    isOwner,
    isAuthor,
    isDraft,
}: TitleFieldProps) => {
    const [title, setTitle] = useState(form.getInputProps(fieldName).value);
    const { address } = useAccount();

    const notificationStore = useNotificationStore();

    const [isFocused, setIsFocused] = useState(false);

    const [isNameEdited, setIsNameEdited] = useState(false);

    let showEditingNameBtn;
    if (isDraft) {
        showEditingNameBtn = contract?.id ? isOwner || isAuthor : true;
    } else {
        showEditingNameBtn = isOwner;
    }

    const openEditingName = () => {
        setIsNameEdited(true);
    };

    useEffect(() => {
        if (!isFocused && (isOwner || isAuthor)) {
            saveName();
        }
    }, [isFocused]);

    useEffect(() => {
        if (isNameEdited) {
            document.getElementById('contract-name')?.focus();
        }
    }, [isNameEdited]);

    const saveName = async () => {
        const value = form.getInputProps(fieldName).value?.trim();
        form.setFieldValue(fieldName, value);
        setIsNameEdited(false);

        const error = validateTitle(value);
        if (error) {
            form.setFieldError(fieldName, error);
            return;
        }
        if (!contract || !contract.id || contract.title === value) {
            return;
        }

        try {
            const contractDto = mapUpdateContractDto(contract, { title });
            const data = await contractService.update(contract.id, contractDto);
            if (data && setContract) {
                setContract(data);
                setIsNameEdited(false);
                form.setDirty({ title: false });
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setTitle(title);
        form.setFieldValue(fieldName, title);

        if (!isValidString(title)) {
            form.setFieldError(fieldName, TITLE_ERROR);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            saveName();
        }
    };

    return (
        <Tooltip
            label={form.errors.title}
            opened={Boolean(form.errors.title)}
            position="left"
            withArrow
            offset={20}
            color="#3E3E3E"
            classNames={{
                tooltip: form.errors.title ? styles.tooltip : styles.tooltip__none,
                arrow: styles.arrow,
            }}
        >
            <div className={styles.titleField}>
                <div className={styles.inputName} onClick={openEditingName}>
                    <CustomInput
                        placeholder="Enter contract name"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={title}
                        id="contract-name"
                        classNames={{
                            input: showEditingNameBtn ? styles.title_style : styles.title_nostyle,
                        }}
                        className={form.errors.title && styles.error}
                        readOnly={!showEditingNameBtn}
                        disabled={!showEditingNameBtn}
                        notStyle
                        labelError={false}
                        error={form.errors.title}
                        maxLength={100}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />
                </div>
            </div>
        </Tooltip>
    );
};

export default TitleField;
