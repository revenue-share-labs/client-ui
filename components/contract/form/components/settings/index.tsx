import React, { MutableRefObject, useEffect } from 'react';
import CustomSelect from 'components/common/select/CustomSelect';
import { TypeItem } from 'components/common/select/customItems/TypeItem';
import infoImg from 'public/icons/information-circle.svg';
import CustomRadio from 'components/common/radio';
import CustomTooltip from 'components/common/tooltip';
import { ContractDto } from 'types/contract/ContractDto';
import { toUpperCaseFirstLetter, truncateFromMiddle } from 'utils/string';
import Image from 'next/image';
import { ChainType } from 'types/contract/ChainType';
import { chainList } from 'utils/getChain';
import styles from './Settings.module.scss';

const currencyValues = (chain: string, networks: any[]) => {
    const ethDisabled = chain !== ChainType.ETHEREUM && chain !== ChainType.ETHEREUM_GOERLI;
    const chains = [
        { value: 'ETH', label: 'ETH', disabled: ethDisabled },
        { value: 'USDT', label: 'USDT', disabled: true },
        { value: 'BTC', label: 'BTC', disabled: true },
    ];

    const networksNames = networks.map((item) => item.value);

    const maticDisabled = chain !== ChainType.POLYGON_MUMBAI && chain !== ChainType.POLYGON;
    if (networksNames.includes(ChainType.POLYGON_MUMBAI) || networksNames.includes(ChainType.POLYGON)) {
        chains.push({ value: 'MATIC', label: 'MATIC', disabled: maticDisabled });
    }

    return chains;
};

const distributionTypeValues = [
    { value: 'AUTO', label: 'Auto' },
    { value: 'MANUAL', label: 'Manual', disabled: true },
];

const selectStyles = {
    width: '419px',
};

export const getChainByName = (name: string) => {
    return chainList.find((chain) => chain.name === name);
};

export const getIdByChain = (chain: string) => {
    const item = chainList.find((obj) => obj.value === chain);
    return item ? item.id : null;
};

const infoImage = (
    <Image
        src={infoImg.src}
        className={styles.infoImg}
        alt="Information image"
        width={24}
        height={24}
    />
);

const selectLabel = (name: string, tooltipText: string) => (
    <div className={styles.selectLabel}>
        <div className={`${styles.name}`}>
            {name}
            {/* <div className={styles.dot}/> */}
        </div>
        <CustomTooltip text={tooltipText} btn={infoImage} />
    </div>
);

const chainIDTooltip = 'The blockchain platform on which the contract will be created.';
const currencyTooltip = 'Currencies in which we can distribute funds.';
const distributionTypeTooltip = '';

type SettingsProps = {
  form: any;
  isViewMode?: boolean;
  contract?: ContractDto;
  refs: Record<string, MutableRefObject<HTMLDivElement | null>>;
  isDraft?: boolean;
};

const getChain = (value: string) => {
    if (value === ChainType.ETHEREUM) {
        return 'Ethereum';
    }
    if (value === ChainType.ETHEREUM_GOERLI) {
        return 'Ethereum Goerli';
    }
    if (value === ChainType.POLYGON_MUMBAI) {
        return 'Polygon Mumbai';
    }
    if (value === ChainType.POLYGON) {
        return 'Polygon';
    }

    return '';
};

function Settings({
    form,
    isViewMode,
    contract,
    refs,
    isDraft,
}: SettingsProps) {
    const chainValues = process.env.CHAIN;

    const chain = contract && contract?.chain ? getChain(contract.chain) : '-';
    const distribution = contract && contract?.distribution
        ? contract?.distribution.toLocaleLowerCase()
        : '-';
    const currency = contract && contract?.currencies && contract?.currencies[0].title
        ? contract?.currencies[0].title
        : '-';

    const wallet = contract && contract.owner && contract.owner.address
        ? truncateFromMiddle(contract.owner.address)
        : '-';

    const getChainValues = () => {
        const chainNames = chainValues?.split(',') ?? ['ETH'];
        return chainNames.map((name) => getChainByName(name));
    };

    useEffect(() => {
        const currencyFieldName = 'currencies';
        const currency = form.getInputProps(currencyFieldName).value;

        const isEth = (form.values.chain === ChainType.ETHEREUM || form.values.chain === ChainType.ETHEREUM_GOERLI);
        if (isEth && currency !== 'ETH') {
            form.setFieldValue(currencyFieldName, '');
        }
        const isMatic = form.values.chain === ChainType.POLYGON_MUMBAI || form.values.chain === ChainType.POLYGON;
        if (isMatic && currency !== 'MATIC') {
            form.setFieldValue(currencyFieldName, '');
        }
    }, [form.values.chain]);

    const viewMode = (
        <div className={`${styles.settings} ${styles.viewMode_bg}`}>
            <div className={styles.title}>Settings</div>
            <div className={styles.values}>
                <div className={styles.line}>
                    <div className={styles.text}>This contract is created on</div>
                    <div className={styles.label}>{chain}</div>
                    <div className={styles.text}>and is distributed in</div>
                    <div className={styles.label}>{currency}</div>
                    <div className={styles.text}>Distribution type of the find is</div>
                    <div className={styles.label}>{toUpperCaseFirstLetter(distribution)}</div>
                </div>
                <div className={styles.line}>
                    <div className={styles.text}>to this wallet</div>
                    <div className={styles.label}>{wallet}</div>
                </div>
            </div>
        </div>
    );

    if ((isViewMode && contract) || (contract?.id && !isDraft)) {
        return viewMode;
    }

    return (
        <div className={styles.settings} ref={refs.settings}>
            <div className={styles.title}>Settings</div>

            <div className={styles.fields}>
                <div className={styles.selects}>
                    <CustomSelect
                        data={getChainValues()}
                        label={selectLabel('Blockchain', chainIDTooltip)}
                        style={selectStyles}
                        customItem={TypeItem}
                        placeholder="Select"
                        {...form.getInputProps('chain')}
                    />
                    <CustomSelect
                        data={currencyValues(form.values.chain, getChainValues())}
                        label={selectLabel('Currency', currencyTooltip)}
                        style={selectStyles}
                        customItem={TypeItem}
                        placeholder="Select"
                        {...form.getInputProps('currencies')}
                    />
                </div>
                <CustomRadio
                    label={selectLabel('Distribution Type', distributionTypeTooltip)}
                    values={distributionTypeValues}
                    {...form.getInputProps('distribution')}
                />
            </div>
        </div>
    );
}

export default Settings;
