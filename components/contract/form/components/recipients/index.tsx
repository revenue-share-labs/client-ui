import React, { MutableRefObject } from 'react';
import { ContractDto } from 'types/contract/ContractDto';
import userStore from 'stores/UserStore';
import { ContractStatusType } from 'types/common/ContractStatusType';
import RecipientViewMode from './viewMode/RecipientViewMode';
import styles from './Recipients.module.scss';
import Mutability from './editMode/Mutability';
import RecipientEditMode from './editMode/RecipientEditMode';
import { isUserController, isUserOwner } from '../../common/contractPermissions';

type RecipientsProps = {
  form: any;
  isViewMode?: boolean;
  contract?: ContractDto;
  refs: Record<string, MutableRefObject<HTMLDivElement | null>>;
  wallet?: string;
};

function Recipients({
    form, isViewMode, contract, refs, wallet,
}: RecipientsProps) {
    const { activeWallet } = userStore.userData;
    const isOwner = isUserOwner(contract, activeWallet);
    const isController = isUserController(contract, activeWallet);

    const isDraft = contract?.status === ContractStatusType.DRAFT;

    let recipientBlock;

    // Show edit mode for new contract/draft/ controller
    if (!contract || isController || isDraft) {
        recipientBlock = <RecipientEditMode form={form} />;
    } else if (contract && !isController) {
        recipientBlock = (
            <RecipientViewMode
                recipients={form.values.recipients}
                mutabilityRecipients={!contract?.isRecipientsLocked}
                controller={contract.controller?.address}
                chain={contract?.chain}
                status={contract.status}
            />
        );
    }

    if (isViewMode && contract) {
        return (
            <>
                <div
                    className={`${styles.recipients} ${isViewMode ? styles.viewMode_bg : ''}`}
                >
                    <RecipientViewMode
                        recipients={form.values.recipients}
                        mutabilityRecipients={!contract?.isRecipientsLocked}
                        controller={contract.controller?.address}
                        chain={contract?.chain}
                        status={contract.status}
                    />
                </div>
                <div className={styles.dividerHorizontal} />
            </>
        );
    }

    return (
        <>

            <div
                className={`${styles.recipients} ${isViewMode ? styles.viewMode_bg : ''}`}
                ref={refs.recipients}
            >
                {recipientBlock}
            </div>

            <Mutability
                wallet={wallet}
                form={form}
                isViewMode={isViewMode}
                isOwner={isOwner}
                contract={contract}
                refs={refs}
            />
        </>
    );
}

export default Recipients;
