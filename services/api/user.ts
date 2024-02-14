import axios from 'axios';
import { UserDto } from 'types/user/UserDTO';
import userStore from 'stores/UserStore';
import { getCurrentToken } from '../jwtToken';

const baseURL = `${process.env.USER_SERVICE}/api`;
const api = axios.create({
    baseURL,
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});

const userService = {

    async getUser(id: string) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.get<UserDto>(`/v1/users/${id}`, token);
            userStore.updateUser(data);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

    async addWallet(wallet: string, provider: string) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.patch<UserDto>('/v1/users/wallet', { wallet, provider }, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

    async removeWallet(wallet: string) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.delete<UserDto>(`/v1/users/wallet/${wallet}`, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

};

export default userService;
