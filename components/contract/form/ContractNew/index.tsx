import React, {
    MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/router';
import CustomButton from 'components/common/button/CustomButton';
import { useForm } from '@mantine/form';
import { ScrollArea } from '@mantine/core';
import CustomModal from 'components/common/modal/CustomModal';
import { ContractDto } from 'types/contract/ContractDto';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { useWalletConnected } from 'utils/hooks/useWalletConnected';
import { contractService } from 'services/api/contract';
import { ContractStatusType } from 'types/common/ContractStatusType';
import { ToastDescriptionType } from 'types/common/ToastDescriptionType';
import { useNotificationStore } from 'stores/NotificationStore';
import DeployContractButton2 from 'components/deploy/DeployContractButton2';
import { switchNetwork } from '@wagmi/core';
import { chainList } from 'utils/getChain';
import { TrackGoogleAnalyticsEvent } from 'utils/google-analytics';
import { handleSubmitError } from '../common/processingError';
import { getContractFormState } from '../common/getContractFormState';
import Recipients from '../components/recipients';
import Settings from '../components/settings';
import styles from './ContractNew.module.scss';
import HeaderEditor from '../components/header/HeaderEditor';
import { mapContractDto, mapCurrentChain } from '../common/dataMapping';

type ContractNewProps = {
    contract?: ContractDto;
    setStep?: (value: number) => void;
};

const successTitle = 'Draft has been saved';

const ContractNew = ({ contract, setStep }: ContractNewProps) => {
    const router = useRouter();
    const notificationStore = useNotificationStore();
    const { chain } = useNetwork();

    const [operationName, setOperationName] = useState('');

    const form = useForm(getContractFormState({ contract, operationName }));
    const [isChangesLostModalOpen, setIsChangesLostModalOpen] = useState(false);
    const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const isDraft = contract?.status === ContractStatusType.DRAFT;
    const isPending = contract?.status === ContractStatusType.PENDING;

    const { openConnectModal } = useConnectModal();
    const { address, isConnected } = useAccount();
    useWalletConnected();

    const [startDeploy, setStartDeploy] = useState<boolean>(false);
    const [recipients, setRecipients] = useState([]);

    const refs: Record<string, MutableRefObject<HTMLDivElement | null>> = {
        settings: useRef<HTMLDivElement | null>(null),
        recipients: useRef<HTMLDivElement | null>(null),
        title: useRef<HTMLDivElement | null>(null),
        mutabilityRecipients: useRef<HTMLDivElement | null>(null),
    };

    const cancel = () => {
        if (form.isDirty()) setIsChangesLostModalOpen(true);
        else onConfirmCancel();
    };

    useEffect(() => {
        (async () => {
            if (operationName === 'draft') {
                await saveAsDraft();
            } else if (operationName === 'publish') {
                await createContract();
            }
        })().then(() => {
            setOperationName('');
        });
    }, [operationName]);

    // Save draft
    const saveAsDraft = async () => {
        const { errors, hasErrors } = form.validate();
        if (hasErrors) {
            await handleSubmitError(errors, refs);
            return;
        }

        setIsLoading(true);

        const contractDto = mapContractDto(form.values, address);
        try {
            const res = await contractService.createDraft(contractDto);

            if (res && res.id) {
                const draftId = res.id;
                const description = {
                    type: ToastDescriptionType.DRAFT_CREATED,
                    contractTitle: form.values.title,
                    contractId: draftId,
                };
                router.replace(`/contract/${draftId}`).then(() => {
                    notificationStore?.success(successTitle, true, description);
                });
                TrackGoogleAnalyticsEvent('contract_draft_created', draftId);
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    // all validations for deploy contract, then run deploy
    const createContract = async () => {
        const { errors, hasErrors } = form.validate();
        if (hasErrors) {
            setStartDeploy(false);
            await handleSubmitError(errors, refs);
            return;
        }

        // check connected wallet
        if (!address || !isConnected) {
            setIsConnectWalletModalOpen(true);
            return;
        }

        // Check and change network if it needed
        const currentChain = chainList.find((obj) => obj.value === form.values.chain);
        if (currentChain && currentChain?.id !== chain?.id) {
            try {
                await switchNetwork({ chainId: currentChain.id });
            } catch (e) {
                return;
            }
        }
        deploy();
    };

    // run deploy
    const deploy = () => {
        try {
            const recipients: any = form.values.recipients.map((item) => {
                return { address: item.address, percentage: item.revenue };
            });
            setRecipients(recipients);
            setStartDeploy(true);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const onConfirmCancel = () => {
        if (contract?.id) router.back();
        else if (setStep) setStep(1);
    };

    const connectWallet = () => {
        setIsConnectWalletModalOpen(false);
        if (openConnectModal) openConnectModal();
    };

    const back = () => {
        if (form.isTouched()) {
            setIsChangesLostModalOpen(true);
        } else {
            onConfirmCancel();
        }
    };

    return (
        <>
            <CustomModal
                isOpen={isChangesLostModalOpen}
                onClose={() => setIsChangesLostModalOpen(false)}
                onConfirm={onConfirmCancel}
                confirmBtnLabel="Confirm"
                title="You are leaving this page"
                description="All changes will be lost, and your contract will not be saved. If you want to save it, you can use “save as draft”."
                confirmBtnLoading={isLoading}
            />

            <CustomModal
                isOpen={isConnectWalletModalOpen}
                onClose={() => setIsConnectWalletModalOpen(false)}
                onConfirm={connectWallet}
                confirmBtnLabel="Connect"
                title="Connect a wallet"
                description="Before deploying a contract, you need to connect your wallet."
                confirmBtnLoading={isLoading}
            />

            <div className={styles.container}>
                <ScrollArea className={styles.scrollAreaCalc}>
                    <form className={styles.form}>
                        <HeaderEditor form={form} back={back} isDraft={isDraft} refs={refs} />
                        <Recipients form={form} refs={refs} wallet={address} />
                        <Settings refs={refs} form={form} />
                    </form>
                </ScrollArea>
                <div className={styles.buttonPanel}>
                    <div className={styles.buttons}>
                        <CustomButton
                            name="Cancel"
                            variant="ghost"
                            color="black"
                            style={{ width: 87, height: 48 }}
                            onClick={cancel}
                        />
                        <div className={styles.primaryBtns}>
                            <CustomButton
                                name="Save as draft"
                                variant="outlined"
                                color="blue"
                                style={{ width: isLoading ? 177 : 141, height: 48 }}
                                onClick={() => setOperationName('draft')}
                                isLoading={isLoading}
                            />
                            <DeployContractButton2
                                setOperationName={() => {
                                    setOperationName('publish');
                                }}
                                startDeploy={startDeploy}
                                address={address}
                                recipients={recipients}
                                name="Publish contract"
                                contractId={contract?.id}
                                isPending={isPending}
                                autoNativeCurrencyDistribution={
                                    contract?.autoNativeCurrencyDistribution
                                        ? contract.autoNativeCurrencyDistribution
                                        : form.values.distribution === 'AUTO'
                                }
                                mutabilityRecipients={form.values.mutabilityRecipients}
                                chain={mapCurrentChain(form.values.chain)}
                                contractDto={mapContractDto(form.values, address)}
                                isDraft
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContractNew;
