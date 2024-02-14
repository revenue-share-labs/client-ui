import { ChainType } from 'types/contract/ChainType';
import {
    ETH_GOERLI_BLOCK_EXPLORER,
    ETH_MAINNET_BLOCK_EXPLORER,
    POLYGON_MUMBAI_BLOCK_EXPLORER,
} from 'config/alchemy/alchemyConfig';

export const openContract = (chain?: string, address?: string) => {
    if (!chain || !address) return;

    let url = '';
    if (chain === ChainType.ETHEREUM) {
        url = `${ETH_MAINNET_BLOCK_EXPLORER}${address}`;
    }
    if (chain === ChainType.ETHEREUM_GOERLI) {
        url = `${ETH_GOERLI_BLOCK_EXPLORER}${address}`;
    }
    if (chain === ChainType.POLYGON_MUMBAI) {
        url = `${POLYGON_MUMBAI_BLOCK_EXPLORER}${address}`;
    }
    window.open(url, '_blank', 'noopener, noreferrer');
};
