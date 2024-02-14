import { WalletProviders } from '../types/common/WalletProviders';

enum WalletProvider {
    MetaMask = 'metaMask',
    CoinbaseWallet = 'coinbaseWallet',
    WalletConnect = 'walletConnectLegacy',
}

export const getProvider = (provider: string): string => {
    switch (provider) {
    case WalletProvider.MetaMask:
        return WalletProviders.META_MASK;
    case WalletProvider.CoinbaseWallet:
        return WalletProviders.COINBASE_WALLET;
    case WalletProvider.WalletConnect:
        return WalletProviders.WALLET_CONNECT;
    case WalletProviders.META_MASK:
        return WalletProvider.MetaMask;
    case WalletProviders.COINBASE_WALLET:
        return WalletProvider.CoinbaseWallet;
    case WalletProviders.WALLET_CONNECT:
        return WalletProvider.WalletConnect;
    default:
        return '';
    }
};
