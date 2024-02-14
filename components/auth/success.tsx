import React, { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import AuthService from 'services/api/auth';
import { observer } from 'mobx-react-lite';
import { setCookies } from 'cookies-next';

import xlaLogo from 'public/images/XLA_logo.svg';
import { ROUTES } from 'constants/routes';
import { useAuthStore } from 'stores/AuthStore';
import { TOKEN_COOKIE_NAME } from 'services/jwtToken';
import styles from './login.module.scss';

function SuccessPage() {
    const router = useRouter();
    const authStore = useAuthStore();

    useEffect(() => {
        if (router.query && router.query.token) {
            AuthService.getAuthToken(router.query.token)
                .then((res) => {
                    const { data } = res;
                    setCookies(TOKEN_COOKIE_NAME, data.token);
                    router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
                    authStore.setIsAuthenticated(true);
                })
                .catch((e) => {
                    authStore.setIsAuthenticated(false);
                    console.error(e);
                });
        }
    }, [router, router.query]);

    return (
        <div className={`${styles.container} ${styles.backAuth}`}>
            <div className={styles.formContainer}>
                <Image src={xlaLogo.src} alt="XLA" width={102} height={32} priority />

                <div className={styles.title}>Success!</div>
                <div className={styles.about}>Now you can do it.</div>
            </div>
            <div className={styles.copyContainer}>
                Copyright © XLA 2023. All rights reserved.
            </div>
        </div>
    );
}

export default observer(SuccessPage);
