import React, { useEffect } from 'react';

import Client from 'xla-sdk-core';
import { providers } from 'ethers';

import { observer } from 'mobx-react-lite';

import CustomButton from 'components/common/button/CustomButton';
import { useTransactionsStore } from 'stores/TransactionStore';

import { useNotificationStore } from 'stores/NotificationStore';
import { getAlchemyProvider } from 'config/alchemy/alchemyConfig';
import { useRouter } from 'next/router';
import { ContractDto } from 'types/contract/ContractDto';
import { contractService } from 'services/api/contract';
import { ContractStatusType } from 'types/common/ContractStatusType';
import { RedeployData } from 'types/contract/RedeployData';
import { toValveContract } from './dataMapping';

const confirmTitle = 'Confirm the transaction in your wallet';
const deployingTitle = 'Waiting for the transaction to be mined';
const finishedTitle = 'Contract created. Contract address:';
const cancelTransaction = 'Transaction canceled';

type DeployContractButtonProps = {
    setOperationName: () => void,
    startDeploy: boolean,
    address: string | undefined;
    recipients: any[],
    name: string,
    contractId?: string,
    setPublishingStatus?: (value: string) => void,
    isPending: boolean,
    autoNativeCurrencyDistribution: any,
    mutabilityRecipients: boolean,
    // change to type Blockchain when sdl will be changed
    chain?: any,
    isDraft: boolean,
    contractAddress?: any;
    formData?: RedeployData;
    contractDto?: ContractDto;
}

type XlaWalletState = {
    provider?: providers.Web3Provider;
    connectedWallet?: string;
    connectionLoading?: boolean;
    chainId?: number;
    sdkClient?: Client;
};

function DeployContractButton({
    setOperationName,
    startDeploy,
    address,
    recipients,
    name,
    contractId,
    setPublishingStatus,
    isPending,
    autoNativeCurrencyDistribution,
    mutabilityRecipients,
    chain,
    isDraft,
    contractAddress,
    formData,
    contractDto,
}: DeployContractButtonProps) {
    const router = useRouter();
    // @ts-expect-error: Unreachable code error
    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : null;
    const notificationStore = useNotificationStore();
    const transactionStore = useTransactionsStore();
    const alchemyProvider = getAlchemyProvider(chain);

    // This method for only new contract, change status for existing draft/contract
    // using  setPublishingStatus(ContractStatusType.PENDING);
    const changeStatus = async (id: string, status: string) => {
        const res = await contractService.updateStatus(id, {
            status,
        });

        if (res) {
            router.replace(`/contract/${id}`);
        }
    };

    const getFactoryClient = () => {
        const walletState: XlaWalletState = {};
        if (provider) {
            walletState.sdkClient = new Client({
                alchemyProvider,
                // @ts-expect-error: Unreachable code error
                signer: provider.getSigner(),
            });
            return walletState.sdkClient?.getValveFactoryClient(chain);
        }

        return null;
    };

    const getFactoryContract = () => {
        const walletState: XlaWalletState = {};
        if (provider) {
            walletState.sdkClient = new Client({
                alchemyProvider,
                // @ts-expect-error: Unreachable code error
                signer: provider.getSigner(),
            });
            return walletState.sdkClient?.getValveClient(contractAddress, chain);
        }
        return null;
    };

    useEffect(() => {
        (async () => {
            if (startDeploy && recipients.length > 0 && address) {
                try {
                    if (isDraft) {
                        const factoryClient = getFactoryClient();
                        await initDeploy(factoryClient, address, !mutabilityRecipients);
                    } else {
                        const factoryClient = getFactoryContract();
                        await reDeploy(factoryClient, recipients, !mutabilityRecipients);
                    }
                } catch (e: any) {
                    notificationStore?.error({ text: e.message });
                }
            }
        })();
    }, [startDeploy, recipients, address]);

    const updateController = async (factoryClient: any) => {
        console.log('updateController start');
        try {
            await factoryClient.setController(
                address,
                {
                    eventHandlers: {
                        waitingForConfirmation: async () => {
                            notificationStore?.success(confirmTitle);
                        },
                        waitingForCompletion: async (res: any) => {
                            // notificationStore?.info({ text: 'waiting For Completion' });
                            if (contractId) {
                                transactionStore?.push({ id: contractId, hash: res.hash, network: chain });
                                if (setPublishingStatus) {
                                    setPublishingStatus(ContractStatusType.PENDING);
                                }
                            }
                        },
                    },
                },
            );
        } catch (e: any) {
            if (e.message === 'Transaction canceled') {
                notificationStore?.info({ text: cancelTransaction });
            } else {
                notificationStore?.error({ text: 'Failed to update contract' });
            }
        }
    };

    const reDeploy = async (factoryClient: any, newRecipients: any, isImmutableRecipients: boolean) => {
        if (isImmutableRecipients) {
            try {
                await factoryClient.setRecipientsAndLock(
                    newRecipients,
                    {
                        eventHandlers: {
                            waitingForConfirmation: async () => {
                                notificationStore?.success(confirmTitle);
                            },
                            waitingForCompletion: async (res: any) => {
                                // notificationStore?.info({ text: 'waiting For Completion' });
                                if (contractId) {
                                    transactionStore?.push({
                                        id: contractId,
                                        hash: res.hash,
                                        network: chain,
                                        data: formData,
                                    });
                                    if (setPublishingStatus) {
                                        setPublishingStatus(ContractStatusType.PENDING);
                                    }
                                }
                            },
                        },
                    },
                );
            } catch (e: any) {
                if (e.message === 'Transaction canceled') {
                    notificationStore?.info({ text: cancelTransaction });
                } else {
                    notificationStore?.error({ text: 'Failed to update contract' });
                }
            }
        } else {
            try {
                await factoryClient.setRecipients(
                    newRecipients,
                    {
                        eventHandlers: {
                            waitingForConfirmation: async () => {
                                notificationStore?.success(confirmTitle);
                            },
                            waitingForCompletion: async (res: any) => {
                                // notificationStore?.info({ text: 'waiting For Completion' });
                                if (contractId) {
                                    transactionStore?.push({
                                        id: contractId, hash: res.hash, network: chain, data: formData,
                                    });
                                    if (setPublishingStatus) {
                                        setPublishingStatus(ContractStatusType.PENDING);
                                    }
                                }
                            },
                        },
                    },
                );
            } catch (e: any) {
                if (e.message === 'Transaction canceled') {
                    notificationStore?.info({ text: cancelTransaction });
                } else {
                    notificationStore?.error({ text: 'Failed to update contract' });
                }
            }
        }
    };

    const initDeploy = async (factoryClient: any, contractAddress: string, isImmutableRecipients: boolean) => {
        try {
            await factoryClient.createValveContract(
                toValveContract(
                    contractAddress,
                    autoNativeCurrencyDistribution,
                    recipients,
                    isImmutableRecipients,
                ),
                {
                    eventHandlers: {
                        waitingForConfirmation: async () => {
                            notificationStore?.success(confirmTitle);
                        },
                        waitingForCompletion: async (res: any) => {
                            // if draft doesn't exist, we need to create, after start to deploy
                            if (!contractId) {
                                if (contractDto) {
                                    const data = await contractService.createDraft(contractDto);
                                    if (data) {
                                        transactionStore?.push({ id: data.id, hash: res.hash, network: chain });
                                        await changeStatus(data.id, ContractStatusType.PENDING);
                                    }
                                }
                            } else {
                                transactionStore?.push({ id: contractId, hash: res.hash, network: chain });
                                if (setPublishingStatus) {
                                    setPublishingStatus(ContractStatusType.PENDING);
                                }
                            }
                        },
                    },
                },
            );
        } catch (e: any) {
            if (e.message === 'Transaction canceled') {
                notificationStore?.info({ text: cancelTransaction });
            } else {
                notificationStore?.error({ text: 'Failed to create contract' });
            }
        }
    };

    if (!isPending) {
        return (
            <CustomButton
                name={name}
                color="blue"
                style={{ width: 171, height: 48 }}
                onClick={setOperationName}
            />
        );
    }

    return null;
}

export default observer(DeployContractButton);
