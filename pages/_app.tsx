import { Inter } from '@next/font/google';
import 'styles/globals.scss';
import PageWithLayoutType from 'types/layoutPages';
import React, { useEffect } from 'react';
import Script from 'next/script';
import { initializeGoogleAnalytics } from 'utils/google-analytics';

import persistStoresConfig from 'stores';

import { connectorsForWallets, darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';

import {
    configureChains, createClient, goerli, WagmiConfig,
} from 'wagmi';
import { mainnet, polygon, polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

import '@rainbow-me/rainbowkit/styles.css';
import {
    coinbaseWallet,
    injectedWallet,
    metaMaskWallet,
    rainbowWallet,
    walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { Monitoring } from 'components/monitoring';
import { StoreProviders } from 'stores/providers/StoreProviders';
import Notifications from '../components/toasts/Notifications';

const { chains, provider } = configureChains(
    [mainnet, goerli, polygonMumbai, polygon],
    [alchemyProvider({ apiKey: process.env.MAINNET_ALCHEMY_ID || '' }),
        publicProvider()],
);

const connectors = connectorsForWallets([
    {
        groupName: 'Wallets',
        wallets: [
            injectedWallet({ chains }),
            // rainbowWallet({ chains }),
            // walletConnectWallet({ chains }),
            metaMaskWallet({ chains, shimDisconnect: true }),
            coinbaseWallet({ appName: 'XLA app', chains }),
        ],
    },
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
});

persistStoresConfig();

const inter = Inter({ subsets: ['latin'] });

type AppLayoutProps = {
    Component: PageWithLayoutType;
    pageProps: any;
};

export default function App({ Component, pageProps }: AppLayoutProps) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    const Layout = Component.layout || ((children) => <>{children}</>);
    const analytics = process.env.ANALYTICS;

    useEffect(() => {
        if (analytics) {
            initializeGoogleAnalytics();
        }
    }, []);

    return (
        <>
            {analytics === 'true'
            && (
                <Script
                    id="ga"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-NDC83R7');
                        `,
                    }}
                />
            )}
            {analytics === 'true'
            && (
                <Script
                    id="hotjar"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                        (function(h,o,t,j,a,r){
                            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                            h._hjSettings={hjid:3432313,hjsv:6};
                            a=o.getElementsByTagName('head')[0];
                            r=o.createElement('script');r.async=1;
                            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                            a.appendChild(r);
                        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
                        `,
                    }}
                />
            )}
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains} theme={darkTheme()}>
                    <StoreProviders>
                        <main className={inter.className}>
                            <Layout>
                                <Component {...pageProps} />
                                <Monitoring />
                            </Layout>
                        </main>
                        <Notifications />
                    </StoreProviders>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    );
}
