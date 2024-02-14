import React from 'react';
import Image from 'next/image';

import circlePlus from 'public/icons/add-circle.svg';
import { useRouter } from 'next/router';
import { ROUTES } from 'constants/routes';
import styles from './index.module.scss';
import CustomButton from '../common/button/CustomButton';
import Wallet from '../wallet';

export function Header() {
    const router = useRouter();

    const toWizard = () => {
        router.push(ROUTES.NEW_CONTRACT);
    };

    return (
        <div className={styles.header}>
            <div className={styles.title}>My Contracts</div>

            <div className={styles.actions}>
                <Wallet />

                <CustomButton
                    name="Create New Contract"
                    color="blue"
                    style={{ height: 40 }}
                    radius={12}
                    rightIcon={
                        <Image src={circlePlus.src} alt="" width={20} height={20} />
                    }
                    onClick={toWizard}
                />
            </div>
        </div>
    );
}
