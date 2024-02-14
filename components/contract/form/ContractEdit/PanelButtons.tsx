import React, { useState } from 'react';
import CustomButton from 'components/common/button/CustomButton';
import DeployContractButton2 from 'components/deploy/DeployContractButton2';
import { RedeployData } from 'types/contract/RedeployData';
import { useRouter } from 'next/router';
import DeleteIcon from 'components/common/icons/DeleteIcon';
import CustomModal from 'components/common/modal/CustomModal';
import { contractService } from 'services/api/contract';
import { ROUTES } from 'constants/routes';
import { useNotificationStore } from 'stores/NotificationStore';
import { ContractDto } from 'types/contract/ContractDto';
import styles from '../ContractNew/ContractNew.module.scss';

type PanelButtonsProps = {
    isViewMode: boolean;
    isOwner: boolean;
    isAuthor: boolean;
    isDraft: boolean;
    isController: boolean;
    isLoading: boolean;
    setOperationName: (value: string) => void;
    setIsViewMode: (value: boolean) => void;
    cancel: () => void;
    startDeploy: boolean;
    address: string | undefined;
    recipients: any;
    setPublishingStatus: (value: string) => void;
    isPending: boolean;
    mutabilityRecipients: boolean;
    chain: string;
    formData?: RedeployData;
    contract?: ContractDto;
}

const PanelButtons = ({
    isViewMode,
    isOwner,
    isAuthor,
    isDraft,
    isController,
    isLoading,
    setOperationName,
    setIsViewMode,
    cancel,
    startDeploy,
    address,
    recipients,
    contract,
    setPublishingStatus,
    isPending,
    mutabilityRecipients,
    chain,
    formData,
} : PanelButtonsProps) => {
    const router = useRouter();

    const notificationStore = useNotificationStore();
    const [isDeleteDraftModal, setIsDeleteDraftModal] = useState(false);

    let panelButtons;

    const deleteDraft = async () => {
        if (!contract || !contract.id) return;
        try {
            await contractService.deleteDraft(contract.id);
            router.push(`${ROUTES.CONTRACTS}?type=my&status=drafts`).then(() => {
                notificationStore?.success('Draft was deleted', false);
            });
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const cancelBtn = (
        <CustomButton
            name="Cancel"
            variant="ghost"
            color="black"
            style={{ width: 87, height: 48 }}
            onClick={cancel}
        />
    );

    const publish = (
        <DeployContractButton2
            setOperationName={() => setOperationName('publish')}
            startDeploy={startDeploy}
            address={address}
            recipients={recipients}
            name={isDraft ? 'Publish contract' : 'Publish changes'}
            contractId={contract?.id}
            setPublishingStatus={setPublishingStatus}
            isPending={isPending}
            autoNativeCurrencyDistribution={contract?.autoNativeCurrencyDistribution}
            mutabilityRecipients={mutabilityRecipients}
            chain={chain}
            isDraft={isDraft}
            contractAddress={contract?.address}
            formData={formData}
        />
    );

    if (isViewMode) {
        if (isDraft && (isOwner || isAuthor)) {
            panelButtons = (
                <div className={styles.buttons}>
                    <CustomButton
                        name="Delete this Draft"
                        variant="ghost"
                        color="black"
                        style={{ width: 87, height: 48 }}
                        onClick={() => setIsDeleteDraftModal(true)}
                        rightIcon={<DeleteIcon width="24" height="24" />}
                    />

                    <div className={styles.primaryBtns}>
                        <CustomButton
                            name="Edit this Draft"
                            color="blue"
                            style={{ width: 171, height: 48 }}
                            onClick={() => setIsViewMode(false)}
                        />
                    </div>
                </div>
            );
        } else if (!isDraft && (isOwner || isController)) {
            panelButtons = (
                <div className={styles.button}>
                    <CustomButton
                        name="Edit this Contract"
                        color="blue"
                        style={{ width: 171, height: 48 }}
                        onClick={() => setIsViewMode(false)}
                    />
                </div>
            );
        }
    }

    if (!isViewMode) {
        if (isDraft) {
            panelButtons = (
                <div className={styles.buttons}>
                    { cancelBtn }
                    <div className={styles.primaryBtns}>
                        <CustomButton
                            name="Save changes"
                            variant="outlined"
                            color="blue"
                            style={{ width: isLoading ? 177 : 141, height: 48 }}
                            onClick={() => setOperationName('draft')}
                            isLoading={isLoading}
                        />
                        {(isOwner || isAuthor) && publish}
                    </div>
                </div>
            );
        } else {
            panelButtons = (
                <div className={styles.buttons}>
                    { cancelBtn }
                    <div className={styles.primaryBtns}>
                        {publish}
                    </div>
                </div>
            );
        }
    }

    return (

        <>

            <CustomModal
                isOpen={isDeleteDraftModal}
                onClose={() => {
                    setIsDeleteDraftModal(false);
                }}
                onConfirm={deleteDraft}
                confirmBtnLabel="Delete"
                title="Delete this draft?"
                description="Warning! This action can not be undone."
            />
            <div>

                {panelButtons}
            </div>
        </>
    );
};

export default PanelButtons;
