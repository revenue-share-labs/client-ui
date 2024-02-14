import { WalletDto } from './WalletDto';

export type UserDto = {
    id?: string;
    email?: string;
    username?: string;
    firstName?: string;
    lastname?: string;
    wallets?: WalletDto[];
    activeWallet?: WalletDto;
    createdBy?: string;
}
