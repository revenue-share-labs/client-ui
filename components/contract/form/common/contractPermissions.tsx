import { ContractDto } from 'types/contract/ContractDto';
import { WalletDto } from 'types/user/WalletDto';

// Find wallet of current user in the recipients
export function isUserRecipient(contract?: ContractDto, activeWallet?: WalletDto) {
    if (!contract || !contract.recipients) return false;

    const wallet = activeWallet?.address;

    const recipients = contract?.recipients?.map((item) => item.address);
    return recipients.includes(wallet);
}

export function isUserOwner(contract?: ContractDto, activeWallet?: WalletDto) {
    return contract?.owner?.address === activeWallet?.address;
}

export function isUserAuthor(contract?: ContractDto, userId?: string) {
    return contract?.author === userId;
}

export function isUserController(contract?: ContractDto, activeWallet?: WalletDto) {
    return contract?.controller?.address === activeWallet?.address;
}
