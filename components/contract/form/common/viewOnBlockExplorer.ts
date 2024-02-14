import { ChainType } from 'types/contract/ChainType';
import {
    ETH_GOERLI_BLOCK_EXPLORER,
    ETH_MAINNET_BLOCK_EXPLORER, POLYGON_BLOCK_EXPLORER,
    POLYGON_MUMBAI_BLOCK_EXPLORER,
} from 'config/alchemy/alchemyConfig';

export const viewOnBlockExplorer = (chain?: string, address?: string): void => {
    if (!chain || !address) {
        return;
    }

    let url = '';
    switch (chain) {
    case ChainType.ETHEREUM:
        url = `${ETH_MAINNET_BLOCK_EXPLORER}${address}`;
        break;
    case ChainType.ETHEREUM_GOERLI:
        url = `${ETH_GOERLI_BLOCK_EXPLORER}${address}`;
        break;
    case ChainType.POLYGON_MUMBAI:
        url = `${POLYGON_MUMBAI_BLOCK_EXPLORER}${address}`;
        break;
    case ChainType.POLYGON:
        url = `${POLYGON_BLOCK_EXPLORER}${address}`;
        break;
    default:
        return;
    }

    window.open(url, '_blank', 'noopener noreferrer');
};
