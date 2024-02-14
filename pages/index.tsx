import Head from 'next/head';
import { Login } from 'components/auth/login';

import PageWithLayoutType from 'types/layoutPages';
import AuthLayout from 'layouts/authLayout';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import { useAuthStore } from 'stores/AuthStore';
import { getCookie } from 'cookies-next';
import { TOKEN_COOKIE_NAME } from 'services/jwtToken';
import { ROUTES } from '../constants/routes';

const Home: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);
    const authStore = useAuthStore();

    useEffect(() => {
        const token = getCookie(TOKEN_COOKIE_NAME);
        if (authStore.getIsAuthenticated() && token) {
            router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
        } else {
            authStore.setIsAuthenticated(false);
            setLoading(false);
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>XLA</title>
                <meta name="description" content="" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {!loading && (
                <Login />
            )}
        </>
    );
};

(Home as PageWithLayoutType).layout = AuthLayout;

export default observer(Home);
