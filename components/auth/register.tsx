import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Tabs } from '@mantine/core';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';
import xlaLogo from 'public/images/XLA_logo.svg';
import styles from './login.module.scss';

import { SignUpForm } from './signupForm';
import Wallet from './wallet';

export function Register() {
    return (
        <div className={`${styles.container} ${styles.backSignup}`}>
            <div className={styles.formContainer}>

                <div className={styles.title}>Sign Up to XLA Contracts</div>
                <div className={styles.about}>
                    This is a fabric of the contracts and it’s one of a kind. Greetings!
                </div>

                <div className={styles.tabContainer}>
                    <Tabs
                        defaultValue="username"
                        classNames={{
                            tabsList: styles.tabsList,
                            tab: styles.tab,
                            tabLabel: styles.tabLabel,
                        }}
                    >
                        <Tabs.List>
                            <Tabs.Tab value="username">Username/Password</Tabs.Tab>
                            <Tabs.Tab value="wallet">Wallet</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="username" pt="xs">
                            <SignUpForm />
                        </Tabs.Panel>

                        <Tabs.Panel value="wallet" pt="xs">
                            <Wallet />
                        </Tabs.Panel>
                    </Tabs>
                </div>

                <div className={styles.social}>
                    Login through social
                    <br />
                    <IoLogoFacebook className={styles.iconSocial} />
                    {' '}
                    <IoLogoInstagram className={styles.iconSocial} />
                    {' '}
                    <IoLogoTwitter className={styles.iconSocial} />
                </div>
                <div className={styles.text}>
                    I have an account.
                    {' '}
                    <Link href="/">Login</Link>
                </div>
            </div>
            <div className={styles.copyContainer}>
                Copyright © XLA 2023. All rights reserved.
            </div>
        </div>
    );
}
