import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { UserDto } from '../types/user/UserDTO';

class UserStore {
    userData: UserDto = {};

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, { name: 'UserStore', properties: ['userData'] });
    }

    updateUser(value : UserDto) {
        this.userData = value;
    }

    flushUser() {
        this.userData = {};
    }

    updateActiveWallet(value: string, provider: string) {
        this.userData = {
            ...this.userData,
            activeWallet: { address: value, provider },
        };
    }

    clearActiveWallet() {
        this.userData = {
            ...this.userData,
            activeWallet: {},
        };
    }
}

const userStore = new UserStore();
export default userStore;
