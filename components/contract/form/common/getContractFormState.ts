import { validateTitle, validWalletAddress } from 'utils/form';
import { ContractDto } from 'types/contract/ContractDto';
import { Recipient } from 'types/contract/Recipient';
import { v4 } from 'uuid';
import Web3 from 'web3';
import {
    CHAIN_IS_REQUIRED,
    CURRENCY_IS_REQUIRED,
    INVALID_WALLET,
    REQUIRED_FIELD, SHARES_100_PERCENT,
} from 'utils/validationMessages';
import { chainList } from 'utils/getChain';

type ContractFormArgs = {
  contract?: ContractDto | null;
  operationName: string
};

// TODO: think about place where save version
const CONTRACT_VERSION = '1.0';

export function getContractFormState({ contract, operationName }: ContractFormArgs) {
    const countProgressPercent = () => {
        const values: Recipient[] | undefined = contract?.recipients;
        let progressPercent = 0;
        if (values) {
            progressPercent = values?.reduce(
                (accumulator: number, item: Recipient): number => accumulator + +Number(item.revenue),
                0,
            );
        }

        return Number(progressPercent.toFixed(5));
    };

    const recipients = () => {
        if (!contract || !contract.recipients) {
            return (
                [
                    {
                        id: v4(), name: '', address: '', revenue: 0,
                    },
                ]
            );
        }

        return contract.recipients.map((item) => {
            return {
                id: v4(), name: item.name, address: item.address, revenue: item.revenue,
            };
        });
    };

    const validateController = (val: string, values: any) => {
        const mutability = values.mutabilityRecipients;

        if (mutability) {
            if (!val) return REQUIRED_FIELD;

            if (val && !Web3.utils.isAddress(val)) {
                return INVALID_WALLET;
            }
        }

        return null;
    };

    const publishValidation = {
        title: validateTitle,
        chain: (val: string) => (!val ? CHAIN_IS_REQUIRED : null),
        currencies: (val: unknown) => (!val ? CURRENCY_IS_REQUIRED : null),
        recipients: {
            address: validWalletAddress,
            revenue: (val: number) => (!val ? REQUIRED_FIELD : null),
        },
        progressPercent: (val: number) => (val !== 100 ? SHARES_100_PERCENT : null),
        controller: validateController,
    };

    const validation = () => {
        if (operationName === 'draft') {
            return {
                title: validateTitle,
                controller: validateController,
            };
        }

        if (operationName === 'publish') {
            return publishValidation;
        }

        return {};
    };

    return {
        initialValues: {
            title: contract?.title || '',
            description: contract?.description || '',
            type: contract?.type || '',
            version: contract?.version || CONTRACT_VERSION,
            visibility: contract?.visibility || true,
            recipients: recipients(),
            chain: contract?.chain || chainList[0].value,
            distribution: contract?.distribution || 'AUTO',
            currencies: contract?.currencies?.[0].title || '',
            progressPercent: countProgressPercent(),
            status: contract?.status || '',
            // if isRecipientsLocked = true -> mutabilityRecipients = false
            // if isRecipientsLocked = false -> mutabilityRecipients = true
            mutabilityRecipients: contract?.isRecipientsLocked ? !contract?.isRecipientsLocked : true,
            controller: contract?.controller?.address || '',
            lockAddressEditing: contract?.immutableController || false,
            visualizationUrl: contract?.visualizationUrl || null,
            legalAgreementUrl: contract?.legalAgreementUrl || null,
        },
        validate: validation(),
        clearInputErrorOnChange: true,
    };
}
