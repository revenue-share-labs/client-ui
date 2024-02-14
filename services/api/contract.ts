import axios from 'axios';
import { ContractDto } from 'types/contract/ContractDto';
import { getCurrentToken } from '../jwtToken';
import { loggerService } from '../loggerService';

const baseURL = `${process.env.CONTRACT_SERVICE}/api`;
const api = axios.create({
    baseURL,
    headers: {
        'Content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    },
});
api.interceptors.response.use(
    (r) => r,
    (e) => {
        loggerService.error(`Contract service: ${e.message}`);
        return Promise.reject(e);
    },
);

const contractsUrl = '/v1/contracts';

export const contractService = {
    async createDraft(dto: ContractDto) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.post(contractsUrl, dto, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

    async findById(id: string) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.get<ContractDto>(`${contractsUrl}/${id}`, token);
            return data;
        } catch (e: any) {
            throw e.response;
        }
    },

    async update(id: string, dto: any) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.put<ContractDto>(`${contractsUrl}/${id}`, dto, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

    async searchContracts(params: any, body: any) {
        // eslint-disable-next-line no-useless-catch
        try {
            let query = `${contractsUrl}/search?offset=${params.offset}&limit=${params.limit}`;
            if (params.status) {
                query = `${query}&status=${params.status}`;
            }

            const token = await getCurrentToken();
            if (token) {
                const { data } = await api.post(query, body, token);
                return {
                    content: data.data || [],
                    total: data.total,
                };
            }
            return { content: [], total: 0 };
        } catch (e: any) {
            return { content: [], total: 0 };
        }
    },

    async updateStatus(id: string, payload: any) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.patch(`${contractsUrl}/${id}/status`, payload, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },

    async deleteDraft(id: string) {
        try {
            const token = await getCurrentToken();
            const { data } = await api.delete(`${contractsUrl}/${id}`, token);
            return data;
        } catch (e: any) {
            throw e.response.data;
        }
    },
};
