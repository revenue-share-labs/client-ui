import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTransactionsStore } from 'stores/TransactionStore';
import { alchemyConfig } from 'config/alchemy/alchemyConfig';
import { contractService } from 'services/api/contract';
import { ContractStatusType } from 'types/common/ContractStatusType';
import { useAuthStore } from 'stores/AuthStore';
import { ToastDescriptionType } from 'types/common/ToastDescriptionType';
import { useNotificationStore } from 'stores/NotificationStore';
import { Recipient } from 'types/contract/Recipient';
import { ContractDto } from 'types/contract/ContractDto';
import { RedeployData } from 'types/contract/RedeployData';
import { TrackGoogleAnalyticsEvent } from 'utils/google-analytics';

type Transaction = {
    hash: string;
    id: string;
    network: string;
    data: any;
};

const ContractWasPublishedTitle = 'Contract has been published';

export const updateDataAfterRedeploy = async (contract: ContractDto, contractAddress: string, updatedData: RedeployData) => {
    const recipients = updatedData.recipients.map((item: Recipient) => {
        return {
            name: item.name,
            address: item.address,
            revenue: item.revenue || 0,
        };
    });

    const dto = {
        ...contract,
        recipients,
        immutableController: updatedData.immutableController,
        controller: {
            name: 'controller',
            address: updatedData.controller,
        },
        status: ContractStatusType.PUBLISHED,
        address: contractAddress,
        isRecipientsLocked: updatedData.isRecipientsLocked,

    };

    const {
        createdAt,
        updatedAt,
        publishedAt,
        owner,
        author,
        id,
        ...finalDto
    } = dto;

    if (contract.id) {
        return contractService.update(contract.id, finalDto);
    }

    return null;
};

export const Monitoring = observer(() => {
    const notificationStore = useNotificationStore();

    const router = useRouter();
    const transactionsStore = useTransactionsStore();
    const authStore = useAuthStore();

    useEffect(() => {
        const interval = setInterval(async () => {
            if (authStore.isAuthenticated) {
                await processingHash();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [authStore.isAuthenticated]);

    const processingHash = async () => {
        const transactions = transactionsStore.getTransactions();

        if (!transactions || transactions.length === 0) {
            return;
        }

        try {
            transactions.map(async ({
                hash,
                id,
                network,
                data,
            }: Transaction) => {
                const isCurrentContract = router.query?.id && router.query.id === id;
                const alchemy = alchemyConfig(network);

                if (alchemy && hash) {
                    const receipt = await alchemy.core.getTransactionReceipt(hash);

                    if (receipt?.blockHash && receipt?.blockNumber) {
                        const contractAddress = receipt.logs[0].address;
                        if (isCurrentContract) {
                            transactionsStore.addToPublishedContract({
                                id,
                                address: contractAddress,
                                isPublish: true,
                                data,
                            });
                            TrackGoogleAnalyticsEvent('contract_created', id);
                        } else {
                            await updateStatus(id, contractAddress, data);
                        }
                    }
                }
            });
        } catch (error) {
            console.log('Error in processing transactions:', error);
        }
    };

    const updateStatus = async (contractId: string, contractAddress: string, updatedData?: RedeployData) => {
        const contract = await contractService.findById(contractId);

        if (!contract || !contract.id) {
            return;
        }

        const { id } = contract;

        if (updatedData) {
            const res = await updateDataAfterRedeploy(contract, contractAddress, updatedData);
            if (res) {
                showNotification(contract, contractId, true);
            }
        } else {
            const res = await contractService.updateStatus(id, {
                status: ContractStatusType.PUBLISHED,
                address: contractAddress,
            });
            if (res) {
                showNotification(contract, contractId);
            }
        }
    };

    const showNotification = (contract: ContractDto, contractId: string, isUpdated?: boolean) => {
        const {
            id,
            title,
        } = contract;

        const description = {
            type: isUpdated ? ToastDescriptionType.CONTRACT_UPDATED : ToastDescriptionType.CONTRACT_PUBLISHED,
            contractTitle: title,
            contractId: id,
        };

        notificationStore?.success(ContractWasPublishedTitle, false, description);
        transactionsStore.remove(contractId);
    };

    return null;
});
