import React, {
    MutableRefObject, useEffect, useRef, useState,
} from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork } from 'wagmi';
import { useForm } from '@mantine/form';
import { ScrollArea } from '@mantine/core';

import { contractService } from 'services/api/contract';
import { ContractDto } from 'types/contract/ContractDto';
import { ContractStatusType } from 'types/common/ContractStatusType';

import CustomModal from 'components/common/modal/CustomModal';
import PendingDeploy from 'components/common/deploy/PendingDeploy';
import FullScreenModal from 'components/common/modal/FullScreenModal';
import Banner from 'components/common/banner/banner';

import { useWalletConnected } from 'utils/hooks/useWalletConnected';
import { truncateFromMiddle } from 'utils/string';

import { useNotificationStore } from 'stores/NotificationStore';
import { useTransactionsStore } from 'stores/TransactionStore';
import userStore from 'stores/UserStore';
import { useAuthStore } from 'stores/AuthStore';

import { ROUTES } from 'constants/routes';

import xlaLogo from 'public/images/XLA_logo.svg';

import { updateDataAfterRedeploy } from 'components/monitoring';
import { RedeployData } from 'types/contract/RedeployData';
import { switchNetwork } from '@wagmi/core';
import { chainList } from 'utils/getChain';
import { handleSubmitError } from '../common/processingError';
import { mapContractDto, mapCurrentChain } from '../common/dataMapping';
import { getContractFormState } from '../common/getContractFormState';
import Recipients from '../components/recipients';
import Settings from '../components/settings';
import styles from '../ContractNew/ContractNew.module.scss';
import HeaderEditor from '../components/header/HeaderEditor';
import PanelButtons from './PanelButtons';
import {
    isUserAuthor, isUserController, isUserOwner, isUserRecipient,
} from '../common/contractPermissions';

type EditContractProps = {
    contract: ContractDto;
    setContract: (value: ContractDto) => void;
    visibility: boolean;
};

const leavingModalTitle = 'You are leaving this page';
const leavingModalDescription = 'The changes have not been saved yet. Are you sure you want to leave this page?';
const changesTitle = 'Changes have been saved';
const beforeDeployError = 'Please save changes before start deploy contract';
const noChanges = 'Please make a changes before start deploy contract';

function EditForm({
    contract,
    setContract,
    visibility,
}: EditContractProps) {
    const router = useRouter();
    const notificationStore = useNotificationStore();
    const authStore = useAuthStore();

    const [operationName, setOperationName] = useState('');

    const form = useForm(getContractFormState({
        contract,
        operationName,
    }));
    const [isViewMode, setIsViewMode] = useState(true);

    const [isLeaveEditingPage, setIsLeaveEditingPage] = useState(false);
    const [isChangesLostModalOpen, setIsChangesLostModalOpen] = useState(false);
    const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] = useState(false);
    const [isChangeWalletModalOpen, setIsChangeWalletModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [startDeploy, setStartDeploy] = useState<boolean>(false);
    const [recipients, setRecipients] = useState([]);
    const [formData, setFormData] = useState<RedeployData>({});

    const { openConnectModal } = useConnectModal();
    const { chain } = useNetwork();

    const {
        address,
        isConnected,
    } = useAccount();
    useWalletConnected();

    const isPublished = contract.status === ContractStatusType.PUBLISHED;
    const isDraft = contract.status === ContractStatusType.DRAFT;
    const isPending = contract.status === ContractStatusType.PENDING;

    const {
        id,
        activeWallet,
    } = userStore.userData;
    const isOwner = isUserOwner(contract, activeWallet);
    const isAuthor = isUserAuthor(contract, id);
    const isController = isUserController(contract, activeWallet);

    let isShowPanelBtn;
    if (isPending) {
        isShowPanelBtn = false;
    } else {
        isShowPanelBtn = isDraft ? (isAuthor || isOwner) : (isOwner || isController);
    }

    const [publishingStatus, setPublishingStatus] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [deployComplete, setDeployComplete] = useState<boolean>(false);
    const [isRedeploy, setIsRedeploy] = useState<boolean>(false);

    const transactionStore = useTransactionsStore();

    const refs: Record<string, MutableRefObject<HTMLDivElement | null>> = {
        settings: useRef<HTMLDivElement | null>(null),
        recipients: useRef<HTMLDivElement | null>(null),
        title: useRef<HTMLDivElement | null>(null),
        description: useRef<HTMLDivElement | null>(null),
        mutabilityRecipients: useRef<HTMLDivElement | null>(null),
    };

    useEffect(() => {
        (async () => {
            if (operationName === 'draft') {
                await saveChanges();
            } else if (operationName === 'publish') {
                await createContract();
            }
        })()
            .then(() => {
                setOperationName('');
            });
    }, [operationName]);

    // run when we change status to PENDING
    useEffect(() => {
        (async () => {
            // change to PUBLISHED was implemented using monitoring
            if (contract.id && publishingStatus !== '') {
                let payload = {};
                if (publishingStatus === ContractStatusType.PENDING) {
                    payload = {
                        status: ContractStatusType.PENDING,
                    };
                    setDeployComplete(false);
                    setIsRedeploy(false);
                }

                const newData = await contractService.updateStatus(
                    contract.id,
                    payload,
                );
                setContract(newData);
                setIsViewMode(true);
            }
        })()
            .then(() => {
                setPublishingStatus('');
            });
    }, [publishingStatus]);

    // check transactionStore
    useEffect(() => {
        const interval = setInterval(async () => {
            // monitoring current contract
            monitoringCurrentContract()
                .then((contractId) => {
                    if (contractId) {
                        transactionStore.remove(contractId);
                        transactionStore.removePublishedContract(contractId);
                    }
                });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    // if user are on the contract page, change status to PUBLISHED if current id exists in transactionStore
    const monitoringCurrentContract = async () => {
        const publishedContracts = transactionStore.getCurrentPublishedContracts();
        const currentContract = publishedContracts.find((item: any) => item.id === contract.id && item.address);

        if (currentContract && contract.id) {
            let newData;
            let redeploy = false;
            // If we have data, it's redeployment of contract, else first deploy
            if (currentContract.data) {
                newData = await updateDataAfterRedeploy(contract, currentContract.address, currentContract.data);
                redeploy = true;
            } else {
                newData = await contractService.updateStatus(
                    contract.id,
                    {
                        status: ContractStatusType.PUBLISHED,
                        address: currentContract.address,
                    },
                );
            }
            if (newData) {
                setContractAddress(currentContract.address);
                setContract(newData);
                if (redeploy) {
                    setIsRedeploy(true);
                }
                setDeployComplete(true);
                return currentContract.id;
            }
        }

        return null;
    };

    // Save changes for draft
    const saveChanges = async () => {
        setIsLoading(true);

        const {
            errors,
            hasErrors,
        } = form.validate();
        if (hasErrors) {
            await handleSubmitError(errors, refs);
            setIsLoading(false);
            return;
        }

        try {
            await updateDraft();
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
            setIsLoading(false);
        }
    };

    // All validations for publish contract or redeploy contract, after run deploy
    const createContract = async () => {
        const {
            errors,
            hasErrors,
        } = form.validate();
        if (hasErrors) {
            await handleSubmitError(errors, refs);
            setStartDeploy(false);
            return;
        }
        // User should connect a wallet
        if (!address || !isConnected) {
            setIsConnectWalletModalOpen(true);
            return;
        }

        // If user wanted to deploy contract, his wallet is owner of this draft
        if (address !== contract.owner?.address) {
            setIsChangeWalletModalOpen(true);
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

        await deploy();
    };

    // Deploy contract
    const deploy = async () => {
        try {
            if (!isDraft && !form.isDirty()) {
                notificationStore?.info({ text: noChanges });
            } else if (contract.id) {
                // if it's draft, we need to save changes, but it doesn't make it for redeploy
                // All changes for redeploy we'll make after transaction will finish
                if (contract.status === ContractStatusType.DRAFT) {
                    await updateDraft();
                }
                const recipients: any = form.values.recipients.map((item) => {
                    return {
                        address: item.address,
                        percentage: item.revenue,
                    };
                });
                const { values } = form;
                const passData = {
                    controller: values.controller,
                    recipients: values.recipients,
                    isRecipientsLocked: !values.mutabilityRecipients,
                    immutableController: values.lockAddressEditing,
                };
                setFormData(passData);
                setRecipients(recipients);
                setStartDeploy(true);
            }
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const updateDraft = async () => {
        const contractDto = mapContractDto(form.values, address);
        if (contract.id) {
            const newData = await contractService.update(contract.id, contractDto);
            setContract(newData);
            form.resetDirty();
            setIsLoading(false);
            notificationStore?.success(changesTitle);
        }
    };

    const connectWallet = () => {
        setIsConnectWalletModalOpen(false);
        if (openConnectModal) {
            openConnectModal();
        }
    };

    const confirmBack = () => {
        router.back();
    };

    const cancel = () => {
        if (form.isDirty()) {
            setIsLeaveEditingPage(true);
        } else {
            setIsViewMode(true);
        }
    };

    const confirmReset = () => {
        form.setValues(
            getContractFormState({
                contract,
                operationName,
            }).initialValues,
        );
        setIsViewMode(true);
        setIsLeaveEditingPage(false);
    };

    const back = () => {
        if (form.isDirty()) {
            setIsChangesLostModalOpen(true);
        } else {
            router.back();
        }
    };

    const pushToMainPage = () => {
        router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
    };

    return (
        <>
            <CustomModal
                isOpen={isLeaveEditingPage}
                onClose={() => {
                    setIsLeaveEditingPage(false);
                }}
                onConfirm={confirmReset}
                confirmBtnLabel="Leave"
                title={leavingModalTitle}
                description={leavingModalDescription}
            />

            <CustomModal
                isOpen={isChangesLostModalOpen}
                onClose={() => {
                    setIsChangesLostModalOpen(false);
                }}
                onConfirm={confirmBack}
                confirmBtnLabel="Leave"
                title={leavingModalTitle}
                description={leavingModalDescription}
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

            <CustomModal
                isOpen={isChangeWalletModalOpen}
                onClose={() => setIsChangeWalletModalOpen(false)}
                onConfirm={() => setIsChangeWalletModalOpen(false)}
                confirmBtnLabel="Change wallet"
                title="Connect a wallet"
                description={
                    `This contract was created using 
                    the ${contract?.owner?.address && truncateFromMiddle(contract?.owner?.address)} wallet. 
                    Connect this wallet to edit this contract.`
                }
                confirmBtnLoading={isLoading}
            />

            <FullScreenModal
                isOpen={deployComplete}
                isRedeploy={isRedeploy}
                onClose={() => pushToMainPage}
                onConfirm={pushToMainPage}
                confirmBtnLabel="Back to my contracts"
                title={form.values.title}
                contractAddress={contractAddress}
                contractId={contract.id}
                chain={contract.chain}
            />

            <div className={styles.container}>

                {!authStore.isAuthenticated && (
                    <Banner
                        title="Welcome to XLA Contract!"
                        description="Log in to interact with this contract."
                        img={<Image src={xlaLogo.src} width={74} height={22} alt="Logo xla" />}
                        nameBtn="Log in"
                        onClick={() => router.push('/')}
                    />
                )}

                <div className={visibility && authStore.isAuthenticated ? '' : styles.blur}>
                    <ScrollArea className={`${isShowPanelBtn ? styles.scrollAreaCalc : styles.scrollArea}`}>
                        <form className={styles.form}>
                            <HeaderEditor
                                form={form}
                                back={back}
                                isViewMode={isViewMode}
                                contract={contract}
                                setContract={setContract}
                                isDraft={isDraft}
                                isRecipient={isUserRecipient(contract)}
                                isOwner={isOwner}
                                isAuthor={isAuthor}
                                refs={refs}
                                isPending={isPending}
                                isPublished={isPublished}
                            />

                            {isPending && <PendingDeploy />}

                            <Recipients
                                form={form}
                                isViewMode={isViewMode}
                                contract={contract}
                                refs={refs}
                                wallet={address}
                            />
                            <Settings
                                form={form}
                                isViewMode={isViewMode}
                                contract={contract}
                                refs={refs}
                                isDraft={isDraft}
                            />
                        </form>
                    </ScrollArea>

                    {isShowPanelBtn && (
                        <div className={styles.buttonPanel}>
                            <PanelButtons
                                isLoading={isLoading}
                                isViewMode={isViewMode}
                                isDraft={isDraft}
                                isAuthor={isAuthor}
                                isOwner={isOwner}
                                isController={isController}
                                setIsViewMode={setIsViewMode}
                                setOperationName={setOperationName}
                                cancel={cancel}
                                startDeploy={startDeploy}
                                address={address}
                                recipients={recipients}
                                contract={contract}
                                setPublishingStatus={setPublishingStatus}
                                isPending={isPending}
                                mutabilityRecipients={form.values.mutabilityRecipients}
                                chain={mapCurrentChain(form.values.chain)}
                                formData={formData}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default observer(EditForm);
