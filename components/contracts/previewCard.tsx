import React from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from 'constants/routes';
import Image from 'next/image';
import Moment from 'react-moment';

import avatar from 'public/images/avatar.png';
import ethereumIcon from 'public/icons/Ethereum.svg';
import polygon from 'public/icons/icon-polygonGray-circle.svg';
import userStore from 'stores/UserStore';
import { ChainType } from 'types/contract/ChainType';
import styles from './previewCard.module.scss';

type PreviewCardProps = {
  isDrafts: boolean;
  isMyContract: boolean;
  item: any;
};

const chainIcon = (chain: ChainType) => {
    if (chain === ChainType.ETHEREUM || chain === ChainType.ETHEREUM_GOERLI) {
        return ethereumIcon.src;
    }

    if (chain === ChainType.POLYGON_MUMBAI || chain === ChainType.POLYGON) {
        return polygon.src;
    }

    return '';
};

export function PreviewCard({
    isDrafts,
    isMyContract,
    item,
}: PreviewCardProps) {
    const router = useRouter();

    const toContract = () => {
        router.push(`${ROUTES.NEW_CONTRACT}/${item?.id}`);
    };

    const chain = item.chain ? chainIcon(item.chain) : null;

    return (
        <div className={styles.previewContainer} onClick={toContract}>
            <div className={`${styles.poster} ${isDrafts && styles.bw}`}>
                {
                    chain
                    && (
                        <Image
                            src={chain}
                            alt={`${item.chain.toLowerCase()} icon`}
                            className={styles.ico}
                            width={24}
                            height={24}
                        />
                    )
                }

            </div>

            <div className={styles.previewContentBlock}>
                {/* {!isMyContract && (
                    <div className={styles.previewContentLeft}>
                        <Image src={avatar.src} alt="XLA" width={40} height={40} />
                    </div>
                )} */}

                <div className={styles.previewContent}>
                    <div className={styles.title}>{item?.title}</div>
                    <div className={styles.desc}>
                        <span>
                            {item.author === userStore.userData.id
                                ? 'Your Contract' : ''}
                        </span>
                        {' '}
                        •&nbsp;
                        {isDrafts ? (
                            <>
                                Edited&nbsp;
                                <Moment date={item.updatedAt} fromNow ago />
                                {' '}
                                ago
                            </>
                        ) : (
                            <>
                                Created&nbsp;
                                <Moment date={item.createdAt} format="DD.MM.YYYY" />
                            </>
                        )}
                    </div>
                </div>

                {/* {!isMyContract && ( */}
                {/*    <div className={styles.previewContentRight}> */}
                {/*        <Image src={shareIcon.src} alt="share" width={18} height={18} /> */}
                {/*        {' '} */}
                {/*        <span>180</span> */}
                {/*    </div> */}
                {/* )} */}
            </div>
        </div>
    );
}
