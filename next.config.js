/** @type {import('next').NextConfig} */
const path = require('path');
require('dotenv').config({ path: `${process.env.ENVIRONMENT}` });

const nextConfig = {
    env: {
        AUTH_SERVICE: process.env.AUTH_SERVICE,
        NEXT_PUBLIC_LOGIN_WIDEGT: process.env.NEXT_PUBLIC_LOGIN_WIDEGT,
        CONTRACT_SERVICE: process.env.CONTRACT_SERVICE,
        USER_SERVICE: process.env.USER_SERVICE,
        basicLogin: process.env.BASIC_LOGIN || '',
        basicPassword: process.env.BASIC_PASSWORD || '',
        CHAIN: process.env.CHAIN,
        ANALYTICS: process.env.ANALYTICS,
        ASSET_PATH: process.env.ASSET_PATH,
        BASE_PATH: process.env.BASE_PATH,
        MAINNET_ALCHEMY_ID: process.env.MAINNET_ALCHEMY_ID,
        GOERLI_ALCHEMY_ID: process.env.GOERLI_ALCHEMY_ID,
        MUMBAI_ALCHEMY_ID: process.env.MUMBAI_ALCHEMY_ID,
        POLYGON_ALCHEMY_ID: process.env.POLYGON_ALCHEMY_ID,
    },
    basePath: process.env.BASE_PATH ? process.env.BASE_PATH : '',
    assetPrefix: process.env.ASSET_PATH ? process.env.ASSET_PATH : undefined,
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    images: {
        unoptimized: true,
    },
};

module.exports = nextConfig;
