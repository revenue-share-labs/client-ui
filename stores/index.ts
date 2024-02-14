import { configurePersistable } from 'mobx-persist-store';
import localForage from 'localforage';

export default function persistStoresConfig() {
    const isStorageAvailable = typeof Storage !== 'undefined';
    configurePersistable({
        storage: isStorageAvailable ? localForage : undefined,
        stringify: true,
        debugMode: false,
    });
}
