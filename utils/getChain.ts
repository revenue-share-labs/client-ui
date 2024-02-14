import { ChainType } from 'types/contract/ChainType';
import EthereumIcon from 'public/icons/icon-eth-circle.svg';
import EthereumGoerliIcon from 'public/icons/icon-ethGoerli-circle.svg';
import PolygonGrayIcon from 'public/icons/icon-polygonGray-circle.svg';
import PolygonIcon from 'public/icons/icon-polygon-circle.svg';

type ChainInfo = {
  value: string;
  label: string;
  img: string;
}

export const chainList = [
    {
        id: 1,
        value: ChainType.ETHEREUM,
        label: 'Ethereum Mainnet',
        name: 'ETH',
        img: EthereumIcon,
    },
    {
        id: 5,
        value: ChainType.ETHEREUM_GOERLI,
        name: 'GOERLI',
        label: 'Ethereum Goerli',
        img: EthereumGoerliIcon,
    },
    {
        id: 137,
        value: ChainType.POLYGON,
        name: 'POLYGON',
        label: 'Polygon Mainnet',
        img: PolygonIcon,
    },
    {
        id: 80001,
        value: ChainType.POLYGON_MUMBAI,
        label: 'Polygon Mumbai',
        name: 'MUMBAI',
        img: PolygonGrayIcon,
    },
];

export const getChain = (value: string): ChainInfo | null => {
    const chain = chainList.find((chain) => chain.value === value);

    if (chain) {
        return {
            value: chain.value,
            label: chain.label,
            img: chain.img,
        };
    }

    return null;
};

export const getChains = (envChains: any) => {
    const chainNames = envChains?.split(',') ?? [ChainType.ETHEREUM];

    return chainList.filter((chain: any) => {
        return !!chainNames.includes(chain.name);
    });
};
