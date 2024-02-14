import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ContractDto } from 'types/contract/ContractDto';
import { Skeleton } from '@mantine/core';
import { contractService } from 'services/api/contract';
import { ROUTES } from 'constants/routes';
import { ErrorType } from 'types/errors/ErrorType';
import { useNotificationStore } from 'stores/NotificationStore';
import styles from './ContractEdit.module.scss';
import EditForm from './EditForm';

function ContractEdit() {
    const router = useRouter();
    const notificationStore = useNotificationStore();

    const [contract, setContract] = useState<ContractDto>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    const [visibility, setVisibility] = useState(true);

    useEffect(() => {
        if (error) {
            const { status, message } = error;
            if (status === ErrorType.NOT_ACCESS || status === ErrorType.NOT_FOUND) {
                localStorage.setItem('contractLoading', status);
                router.push(`${ROUTES.CONTRACTS}?type=my&status=published`);
            } else {
                notificationStore?.error({ text: message });
            }
        }
    }, [error]);

    useEffect(() => {
        (async () => {
            // get contract from backend
            if (router.query.id) {
                const contractId: any = router.query.id;
                const contract = contractId && (await getContract(contractId));

                if (contract) {
                    setContract({
                        ...contract,
                        id: contractId,
                    });
                } else {
                    setContract({
                        id: 'id',
                        title: 'title',
                        description: 'description',
                        version: '0',
                        type: 'type',
                        visibility: 'PRIVATE',
                    });
                    setVisibility(false);
                }
            }
        })().then(() => {
            setIsLoading(false);
        });
    }, [router]);

    async function getContract(id: string) {
        try {
            return await contractService.findById(id);
        } catch (e: any) {
            setError({ status: String(e.status), message: e.message });
            return null;
        }
    }

    if (isLoading || !contract) {
        return (
            <div className={styles.container}>
                <Skeleton
                    height={192}
                    mt={20}
                    width={926}
                    className={styles.skeleton}
                />
                <Skeleton
                    height={210}
                    mt={40}
                    width={926}
                    className={styles.skeleton}
                />
                <Skeleton
                    height={150}
                    mt={40}
                    width={926}
                    className={styles.skeleton}
                />
            </div>
        );
    }

    return contract && <EditForm contract={contract} setContract={setContract} visibility={visibility} />;
}

export default ContractEdit;
