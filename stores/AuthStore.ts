import {
    applySnapshot, getSnapshot, Instance, types,
} from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { storageService } from 'services/storageService';
import { getInjectedStorage } from './utils/getters';

const AUTH_STORAGE_KEY = 'auth-store';

export const AuthStoreImpl = types.model('AuthStore', {
    isAuthenticated: types.boolean,
})
    .views((self) => {
        return {
            getIsAuthenticated() {
                return self.isAuthenticated;
            },
        };
    })
    .actions((self) => {
        function putToStore() {
            const storage: any = getInjectedStorage(self);
            const snapshot: any = getSnapshot(self);
            storage.set(AUTH_STORAGE_KEY, JSON.stringify(snapshot));
        }

        const setIsAuthenticated = (value: boolean) => {
            // eslint-disable-next-line no-param-reassign
            self.isAuthenticated = value;
            putToStore();
        };

        return {
            setIsAuthenticated,
            afterCreate() {
                const store: any = getInjectedStorage(self).get(AUTH_STORAGE_KEY);
                if (store) {
                    const orderSnapshot = JSON.parse(store);
                    applySnapshot(self, orderSnapshot);
                }
            },
        };
    });

export type AuthStore = Instance<typeof AuthStoreImpl>;

const AuthStoreContext = createContext<AuthStore>(null as any);

export const AuthStoreProvider = AuthStoreContext.Provider;

export function useAuthStore() {
    return useContext(AuthStoreContext);
}

export const auth = AuthStoreImpl.create(
    {
        isAuthenticated: false,
    },
    { storageService },
);
