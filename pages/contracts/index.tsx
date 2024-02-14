import React, { useCallback, useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import GeneralLayout from 'layouts/generalLayout';
import PageWithLayoutType from 'types/layoutPages';

import PreviewCards from 'components/contracts/previewCards';
import { FilterBlock } from 'components/contracts/filterBlock';
import { useAccount } from 'wagmi';
import CustomModal from 'components/common/modal/CustomModal';
import { ErrorType } from 'types/errors/ErrorType';
import { useSearchStore } from 'stores/SearchStore';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

const contractNotFoundTitle = 'Contract not found';
const contractNotFoundDesc = 'This contract was not found because it was deleted or did not exist.';

const notAccessTitle = "You don't have access";
const notAccessDesc = 'Unfortunately, your account does not have access to the contract you’d like to see.';

const Contracts: React.FC = () => {
    const router = useRouter();
    const searchStore = useSearchStore();

    const { address } = useAccount();

    const [page, setPage] = useState(DEFAULT_PAGE);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    // use this param when we change params for search
    const [isPrepareSearchParams, setIsPrepareSearchParams] = useState(false);
    // use this param when we process the data from query/change url
    const [isLoadingQuery, setIsLoadingQuery] = useState(true);

    const [contractLoadingErrorModal, setContractLoadingErrorModal] = useState(false);
    const [contractLoadingError, setContractLoadingError] = useState('');

    useEffect(() => {
        const contractLoading = localStorage.getItem('contractLoading');
        if (contractLoading) {
            setContractLoadingError(contractLoading);
            setContractLoadingErrorModal(true);
            localStorage.removeItem('contractLoading');
        }
    }, []);

    const processQueryParams = useCallback(
        async () => {
            if (router.query && router.query.type) {
                const { type, status } = router.query;
                searchStore.setIsMy(type === 'my');
                searchStore.setIsDraft(status === 'drafts');
            }
        },
        [router.query],
    );

    useEffect(() => {
        if (isLoadingQuery && router.query && router.query.type) {
            setPageSize(DEFAULT_PAGE_SIZE);
            setPage(DEFAULT_PAGE);
            searchStore.clear();
            processQueryParams().then(() => {
                setIsLoadingQuery(false);
            });
        }
    }, [isLoadingQuery, router.query, processQueryParams, address]);

    useEffect(() => {
        if (!isLoadingQuery) {
            setIsLoadingQuery(true);
        }
    }, [router.query, address]);

    return (
        <>
            <CustomModal
                isOpen={contractLoadingErrorModal}
                onClose={() => {
                    setContractLoadingErrorModal(false);
                }}
                cancelBtn={false}
                onConfirm={() => setContractLoadingErrorModal(false)}
                confirmBtnLabel="Ok"
                title={contractLoadingError === ErrorType.NOT_ACCESS ? notAccessTitle : contractNotFoundTitle}
                description={contractLoadingError === ErrorType.NOT_ACCESS ? notAccessDesc : contractNotFoundDesc}
            />

            <FilterBlock setIsPrepareSearchParams={setIsPrepareSearchParams} />

            <PreviewCards
                isLoadingQuery={isLoadingQuery}
                isPrepareSearchParams={isPrepareSearchParams}
                setIsPrepareSearchParams={setIsPrepareSearchParams}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        </>
    );
};

(Contracts as PageWithLayoutType).layout = GeneralLayout;

export default observer(Contracts);
