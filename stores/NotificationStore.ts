import { types, Instance } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { ToastDescriptionType } from 'types/common/ToastDescriptionType';
import { ToastType } from 'types/common/ToastType';

const errorTitle = 'An error happened, please try again.';

export type DescriptionObjectType = {
    text?: string,
    type?: any,
    contractId?: string,
    contractTitle?: string
}

export const DescriptionObject = types
    .model('DescriptionObject', {
        text: types.optional(types.string, ''),
        type: types.maybeNull(types.enumeration(Object.values(ToastDescriptionType))),
        contractId: types.optional(types.string, ''),
        contractTitle: types.optional(types.string, ''),
    });

const Notification = types
    .model('Notification', {
        id: types.identifier,
        type: types.enumeration(Object.values(ToastType)),
        title: types.string,
        description: types.maybe(DescriptionObject),
    });

const NotificationStore = types
    .model('NotificationStore', {
        notifications: types.array(Notification),
    })
    .actions((self) => {
        const store = self as Instance<typeof NotificationStore>;

        const remove = (id: string) => {
            const notificationToRemove = store.notifications.find((n) => n.id === id);
            if (notificationToRemove) {
                store.notifications.remove(notificationToRemove);
            }
        };

        const add = (notification: Instance<typeof Notification>) => {
            store.notifications.push(notification);
        };

        const addWithTimeout = (notification: Instance<typeof Notification>, duration = 4000) => {
            store.add(notification);
            setTimeout(() => {
                const notificationToRemove = store.notifications.find((n) => n.id === notification.id);
                if (notificationToRemove) {
                    store.remove(notificationToRemove.id);
                }
            }, duration);
        };

        const clear = () => {
            store.notifications.clear();
        };

        const error = (description: DescriptionObjectType = {}, title: string = errorTitle) => {
            add(Notification.create({
                id: `not-${Date.now()}`,
                type: ToastType.ERROR,
                title,
                description,
            }));
        };

        const success = (title: string, isClose = true, description?: DescriptionObjectType) => {
            const baseToast = Notification.create({
                id: `not-${Date.now()}`,
                type: ToastType.SUCCESS,
                title,
                description,
            });

            if (isClose) {
                addWithTimeout(baseToast);
            } else add(baseToast);
        };

        const info = (description: DescriptionObjectType = {}) => {
            add(Notification.create({
                id: `not-${Date.now()}`,
                type: ToastType.INFO,
                title: 'Information.',
                description,
            }));
        };

        return {
            add,
            addWithTimeout,
            remove,
            clear,
            error,
            success,
            info,
        };
    });

export type NotificationStoreInstance = Instance<typeof NotificationStore>;

export const NotificationContext = createContext<NotificationStoreInstance | null>(null);
export const NotificationProvider = NotificationContext.Provider;

export function useNotificationStore() {
    return useContext(NotificationContext);
}

export const notificationStore = NotificationStore.create({ notifications: [] });
