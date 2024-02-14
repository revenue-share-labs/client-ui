import Web3 from 'web3';
import {
    INVALID_WALLET,
    ONE_OF_RECIPIENT_REQUIRED,
    REQUIRED_FIELD,
    TITLE_ERROR,
    UNIQUE_WALLET,
    URL_ERROR,
} from 'utils/validationMessages';
import { Recipient } from 'types/contract/Recipient';
import { isValidString } from 'utils/string';

export const fieldRequired = (val: unknown) => (val ? null : REQUIRED_FIELD);

export const validWalletAddress = (val: string, values: any) => {
    if (!val) return INVALID_WALLET;

    if (val && !Web3.utils.isAddress(val)) {
        return INVALID_WALLET;
    }

    const addresses = values.recipients.filter(
        (item: Recipient) => val && item.address === val,
    );
    if (addresses.length > 1) {
        return UNIQUE_WALLET;
    }

    return null;
};

export const checkRecipientFields = (
    val: string,
    values: any,
    path: string,
) => {
    const currentIndex = path.replace(/\D+/g, '');
    const currentRecipient = values.recipients.find(
        (item: Recipient, index: number) => index === Number(currentIndex),
    );

    if (
        !currentRecipient.name
    && !currentRecipient.address
    && !currentRecipient.revenue
    ) {
        return ONE_OF_RECIPIENT_REQUIRED;
    }

    return null;
};

export const validateTitle = (val: string) => {
    if (!val) return 'Required field';

    if (!isValidString(val)) return TITLE_ERROR;

    return null;
};

export function isValidUrl(str: string) {
    const pattern = new RegExp(
        '^([a-zA-Z]+:\\/\\/)?' // protocol
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
        + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR IP (v4) address
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$', // fragment locator
        'i',
    );

    if (!pattern.test(str) && !str) return URL_ERROR;

    return pattern.test(str);
}
