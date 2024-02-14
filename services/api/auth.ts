import axios from 'axios';

const authApi = axios.create({
    baseURL: `${process.env.AUTH_SERVICE}/api`,
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

const getAuthToken = (token: any) => {
    return authApi.post('/v1/auth/xsolla/complete', { token });
};

const signOut = (token: any) => {
    return authApi.post('/v1/auth/logout', { token });
};

const getNonce = (id: any) => {
    return authApi.post('/v1/auth/wallet/begin', { publicKey: id });
};

const nonceSign = async (nonce: any, signature: any, provider?: string) => {
    const dto = {
        nonce,
        signature,
        provider: provider || '',
    };
    return authApi.post('/v1/auth/wallet/complete', dto);
};

const tokenExchange = async (token: any) => {
    try {
        return await authApi.post('/v1/auth/token/exchange', { token });
    } catch {
        return null;
    }
};

const AuthService = {
    getAuthToken,
    signOut,
    getNonce,
    nonceSign,
    tokenExchange,
};

export default AuthService;
