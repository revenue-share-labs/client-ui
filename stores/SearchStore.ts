import {
    applySnapshot, getSnapshot, Instance, types,
} from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { storageService } from 'services/storageService';

const SEARCH_STORAGE_KEY = 'search-store';

export const SortItem = types
    .model('SortItem', {
        dateSortOrder: types.optional(types.string, ''),
        epoch: types.optional(types.string, ''),
    });

export const SearchParamsItem = types
    .model('SearchParamsItem', {
        participantStatus: types.array(types.string),
        titleSortOrder: types.optional(types.string, ''),
        dateSortOrder: types.optional(types.string, ''),
        epoch: types.optional(types.string, ''),
        type: types.array(types.string),
        visibility: types.array(types.string),
        recipientsStatus: types.array(types.string),
    });

export const SearchStoreImpl = types.model('SearchStore', {
    isDraft: types.boolean,
    isMy: types.boolean,
    searchParams: types.maybeNull(SearchParamsItem),
    isFilterByRecipient: types.boolean,
    isFilterByOwner: types.boolean,
    isDataCleared: types.boolean,
})
    .views((self) => {
        return {
            getSearchParams() {
                const notEmptyKeys = self.searchParams ? Object.fromEntries(Object.entries(self.searchParams)
                    .filter(([key, value]) => value !== '' && value !== null && (value && value.length > 0))) : {};
                return JSON.parse(JSON.stringify(notEmptyKeys));
            },
        };
    })
    .actions((self) => {
        const putToStore = () => {
            const snapshot = getSnapshot(self);
            storageService.set(SEARCH_STORAGE_KEY, JSON.stringify(snapshot));
        };

        const setIsDraft = (value: boolean) => {
            applySnapshot(self, {
                ...self,
                isDraft: value,
            });
            putToStore();
        };

        const setIsDataCleared = (value: boolean) => {
            applySnapshot(self, {
                ...self,
                isDataCleared: value,
            });
            putToStore();
        };

        const setIsMy = (value: boolean) => {
            applySnapshot(self, {
                ...self,
                isMy: value,
            });
            putToStore();
        };

        const setIsFilterByRecipient = (value: boolean) => {
            applySnapshot(self, {
                ...self,
                isFilterByRecipient: value,
            });
            putToStore();
        };

        const setIsFilterByOwner = (value: boolean) => {
            applySnapshot(self, {
                ...self,
                isFilterByOwner: value,
            });
            putToStore();
        };

        const toggleIsFilterByRecipient = () => {
            applySnapshot(self, {
                ...self,
                isFilterByRecipient: !self.isFilterByRecipient,
            });
            putToStore();
        };
        const toggleIsFilterByOwner = () => {
            applySnapshot(self, {
                ...self,
                isFilterByOwner: !self.isFilterByOwner,
            });
            putToStore();
        };

        const clearSearchParams = () => {
            const newSnapshot = {
                ...self,
                searchParams: {},
            };
            applySnapshot(self, newSnapshot);
            putToStore();
        };

        const setSearchParams = (value: any) => {
            const newSnapshot = {
                ...self,
                searchParams: value,
            };
            applySnapshot(self, newSnapshot);
            putToStore();
        };

        const clear = () => {
            const newSnapshot = {
                isMy: false,
                isDraft: false,
                isDataCleared: false,
                isFilterByRecipient: false,
                isFilterByOwner: false,
                searchParams: {},
            };
            applySnapshot(self, newSnapshot);
            putToStore();
        };

        return {
            setIsDraft,
            setIsDataCleared,
            setIsMy,
            clearSearchParams,
            setSearchParams,
            toggleIsFilterByRecipient,
            toggleIsFilterByOwner,
            setIsFilterByRecipient,
            setIsFilterByOwner,
            clear,
            afterCreate() {
                const storedSnapshot = storageService.get(SEARCH_STORAGE_KEY);
                const snapshot = storedSnapshot ? JSON.parse(storedSnapshot) : null;
                if (snapshot) {
                    applySnapshot(self, snapshot);
                }
            },
        };
    });

export type SearchStoreImpl = Instance<typeof SearchStoreImpl>;

const SearchStoreContext = createContext<SearchStoreImpl>({} as SearchStoreImpl);

export const SearchStoreProvider = SearchStoreContext.Provider;

export function useSearchStore() {
    return useContext(SearchStoreContext);
}

export const contractsSearch = SearchStoreImpl.create({
    isDraft: false,
    isMy: false,
    isDataCleared: false,
    searchParams: {},
    isFilterByRecipient: false,
    isFilterByOwner: false,
}, { storageService });
