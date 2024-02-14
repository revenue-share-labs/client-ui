import React, { useEffect, useState } from 'react';

import Client from 'xla-sdk-core';
import { generateCreationId } from 'xla-sdk-core/dist/utils/common';
import { providers } from 'ethers';

import { observer } from 'mobx-react-lite';

import { v4 as uuidv4 } from 'uuid';

import CustomButton from 'components/common/button/CustomButton';
import { useTransactionsStore } from 'stores/TransactionStore';

import { useNotificationStore } from 'stores/NotificationStore';
import { Blockchain } from 'xla-sdk-core/dist/constants';
import { getAlchemyProvider } from 'config/alchemy/alchemyConfig';

const confirmTitle = 'Confirm the transaction in your wallet';
const deployingTitle = 'Waiting for the transaction to be mined';
const finishedTitle = 'Contract created. Contract address:';
const cancelTransaction = 'Transaction canceled';

type DeployContractButtonProps = {
    setName: () => void,
    startDeploy: boolean,
    address: any,
    recipients: any,
    name: string,
    contractId?: string,
    setPublishingStatus: (value: string) => void,
    isPending: boolean,
    setContractAddress: (value: string) => void,
    autoNativeCurrencyDistribution: any,
    isRecipientsLocked: any,
    // change to type Blockchain when sdl will be changed
    chain: any
}

type XlaWalletState = {
    provider?: providers.Web3Provider;
    connectedWallet?: string;
    connectionLoading?: boolean;
    chainId?: number;
    sdkClient?: Client;
};

const InitDeploy = async (
    factoryClient: any,
    address: any,
    recipients: any,
    creationId: any,
    notificationStore: any,
    contractId: any,
    setPublishingStatus: (value: string) => void,
    transactionStore: any,
    network: string,
    autoNativeCurrencyDistribution: boolean,
    isRecipientsLocked: boolean,
    chain: Blockchain,
) => {
    let contractAddress = '';

    try {
        const recipient = await factoryClient.createValveContract(
            {
                controller: `${address}`,
                immutableController: false,
                isAutoNativeCurrencyDistribution: autoNativeCurrencyDistribution,
                recipients,
                minAutoDistributeAmountInEthers: '10.5',
                distributors: [`${address}`],
                creationId: '0x0000000000000000000000000000000000000000000000000000000000000000',
                isImmutable: { isRecipientsLocked },
                chain,
            },
            {
                eventHandlers: {
                    waitingForConfirmation: () => {
                        notificationStore.success(confirmTitle);
                    },
                    waitingForCompletion: (res: any) => {
                        transactionStore.push({ id: contractId, hash: res.hash, network });
                        setPublishingStatus('PENDING');
                    },
                },
            },
        );
        transactionStore.remove(contractId);
        contractAddress = recipient.logs[0].address;
    } catch (e: any) {
        if (e.message === 'Transaction canceled') {
            notificationStore.info({ text: cancelTransaction });
        } else {
            notificationStore.error({ text: 'Failed to create contract' });
        }
    }
    return contractAddress;
};

function DeployContractButton({
    setName,
    startDeploy,
    address,
    recipients,
    name,
    contractId,
    setPublishingStatus,
    isPending,
    setContractAddress,
    autoNativeCurrencyDistribution,
    isRecipientsLocked,
    chain,
}: DeployContractButtonProps) {
    // @ts-expect-error: Unreachable code error
    const provider = window.ethereum ? new providers.Web3Provider(window.ethereum) : null;
    const [creationId, setCreationId] = useState(generateCreationId());
    const notificationStore = useNotificationStore();
    const transactionStore = useTransactionsStore();
    const alchemyProvider = getAlchemyProvider(chain);

    useEffect(() => {
        if (startDeploy && recipients.length > 0 && address !== '') {
            const walletState: XlaWalletState = {};
            if (provider) {
                walletState.sdkClient = new Client({
                    alchemyProvider,
                    // @ts-expect-error: Unreachable code error
                    signer: provider.getSigner(),
                });
            }

            const factoryClient = walletState.sdkClient?.getValveFactoryClient(chain);

            if (factoryClient) {
                const deployedAddress = InitDeploy(
                    factoryClient,
                    address,
                    recipients,
                    creationId,
                    notificationStore,
                    contractId,
                    setPublishingStatus,
                    transactionStore,
                    chain,
                    autoNativeCurrencyDistribution,
                    isRecipientsLocked,
                    chain,
                );
                deployedAddress.then((res) => {
                    if (res !== '') {
                        setContractAddress(res);
                        setPublishingStatus('PUBLISHED');
                        // setDeployComplete(true);
                    }
                })
                    .catch((e: any) => {
                        notificationStore?.error({ text: e.message });
                    });
            }
        }
    }, [startDeploy, recipients, address]);

    if (!isPending) {
        return (
            <CustomButton
                name={name}
                color="blue"
                style={{ width: 171, height: 48 }}
                onClick={setName}
            />
        );
    }

    return null;
}

export default observer(DeployContractButton);
