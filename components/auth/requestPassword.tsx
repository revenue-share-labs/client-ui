import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, TextInput } from '@mantine/core';
import styles from './login.module.scss';

import xlaLogo from '../../public/images/XLA_logo.svg';
import arrowLeft from '../../public/icons/arrow-back.svg';

export function RequestPassword() {
    return (
        <div className={`${styles.container} ${styles.backForgot}`}>
            <div className={styles.formContainer}>

                <div className={styles.title}>Request your new password</div>
                <div className={styles.about}>
                    If you forget the password you can request a new one on this page.
                    Enter your email
                </div>

                <div className={styles.backToMain}>
                    <Link href="/">
                        <Image
                            src={arrowLeft.src}
                            alt="Back to main"
                            width={16}
                            height={15}
                        />
                    </Link>
                    {' '}
                    Back to login page
                </div>

                <TextInput
                    label="Email"
                    placeholder="example@mail.com"
                    classNames={{ label: styles.label, input: styles.input }}
                />

                <Button classNames={{ root: styles.btnLogin }}>
                    Request a new password
                </Button>
            </div>
            <div className={styles.copyContainer}>
                Copyright © XLA 2023. All rights reserved.
            </div>
        </div>
    );
}
