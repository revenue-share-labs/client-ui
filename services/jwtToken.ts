import { getCookie, setCookies } from 'cookies-next';

import AuthService from 'services/api/auth';

export const TOKEN_COOKIE_NAME = 'token';

export const refreshToken = async (jwt : string) => {
    try {
        const response = await AuthService.tokenExchange(jwt);
        if (response) {
            const { token } = response.data;

            setCookies(TOKEN_COOKIE_NAME, token);
            return token;
        }

        return null;
    } catch (error) {
        return null;
    }
};

export const getAccessToken = async () => {
    let accessToken = getCookie(TOKEN_COOKIE_NAME);

    if (!accessToken) {
        return null;
    }

    if (!accessToken || typeof accessToken === 'boolean') return '';

    const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));

    if (new Date() >= new Date(decodedToken.exp * 1000)) {
        // Access token has expired, try to refresh
        accessToken = await refreshToken(accessToken);
    }

    return accessToken;
};

export const getCurrentToken = async (): Promise<{ headers: { Authorization: string } }> => {
    const token = await getAccessToken();

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};
