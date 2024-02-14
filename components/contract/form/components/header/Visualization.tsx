import React, {
    useState, useRef, useEffect, useCallback,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@mantine/core';

import { contractService } from 'services/api/contract';
import { notificationStore } from 'stores/NotificationStore';

import settingIcon from 'public/icons/settings.svg';
import linkExImg from 'public/icons/external-link-white.svg';
import addIcon from 'public/icons/add.svg';
import linkIcon from 'public/icons/link.svg';

import { ContractDto } from 'types/contract/ContractDto';
import CustomButton from 'components/common/button/CustomButton';
import { CustomInput } from 'components/common/input/CustomInput';
import { isValidUrl } from 'utils/form';
import { URL_ERROR } from 'utils/validationMessages';
import { mapUpdateContractDto } from '../../common/dataMapping';

import styles from './HeaderEditor.module.scss';

type VisualizationProps = {
  form: any;
  contract?: ContractDto;
  setContract?: (value: ContractDto) => void;
  isOwner?: boolean;
  title?: string;
};

const fieldName = 'visualizationUrl';

const Visualization = ({
    contract,
    form,
    setContract,
    isOwner,
    title,
}: VisualizationProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (visible && inputRef.current) {
            if (form.getInputProps(fieldName).value !== 'https://') {
                inputRef.current.select();
                inputRef.current.focus();
            }
        }
    }, [visible]);

    useEffect(() => {
        if (!isFocused) {
            setVisible(false);
            saveUrl();
        }
    }, [isFocused]);

    const visibleLinkBtn = isOwner || contract?.visualizationUrl || form.getInputProps(fieldName).value;
    const visibleAddBtn = !contract?.visualizationUrl && (!form.getInputProps(fieldName).value || visible);

    const getValidLink = useCallback(
        () => {
            if (form.getInputProps(fieldName).value
            && !form.getInputProps(fieldName).value.startsWith('http://')
            && !form.getInputProps(fieldName).value.startsWith('https://')) {
                return `https://${form.getInputProps(fieldName).value}`;
            }
            return form.getInputProps(fieldName).value;
        },
        [form.getInputProps(fieldName).value],
    );

    const saveUrl = async () => {
        const { value } = form.getInputProps(fieldName);

        if (!value) {
            form.setFieldValue(fieldName, null);
        }

        if (!contract || !contract.id || contract.visualizationUrl === value || form.errors.visualizationUrl) {
            form.setFieldValue(fieldName, (contract && contract!.visualizationUrl)
            || (form.errors.visualizationUrl ? '' : value));
            form.clearErrors();
            return;
        }

        try {
            let correctUrl = value || null;
            if (correctUrl && !correctUrl.startsWith('http://') && !correctUrl.startsWith('https://')) {
                correctUrl = `https://${correctUrl}`;
            }
            const contractDto = mapUpdateContractDto(contract, {
                visualizationUrl: correctUrl || null,
            });
            const data = await contractService.update(contract.id, contractDto);

            if (data && setContract) {
                setContract(data);
                form.setDirty({ visualizationUrl: false });
            }
        } catch (e: any) {
            form.setFieldValue(fieldName, contract.visualizationUrl || '');
            notificationStore?.error({ text: e.message });
        }
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        form.setFieldValue(fieldName, value);

        if (value && (value.startsWith('http://') || value.startsWith('https://'))) {
            if (!isValidUrl(value)) {
                form.setFieldError(fieldName, URL_ERROR);
            }
        } else if (!isValidUrl(`https://${value}`)) {
            form.setFieldError(fieldName, URL_ERROR);
        }

        if (!value) {
            form.clearErrors();
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            e.preventDefault();
            setVisible(false);
            saveUrl();
        }
    };

    const input = () => {
        return (
            <div className={styles.addLink}>
                <CustomInput
                    placeholder="Type or paste URL"
                    value={form.getInputProps(fieldName).value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    error={form.errors.visualizationUrl}
                    refs={inputRef}
                    rightSection={(
                        <Image
                            src={linkIcon}
                            width={21}
                            height={21}
                            alt="visualization url icon"
                        />
                    )}
                    classNames={{
                        rightSection: styles.rightSection,
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
            </div>
        );
    };

    if (!isOwner && contract && contract.visualizationUrl) {
        return (
            <Link href={contract.visualizationUrl} target="_blank">
                <CustomButton
                    name="Visualization"
                    variant="ghost"
                    color="white"
                    style={{
                        borderBottomLeftRadius: 12,
                        borderTopLeftRadius: 12,
                        height: 32,
                    }}
                    leftIcon={(
                        <Image
                            src={linkExImg}
                            width={16}
                            height={16}
                            alt="visualization url icon"
                        />
                    )}
                />
            </Link>
        );
    }

    if (((isOwner || title === 'creating') && visibleAddBtn)) {
        return (
            <div className={styles.viewlegal}>
                <CustomButton
                    onClick={() => setVisible((m) => !m)}
                    onMouseDown={(e) => e.preventDefault()}
                    name="Visualization"
                    variant="filled"
                    color="black"
                    radius={10}
                    style={{ fontSize: '14px', height: 32 }}
                    leftIcon={(
                        <Image
                            src={addIcon.src}
                            width={16}
                            height={16}
                            alt="visualization url icon"
                        />
                    )}
                />

                {visible && input()}
            </div>
        );
    }

    return (
        <div className={styles.viewlegal}>
            <Button.Group>
                {visibleLinkBtn && (
                    <>
                        <Link href={contract?.visualizationUrl || getValidLink()} target="_blank">
                            <CustomButton
                                name="Visualization"
                                variant="ghost"
                                color="white"
                                style={{
                                    borderBottomLeftRadius: 12,
                                    borderTopLeftRadius: 12,
                                    height: 32,
                                }}
                                leftIcon={(
                                    <Image
                                        src={linkExImg}
                                        width={16}
                                        height={16}
                                        alt="visualization url icon"
                                    />
                                )}
                            />
                        </Link>
                        <CustomButton
                            variant="ghost"
                            onClick={() => setVisible(!visible)}
                            onMouseDown={(e) => e.preventDefault()}
                            color="white"
                            radius={10}
                            styles={{
                                leftIcon: { margin: 0, padding: 0 },
                            }}
                            style={{
                                borderBottomRightRadius: 12,
                                borderTopRightRadius: 12,
                                height: 32,
                            }}
                            leftIcon={(
                                <Image
                                    src={settingIcon}
                                    width={16}
                                    height={16}
                                    alt="visualization url icon"
                                />
                            )}
                        />
                        {visible && input()}
                    </>
                )}
            </Button.Group>
        </div>
    );
};

export default Visualization;
