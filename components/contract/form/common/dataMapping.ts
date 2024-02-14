import { Recipient } from 'types/contract/Recipient';
import { VisibilityType } from 'types/contract/VisibilityType';
import { ContractDto } from 'types/contract/ContractDto';
import { ChainType } from 'types/contract/ChainType';
import { NetworkTypes } from 'types/common/NetworkTypes';

export const mapContractDto = (values: any, walletAddress?: string) => {
    const recipients = values.recipients.map((item: Recipient) => {
        return {
            name: item.name,
            address: item.address,
            revenue: item.revenue || 0,
        };
    });

    const immutableController = values.lockAddressEditing;
    const controller = values.mutabilityRecipients ? values.controller : '';

    const dto = {
        ...values,
        chain: values.chain || null,
        distribution: values.distribution || null,
        currencies: [{
            title: values.currencies || null,

        }],
        recipients,
        visibility: values.visibility ? VisibilityType.PRIVATE : VisibilityType.COMMUNITY,
        immutableController,
        autoNativeCurrencyDistribution: true,
        controller: {
            name: 'controller',
            address: controller,
        },
        distributor: {
            name: 'distributor',
            address: walletAddress || '',
        },
        // if mutabilityRecipients = false -> isRecipientsLocked = true
        // if mutabilityRecipients = true -> isRecipientsLocked = false
        isRecipientsLocked: !values.mutabilityRecipients,
        minAutoDistributionAmount: 0,
    };
    const {
        progressPercent, mutabilityRecipients, lockAddressEditing, ...contractDto
    } = dto;
    return contractDto;
};

export const mapUpdateContractDto = (contract: ContractDto, update: { [key: string]: any }) => {
    const dto = {
        ...contract,
        ...update,
    };

    const {
        updatedAt, publishedAt, createdAt, id, ...contractDto
    } = dto;
    return contractDto;
};

export const mapUpdateVisibilityContractDto = (contract: ContractDto, visibility: string) => {
    const dto = {
        ...contract,
        visibility,
    };

    const {
        updatedAt, publishedAt, createdAt, id, ...contractDto
    } = dto;
    return contractDto;
};

export const mapCurrentChain = (chain: string) => {
    if (chain === ChainType.ETHEREUM_GOERLI) return NetworkTypes.GOERLI;
    if (chain === ChainType.POLYGON_MUMBAI) return NetworkTypes.MUMBAI;
    if (chain === ChainType.POLYGON) return NetworkTypes.POLYGON;
    return NetworkTypes.ETH;
};
