export type StorageService = {
  set(key: string, val: string): void;
  get(key: string): string | null;
};

export const storageService: StorageService = {
    set(key: string, val: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, val);
        }
    },
    get(key: string): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    },
};
