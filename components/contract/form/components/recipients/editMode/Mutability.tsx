import React, { MutableRefObject, useEffect, useState } from 'react';
import Image from 'next/image';
import CustomTooltip from 'components/common/tooltip';
import warningHint from 'public/icons/warning-hint.svg';
import info from 'public/icons/info-circle.svg';
import { CustomInput } from 'components/common/input/CustomInput';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import CustomButton from 'components/common/button/CustomButton';
import CustomSwitch from 'components/common/switch';
import { truncateFromMiddle } from 'utils/string';
import { ContractDto } from 'types/contract/ContractDto';
import { ContractStatusType } from 'types/common/ContractStatusType';
import styles from './Mutability.module.scss';

type MutabilityProps = {
    wallet?: string;
    form: any;
    isViewMode?: boolean;
    contract?: ContractDto;
    isOwner?: boolean;
    refs: Record<string, MutableRefObject<HTMLDivElement | null>>;
}

const warningImg = (
    <Image
        src={warningHint.src}
        className={styles.infoImg}
        alt="Information image"
        width={24}
        height={24}
    />
);

const infoImg = (
    <Image
        src={info.src}
        className={styles.infoImg}
        alt="Information image"
        width={24}
        height={24}
    />
);

const warningHintText = 'After the contract is published, this setting cannot be changed.';
const recipientsLockedWarming = 'Once the contract is published you cannot change the address of the controller'
    + ' and this parameter will be irreversible.';

const mutabilityHintText = 'Mutability allows you to edit certain aspects of recipients such '
    + 'as recipients, shares, queue, max cap.';

const Mutability = ({
    wallet, form, isViewMode, contract, isOwner, refs,
}: MutabilityProps) => {
    const [controllerAddress, setControllerAddress] = useState(
        form.getInputProps(`${'controller'}`).value,
    );
    const [isFocused, setIsFocused] = useState(false);
    const [isLockedAddressEditing, setIsLockedAddressEditing] = useState(form.getInputProps(`${'lockAddressEditing'}`).value);
    const [mutabilityRecipients, setMutabilityRecipients] = useState(form.getInputProps(`${'mutabilityRecipients'}`).value);

    const isPublished = contract?.status === ContractStatusType.PUBLISHED;
    const isDraft = !contract || contract?.status === ContractStatusType.DRAFT;
    const isChangeControllerDisabled = contract && isPublished && contract.immutableController;

    // show this block for only new contract/draft/published contract for owner
    const isShowMutabilityRecipientsBlock = !!(!contract || isDraft || (isPublished && isOwner));

    useEffect(() => {
        if (!mutabilityRecipients && !isChangeControllerDisabled) {
            onChangeController('');
            onChangeLockAddressEditing(false);
        }
    }, [mutabilityRecipients]);

    const addToCurrentWalletToController = () => {
        if (wallet) {
            onChangeController(wallet);
        }
    };

    const setFormField = (field: string, value: string | boolean) => {
        form.setFieldValue(field, value);
    };

    const onChangeController = (value: string) => {
        setControllerAddress(value);
        setFormField('controller', value);
    };

    const onChangeMutabilityRecipients = (value: boolean) => {
        setMutabilityRecipients(value);
        setFormField('mutabilityRecipients', value);
    };

    const onChangeLockAddressEditing = (value: boolean) => {
        setIsLockedAddressEditing(value);
        setFormField('lockAddressEditing', value);
    };

    const walletBtn = (
        <CustomButton
            name={wallet && truncateFromMiddle(wallet)}
            color="blue"
            variant="outlined"
            style={{ width: '122px', height: '32px', fontSize: '14px' }}
            radius={12}
            onClick={addToCurrentWalletToController}
        />
    );

    const controllerInput = (
        <CustomInput
            style={{
                width: '344px',
            }}
            maxLength={100}
            placeholder="0x0000...0000"
            error={form.errors.controller}
            rightSection={wallet && !form.getInputProps('controller').value && walletBtn}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            value={isFocused ? controllerAddress : truncateFromMiddle(controllerAddress)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeController(e.target.value)}
            disabled={isChangeControllerDisabled}
        />
    );

    const controllerBlock = (
        <div className={styles.controller}>
            {controllerInput}

            <div className={styles.recipientsLocked}>
                <CustomCheckbox
                    checked={isLockedAddressEditing}
                    onChange={onChangeLockAddressEditing}
                    label="Lock address editing"
                    disabled={isChangeControllerDisabled}
                />

                {
                    isLockedAddressEditing && !isViewMode && isDraft
                    && <CustomTooltip text={recipientsLockedWarming} btn={warningImg} />
                }

            </div>

        </div>
    );

    // Don't show this block for view mode/ published contract with isRecipientsLocked = true
    if (isViewMode || (contract && isPublished && contract.isRecipientsLocked)) {
        return null;
    }

    if (isShowMutabilityRecipientsBlock) {
        return (
            <div className={styles.mutability} ref={refs.mutabilityRecipients}>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <div className={styles.title}>Recipients mutability</div>
                        <CustomSwitch
                            checked={mutabilityRecipients}
                            onChange={(e) => {
                                onChangeMutabilityRecipients(e.target.checked);
                            }}
                        />
                        {!isViewMode && isDraft && <CustomTooltip text={warningHintText} btn={warningImg} />}
                    </div>

                    <div className={styles.tag}>
                        <div className={styles.name}>Mutability</div>
                        <CustomTooltip text={mutabilityHintText} btn={infoImg} />
                    </div>
                </div>

                {/* Only owner can edit this block */}
                {mutabilityRecipients && controllerBlock}

            </div>
        );
    }

    return null;
};

export default Mutability;
