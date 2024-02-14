import { Alchemy, Network } from 'alchemy-sdk';
import { NetworkTypes } from 'types/common/NetworkTypes';
import { providers } from 'ethers';

export const ETH_MAINNET_API_KEY = process.env.MAINNET_ALCHEMY_ID;
export const ETH_GOERLI_API_KEY = process.env.GOERLI_ALCHEMY_ID;
export const POLYGON_MUMBAI_API_KEY = process.env.MUMBAI_ALCHEMY_ID;
export const POLYGON_API_KEY = process.env.POLYGON_ALCHEMY_ID;

export const ETH_GOERLI_PROVIDER_URL = 'https://eth-goerli.g.alchemy.com/v2/';
export const ETH_MAINNET_PROVIDER_URL = 'https://eth-mainnet.g.alchemy.com/v2/';
export const POLYGON_MUMBAI_PROVIDER_URL = 'https://polygon-mumbai.g.alchemy.com/v2/';
export const POLYGON_PROVIDER_URL = 'https://polygon-mainnet.g.alchemy.com/v2/';

export const ETH_GOERLI_BLOCK_EXPLORER = 'https://goerli.etherscan.io/address/';
export const ETH_MAINNET_BLOCK_EXPLORER = 'https://etherscan.io/address/';
export const POLYGON_MUMBAI_BLOCK_EXPLORER = 'https://mumbai.polygonscan.com/address/';
export const POLYGON_BLOCK_EXPLORER = 'https://polygonscan.com/address/';

export function alchemyConfig(network: string) {
    if (network === NetworkTypes.ETH) {
        return new Alchemy({
            apiKey: ETH_MAINNET_API_KEY,
            network: Network.ETH_MAINNET,
        });
    }
    if (network === NetworkTypes.GOERLI) {
        return new Alchemy({
            apiKey: ETH_GOERLI_API_KEY,
            network: Network.ETH_GOERLI,
        });
    }

    if (network === NetworkTypes.MUMBAI) {
        return new Alchemy({
            apiKey: POLYGON_MUMBAI_API_KEY,
            network: Network.MATIC_MUMBAI,
        });
    }

    if (network === NetworkTypes.POLYGON) {
        return new Alchemy({
            apiKey: POLYGON_API_KEY,
            network: Network.MATIC_MAINNET,
        });
    }

    return null;
}

export const getAlchemyProvider = (chain: any) => {
    let url = '';

    // ETH
    if (chain === NetworkTypes.ETH) {
        url = `${ETH_MAINNET_PROVIDER_URL}${ETH_MAINNET_API_KEY}`;
    }
    if (chain === NetworkTypes.GOERLI) {
        url = `${ETH_GOERLI_PROVIDER_URL}${ETH_GOERLI_API_KEY}`;
    }

    // POLYGON MUMBAI
    if (chain === NetworkTypes.MUMBAI) {
        url = `${POLYGON_MUMBAI_PROVIDER_URL}${POLYGON_MUMBAI_API_KEY}`;
    }
    // POLYGON
    if (chain === NetworkTypes.POLYGON) {
        url = `${POLYGON_PROVIDER_URL}${POLYGON_API_KEY}`;
    }

    return new providers.JsonRpcProvider(url);
};
