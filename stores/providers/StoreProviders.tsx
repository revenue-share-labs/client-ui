import React, { ReactNode } from 'react';
import { transactions, TransactionStoreProvider } from 'stores/TransactionStore';
import { auth, AuthStoreProvider } from 'stores/AuthStore';
import { NotificationProvider, notificationStore } from 'stores/NotificationStore';
import { SearchStoreProvider, contractsSearch } from 'stores/SearchStore';

type ProvidersProps = {
    children: ReactNode;
};

export function StoreProviders({
    children,
}: ProvidersProps) {
    return (
        <NotificationProvider value={notificationStore}>
            <TransactionStoreProvider value={transactions}>
                <SearchStoreProvider value={contractsSearch}>
                    <AuthStoreProvider value={auth}>
                        {children}
                    </AuthStoreProvider>
                </SearchStoreProvider>
            </TransactionStoreProvider>
        </NotificationProvider>
    );
}
