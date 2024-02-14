import {
    applySnapshot, getSnapshot, Instance, types,
} from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { storageService } from 'services/storageService';

const TRANSACTION_STORAGE_KEY = 'transaction-store';

export const RecipientsParams = types
    .model('RecipientsParams', {
        id: (types.string),
        name: types.maybeNull(types.string),
        address: (types.string),
        revenue: types.string,
    });

export const UpdatedData = types
    .model('UpdatedData', {
        controller: types.maybeNull(types.string),
        recipients: types.maybeNull(types.array(RecipientsParams)),
        immutableController: types.boolean,
        isRecipientsLocked: types.boolean,
    });

export const TransactionItemImpl = types
    .model('TransactionItem', {
        id: types.string,
        hash: types.string,
        network: types.string,
        data: types.maybeNull(UpdatedData),
    });

export const PublishedContractParams = types
    .model('PublishedContract', {
        id: types.string,
        address: types.string,
        isPublish: types.boolean,
        data: types.maybeNull(UpdatedData),
    });

export type TransactionItem = Instance<typeof TransactionItemImpl>;

export const TransactionStoreImpl = types.model('TransactionStore', {
    pendingTransactions: types.array(TransactionItemImpl),
    currentPublishedContracts: types.array(PublishedContractParams),
})
    .views((self) => {
        return {
            getCurrentPublishedContracts() {
                return JSON.parse(JSON.stringify(self.currentPublishedContracts));
            },
        };
    })
    .actions((self) => {
        const putToStore = () => {
            const snapshot = getSnapshot(self);
            storageService.set(TRANSACTION_STORAGE_KEY, JSON.stringify(snapshot));
        };

        const push = (args: {
            id: string;
            hash: string;
            network: string;
            data?: any;
        }) => {
            const transaction = TransactionItemImpl.create({
                id: args.id,
                hash: args.hash,
                network: args.network,
                data: args.data,
            });

            self.pendingTransactions.push(transaction);
            putToStore();
        };

        const remove = (id: string) => {
            const newItems = self.pendingTransactions.filter((i: any) => i.id !== id);
            self.pendingTransactions.replace(newItems);
            putToStore();
        };

        const addToPublishedContract = (value: any) => {
            const contract = PublishedContractParams.create({
                id: value.id,
                address: value.address,
                isPublish: value.isPublish,
                data: value.data,
            });

            self.currentPublishedContracts.push(contract);
            putToStore();
        };

        const removePublishedContract = (id: string) => {
            const newItems = self.currentPublishedContracts.filter((i: any) => i.id !== id);
            self.currentPublishedContracts.replace(newItems);
            putToStore();
        };

        const getTransactions = () => {
            return JSON.parse(JSON.stringify(self.pendingTransactions));
        };

        return {
            push,
            remove,
            getTransactions,
            addToPublishedContract,
            removePublishedContract,
            afterCreate() {
                const storedSnapshot = storageService.get(TRANSACTION_STORAGE_KEY);
                const snapshot = storedSnapshot ? JSON.parse(storedSnapshot) : null;
                if (snapshot) {
                    applySnapshot(self, snapshot);
                }
            },
        };
    });

export type TransactionStoreImpl = Instance<typeof TransactionStoreImpl>;

const TransactionStoreContext = createContext<TransactionStoreImpl>(null as any);

export const TransactionStoreProvider = TransactionStoreContext.Provider;

export function useTransactionsStore() {
    return useContext(TransactionStoreContext);
}

export const transactions = TransactionStoreImpl.create({}, { storageService });
