import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDisclosure } from '@mantine/hooks';
import { Switch, Tooltip } from '@mantine/core';

import CustomButton from 'components/common/button/CustomButton';

import chevronDownIcon from 'public/icons/chevron-down.svg';
import checkIcon from 'public/icons/check.svg';
import linkIcon from 'public/icons/link.svg';
import infoIcon from 'public/icons/information-circle.svg';

import { CustomInput } from 'components/common/input/CustomInput';
import { notificationStore } from 'stores/NotificationStore';
import CustomSelect from 'components/common/select/CustomSelect';

import { ContractDto } from 'types/contract/ContractDto';
import { contractService } from 'services/api/contract';
import { ContractStatusType } from 'types/common/ContractStatusType';

import { COPY_LINK } from 'constants/notificationMessage';
import { labelTooltip, shareList, socialList } from './constants';

import styles from './Share.module.scss';
import { mapUpdateVisibilityContractDto } from '../../common/dataMapping';

type ShareProps = {
  contract?: ContractDto;
  setContract?: (value: ContractDto) => void;
};
interface ItemProps {
  label: string;
}

const TypeItem = ({ label, ...others }: ItemProps) => {
    return (
        <div {...others}>
            <div className={styles.item}>
                <div className={styles.label}>{label}</div>
                <Image src={checkIcon.src} alt="check" width={24} height={24} />
            </div>
        </div>
    );
};

export const ShareContent = ({ contract, setContract }: ShareProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const [isOpen, setOpen] = useState(false);
    const [isSelect, setSelect] = useState(shareList[0]);
    const [opened, { close, open }] = useDisclosure(false);
    const [link, setLink] = useState('');

    const [checked, setChecked] = useState(false);
    const [disabledSwitch, setDisabledSwitch] = useState(false);

    useEffect(() => {
        if (contract && contract.visibility === 'COMMUNITY') {
            setChecked(true);
        }
    }, [contract]);

    const onChangeVisibility = async (visibility: string) => {
        try {
            if (contract && contract.id) {
                const contractDto = mapUpdateVisibilityContractDto(
                    contract,
                    visibility,
                );
                setDisabledSwitch(true);
                const data = await contractService.update(contract.id, contractDto);

                if (data && setContract) {
                    setContract(data);
                    setDisabledSwitch(false);
                }
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const copyLink = (link: string) => {
        if (!link) return;
        navigator?.clipboard?.writeText(link);
        notificationStore.success(COPY_LINK);
    };
    const onClickSelect = (value: string) => {
        const select = shareList.find((item) => item.value === value);
        if (select) {
            setSelect(select);
        }
        setOpen(!isOpen);
    };

    const onChangeSwitch = async (event: React.ChangeEvent<HTMLInputElement>) => {
        onChangeVisibility(checked ? 'PRIVATE' : 'COMMUNITY');
        setChecked(event.currentTarget.checked);
    };

    const isDraft = contract?.status === ContractStatusType.DRAFT;

    return (
        <>
            {/* Hidden block create link EXLP-1094 */}
            {/* <div className={styles.select}>
                {shareList.length > 1 ? (
                    <div className={styles.select__input}>
                        <CustomSelect
                            data={shareList}
                            iconLeft={(
                                <Image
                                    src={isSelect.icon}
                                    alt={isSelect.value}
                                    width={13}
                                    height={13}
                                />
                            )}
                            icon={(
                                <Image
                                    src={chevronDownIcon.src}
                                    alt="Chevron icon"
                                    width={24}
                                    height={24}
                                />
                            )}
                            onChange={(e) => onClickSelect(e)}
                            value={isSelect.label}
                            customItem={TypeItem}
                            newClassnames={{
                                root: styles.root,
                                item: styles.item,
                                input: styles.input,
                                wrapper: styles.wrapper,
                                rightSection: styles.icon,
                                icon: styles.iconLeft,
                            }}
                        />
                    </div>
                ) : (
                    <div className={styles.select__button}>
                        <div className={styles.select__button__title}>
                            <Image
                                src={shareList[0].icon.src}
                                width={13}
                                height={13}
                                alt={shareList[0].value}
                            />
                        </div>

                        <div className={styles.select__button__label}>
                            {shareList[0].label}
                        </div>
                    </div>
                )}
            </div> */}

            {/* <div className={styles.socials}>
                {socialList.map((it) => {
                    return (
                        <div key={it.value} className={styles.socials__item}>
                            <Image width={52} height={52} src={it.icon} alt={it.value} />
                            {it.label}
                        </div>
                    );
                })}
            </div>

            <div className={styles.copy}>
                <CustomInput
                    defaultValue={link}
                    id="contract-name"
                    maxLength={100}
                    readOnly
                    disabled
                />
                <CustomButton
                    name="Copy link"
                    radius={12}
                    leftIcon={<Image src={linkIcon.src} alt="" width={20} height={20} />}
                    onClick={() => copyLink(link)}
                />
            </div> */}

            {contract && (
                <div className={styles.community}>
                    <Switch
                        label="Share with Community"
                        size="md"
                        color="green"
                        classNames={{
                            track: styles.track,
                            label: styles.label,
                            thumb: styles.thumb,
                        }}
                        checked={checked}
                        disabled={disabledSwitch}
                        onChange={(event) => onChangeSwitch(event)}
                    />

                    <Tooltip
                        multiline
                        width={220}
                        withArrow
                        arrowPosition="center"
                        label={labelTooltip}
                        classNames={{ tooltip: styles.tooltip }}
                    >
                        <Image
                            src={infoIcon}
                            className={styles.info}
                            width={24}
                            height={24}
                            alt="info"
                            onMouseEnter={open}
                            onMouseLeave={close}
                        />
                    </Tooltip>
                </div>
            )}
        </>
    );
};
