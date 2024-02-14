import { getEnv, IStateTreeNode } from 'mobx-state-tree';
import { StorageService } from 'services/storageService';

export function getInjectedStorage(node: IStateTreeNode): StorageService {
    const { storageService } = getEnv(node);
    if (!storageService) throw new Error('No Storage service injected');
    return storageService;
}
