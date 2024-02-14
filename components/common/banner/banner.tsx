import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';

import xlaLogo from 'public/images/XLA_logo.svg';
import CustomButton from '../button/CustomButton';

import styles from './style.module.scss';

type BannerProps = {
  title: string;
  description: string;
  img?: ReactNode;
  nameBtn?: string;
  onClick?: () => void;
};

const Banner = ({
    title, description, img, nameBtn, onClick,
}: BannerProps) => {
    return (
        <div className={styles.container}>
            <div className={styles.container__banner}>
                <div className={styles.container__banner__info}>
                    {img && img}
                    <div className={styles.container__banner__info__title}>{title}</div>
                    <div className={styles.container__banner__info__description}>
                        {description}
                    </div>
                </div>
                {nameBtn && (
                    <CustomButton
                        name={nameBtn}
                        style={{ padding: '0 12px' }}
                        radius={12}
                        onClick={onClick}
                    />
                )}
            </div>
        </div>
    );
};

export default Banner;
