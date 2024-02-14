import React, { MutableRefObject } from 'react';
import Image from 'next/image';

import { notificationStore } from 'stores/NotificationStore';

import CustomButton from 'components/common/button/CustomButton';
import BackIcon from 'components/common/icons/BackIcon';
import Tag from 'components/common/tag/Tag';
import CustomSelect from 'components/common/select/CustomSelect';

import { TagType } from 'types/common/TagType';

import { COPY_WALLET } from 'constants/notificationMessage';
import { ContractDto } from 'types/contract/ContractDto';

import { chainList, getChains } from 'utils/getChain';
import { toUpperCaseFirstLetter, truncateFromMiddle } from 'utils/string';

import chevronDownIcon from 'public/icons/chevron-down.svg';
import checkIcon from 'public/icons/check.svg';
import copyImg from 'public/icons/copy-white.svg';
import linkImg from 'public/icons/external-link.svg';

import { ChainType } from 'types/contract/ChainType';
import { viewOnBlockExplorer } from '../../common/viewOnBlockExplorer';
import TitleField from './TitleField';
import DescriptionField from './DescriptionField';
import Share from '../shareModal';

import styles from './HeaderEditor.module.scss';
import ViewLegal from './ViewLegal';
import Visualization from './Visualization';

type HeaderEditorProps = {
  back: () => void;
  form: any;
  isViewMode?: boolean;
  contract?: ContractDto;
  setContract?: (value: ContractDto) => void;
  isDraft?: boolean;
  isRecipient?: boolean;
  isOwner?: boolean;
  isAuthor?: boolean;
  refs: Record<string, MutableRefObject<HTMLDivElement | null>>;
  isPending?: boolean;
  isPublished?: boolean;
};

interface ItemProps {
  label: string;
  img: string;
}

const TypeItem = ({ img, label, ...others }: ItemProps) => {
    return (
        <div {...others}>
            <div>
                <div className={styles.item__chain}>
                    <Image src={img} alt="check" width={24} height={24} />
                    {label}
                </div>
            </div>
            <Image src={checkIcon.src} alt="check" width={24} height={24} className={styles.item__active} />
        </div>
    );
};

export default function Header({
    back,
    form,
    contract,
    setContract,
    isViewMode,
    isDraft,
    isRecipient,
    isOwner,
    isAuthor,
    isPending,
    isPublished,
    refs,
}: HeaderEditorProps) {
    const backBtnName = contract ? 'Back' : 'Back to Step 1';
    const chainValues = process.env.CHAIN;

    const type = toUpperCaseFirstLetter(
        form.getInputProps('type').value.toLocaleLowerCase(),
    );

    let title;
    if (isViewMode) {
        title = 'viewing';
    } else {
        title = contract && contract.id ? 'editing' : 'creating';
    }

    const chainObj = chainList.find((x) => x.value === (form.values.chain || ChainType.ETHEREUM));

    const copyAddress = async () => {
        const address = contract?.address;
        if (!address) return;
        try {
            await navigator?.clipboard?.writeText(address);
            notificationStore?.success(COPY_WALLET);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        }
    };

    const address = () => {
        return (
            <div className={styles.address}>
                <span>SC Address:</span>
                {
                    contract && contract.address && (
                        <div className={styles.link}>

                            <div
                                className={styles.linkToContract}
                                onClick={() => viewOnBlockExplorer(contract?.chain, contract?.address)}
                            >
                                <div className={styles.value}>
                                    {truncateFromMiddle(contract.address)}
                                    <Image src={linkImg} alt="Link icon" width={20} height={20} />
                                </div>
                            </div>
                            <Image
                                alt="Copy icon"
                                src={copyImg.src}
                                width={16}
                                height={16}
                                onClick={copyAddress}
                                className={styles.copy}
                            />
                        </div>
                    )
                }
            </div>
        );
    };

    return (
        <div>
            <div className={styles.buttons}>
                <CustomButton
                    name={backBtnName}
                    variant="ghost"
                    color="black"
                    style={{ width: ' 69px', height: '40px' }}
                    leftIcon={<BackIcon width="16" height="15" />}
                    onClick={back}
                />
                {/* TODO: was hidden according EXLP-643 */}
                <div className={styles.topButtons}>

                    <div className={styles.right}>
                        {/* <Copy /> */}
                        <Visualization
                            contract={contract}
                            form={form}
                            setContract={setContract}
                            isOwner={isOwner}
                            title={title}
                        />
                        <ViewLegal
                            contract={contract}
                            setContract={setContract}
                            form={form}
                            isOwner={isOwner}
                            title={title}
                        />
                        {contract?.visibility && !isDraft && !isPending && isOwner && (
                            <Share
                                contract={contract}
                                setContract={setContract}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div
                className={styles.header}
                ref={refs.title}
            >
                <div className={` ${
                    isDraft || isPending ? styles.header__bg_draft : styles.header__bg_published
                }`}
                >
                    <div className={styles.header__info}>

                        <div className={styles.title}>

                            <TitleField
                                isOwner={isOwner}
                                isAuthor={isAuthor}
                                setContract={setContract}
                                contract={contract}
                                form={form}
                                isDraft={isDraft}
                            />

                            <div className={styles.details}>
                                <div className={styles.info}>
                                    <div className={styles.text}>
                                        Contract type&nbsp;
                                        <span className={styles.label}>{type}</span>
                                    </div>
                                    <div className={styles.text}>version</div>
                                    <span className={styles.label}>
                                        {form.getInputProps('version').value}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <DescriptionField
                                form={form}
                                isAuthor={isAuthor}
                                isDraft={isDraft}
                                isOwner={isOwner}
                                contract={contract}
                                setContract={setContract}
                            />
                        </div>

                        <div className={styles.bottom}>
                            <div>
                                {chainObj && (
                                    <div>
                                        {!isPublished && (title === 'editing' || title === 'creating') ? (
                                            <CustomSelect
                                                data={getChains(chainValues)}
                                                placeholder="Select network"
                                                iconLeft={(
                                                    <Image
                                                        src={chainObj.img.src}
                                                        alt={chainObj.label}
                                                        width={24}
                                                        height={24}
                                                    />
                                                )}
                                                icon={(
                                                    <Image
                                                        src={chevronDownIcon.src}
                                                        alt="Chevron icon"
                                                        width={24}
                                                        height={24}
                                                    />
                                                )}
                                                customItem={TypeItem}
                                                newClassnames={{
                                                    root: styles.root,
                                                    item: styles.item,
                                                    input: styles.input,
                                                    wrapper: styles.wrapper,
                                                    rightSection: styles.icon,
                                                    icon: styles.iconLeft,
                                                }}
                                                {...form.getInputProps('chain')}
                                            />
                                        ) : (
                                            <div className={styles.info}>
                                                {form.values.chain && (
                                                    <div className={styles.chain}>
                                                        <Image src={chainObj.img} alt={chainObj.label} />
                                                        {chainObj.label}
                                                    </div>
                                                )}
                                                {isPublished && contract?.address && address()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div>
                                <div className={styles.tags}>
                                    {isDraft && <Tag name={TagType.DRAFT} />}
                                    {isRecipient && <Tag name={TagType.RECIPIENT} />}
                                    {isPending && <Tag name={TagType.PENDING} />}
                                    {isPublished && <Tag name={TagType.PUBLISHED} />}
                                    {contract?.visibility === 'COMMUNITY' && <Tag name={TagType.COMMUNITY} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
