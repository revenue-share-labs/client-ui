import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Loader, ScrollArea } from '@mantine/core';

import { ROUTES } from 'constants/routes';
import PaginationElement from 'components/common/pagination';
import circlePlus from 'public/icons/add-circle.svg';

import { contractService } from 'services/api/contract';

import { observer } from 'mobx-react-lite';
import { ContractStatusType } from 'types/common/ContractStatusType';
import { SearchContractDto } from 'types/contract/SearchContractDto';
import { ParticipantStatus } from 'types/common/ParticipantStatus';
import { VisibilityType } from 'types/contract/VisibilityType';
import { useNotificationStore } from 'stores/NotificationStore';
import { useSearchStore } from 'stores/SearchStore';
import CustomButton from '../common/button/CustomButton';
import styles from './previewCard.module.scss';
import { PreviewCard } from './previewCard';

type PreviewCardsProps = {
    isLoadingQuery: boolean;
    isPrepareSearchParams: boolean;
    setIsPrepareSearchParams: (value: boolean) => void;
    page: number;
    setPage: (value: number) => void;
    pageSize: number;
    setPageSize: (value: number) => void;
};

type QueryParamsType = {
    limit?: number,
    offset?: number,
    status?: string,
}

const PreviewCards = ({
    isLoadingQuery,
    isPrepareSearchParams,
    setIsPrepareSearchParams,
    page,
    setPage,
    pageSize,
    setPageSize,
}: PreviewCardsProps) => {
    const router = useRouter();
    const notificationStore = useNotificationStore();
    const searchStore = useSearchStore();

    const [isEmpty, setIsEmpty] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [contracts, setContracts] = useState<SearchContractDto[]>([]);
    const [total, setTotal] = useState(0);
    const [queryParams, updateQueryParams] = useState<QueryParamsType>({
        limit: pageSize,
        offset: pageSize * page - pageSize,
        status: searchStore.isDraft ? `${ContractStatusType.DRAFT}&status=${ContractStatusType.PENDING}`
            : ContractStatusType.PUBLISHED,
    });
    const [isFilterResult, updateIsFilterResult] = useState(false);

    const toWizard = () => {
        router.push(ROUTES.NEW_CONTRACT);
    };

    const prepareSearchParams = useCallback(
        async () => {
            setIsLoading(true);
            const queryParams = {
                limit: pageSize,
                offset: pageSize * page - pageSize,
                status: searchStore.isDraft ? `${ContractStatusType.DRAFT}&status=${ContractStatusType.PENDING}`
                    : ContractStatusType.PUBLISHED,
            };
            updateQueryParams(queryParams);

            updateIsFilterResult(false);
            let bodyParams = {};
            if (searchStore.isMy) {
                const searchAttributes = searchStore.getSearchParams();
                const participantStatuses = [ParticipantStatus.AUTHOR,
                    ParticipantStatus.RECIPIENT,
                    ParticipantStatus.OWNER, ParticipantStatus.CONTROLLER];
                searchAttributes.participantStatus = participantStatuses;
                const dateSortOrder = 'desc';
                const epoch = 'UPDATED';
                bodyParams = { participantStatus: participantStatuses, dateSortOrder, epoch };
                searchStore.setSearchParams(bodyParams);
            } else {
                bodyParams = { visibility: [VisibilityType.COMMUNITY], titleSortOrder: 'desc' };
                searchStore.setSearchParams(bodyParams);
            }

            return {
                queryParams,
                bodyParams,
            };
        },
        [],
    );

    useEffect(() => {
        // when we processed data from query, we can get all contracts
        if (!isLoadingQuery) {
            prepareSearchParams().then(async (values) => {
                const { queryParams, bodyParams } = values;
                getAllData(queryParams, bodyParams).then(() => setIsLoading(false));
            });
        }
    }, [isLoadingQuery, prepareSearchParams]);

    const getAllData = async (queryParams: QueryParamsType, bodyParams: any) => {
        const { content, total } = await contractService.searchContracts(queryParams, bodyParams);
        if (content) {
            setTotal(total);
            if (content.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
                setContracts(content);
            }
        }
    };

    useEffect(() => {
        if (!isPrepareSearchParams && !isLoadingQuery) {
            setIsLoading(true);
            (async () => {
                const searchAttributes = searchStore.getSearchParams();
                if (Object.keys(searchAttributes).length !== 0) {
                    updateIsFilterResult(true);
                }

                return {
                    queryParams,
                    bodyParams: searchAttributes,
                };
            })().then(async (values) => {
                const { queryParams, bodyParams } = values;
                await getAllData(queryParams, bodyParams);
                setIsLoading(false);
            });
        }
    }, [isPrepareSearchParams]);

    const onChangePage = async (pageNumber: number) => {
        try {
            setIsLoading(true);
            setPage(pageNumber);

            const searchParams = searchStore.getSearchParams();
            const params = {
                ...queryParams,
                limit: pageSize,
                offset: pageSize * pageNumber - pageSize,
            };
            await getAllData(params, searchParams);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const computeCurrentPage = (pageSize: number, totalPages: number, currentPage: number) => {
        const pageCount = Math.ceil(totalPages / pageSize);
        return pageCount >= currentPage ? currentPage : Math.ceil(pageCount);
    };

    const onChangePageSize = async (pageSize: number) => {
        try {
            setIsLoading(true);
            setPageSize(pageSize);

            const currentPage = computeCurrentPage(pageSize, total, page);
            setPage(currentPage);

            const searchParams = searchStore.getSearchParams();
            const params = {
                ...queryParams,
                limit: pageSize,
                offset: pageSize * currentPage - pageSize,
            };
            await getAllData(params, searchParams);
        } catch (e: any) {
            notificationStore?.error({ text: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const toReset = () => {
        (async () => {
            setIsPrepareSearchParams(true);
        })().then(() => {
            // trigger for clear filter on the FilterArea
            searchStore.setIsDataCleared(true);
        });
    };

    if (isLoading || isLoadingQuery) {
        return (
            <div className={styles.cardsContainer}>
                <div className={styles.emptyBlock}>
                    <Loader color="#3e4fea" size="lg" variant="bars" />
                </div>
            </div>

        );
    }

    if (isEmpty && !isLoading) {
        return (
            <div className={styles.cardsContainer}>
                <div className={styles.emptyBlock}>
                    <div className={styles.emptyTitle}>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {isFilterResult
                            ? 'No results'
                            : searchStore.isDraft
                                ? "You don't have any drafts"
                                : 'You don’t have any published contracts'}
                    </div>
                    <div className={styles.emptyDesc}>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {isFilterResult
                            ? 'Unfortunately, we didn’t find any contracts according to specified parameters.'
                            : searchStore.isDraft
                                ? 'Unfortunately, we didn’t find any contracts, so you can create it'
                                : 'Unfortunately, we didn’t find any contracts, so you can create it'}
                    </div>
                    <div className={styles.emptyBtn}>
                        <CustomButton
                            name={isFilterResult ? 'Reset Filters' : 'Create New Contract'}
                            color="blue"
                            style={{ height: 48 }}
                            rightIcon={
                                <Image src={circlePlus.src} alt="" width={20} height={20} />
                            }
                            onClick={isFilterResult ? toReset : toWizard}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <ScrollArea className={styles.scrollAreaCalc}>
                <div className={styles.cardsContainer}>
                    {!isLoading && !isEmpty && contracts && (
                        contracts.map((item) => (
                            <PreviewCard
                                isDrafts={searchStore.isDraft}
                                isMyContract={searchStore.isMy}
                                key={`${item?.id}`}
                                item={item}
                            />
                        )))}
                </div>
            </ScrollArea>

            {!isEmpty && (
                <div className={styles.panel}>
                    <PaginationElement
                        pageSize={pageSize}
                        setPageSize={onChangePageSize}
                        totalElements={total}
                        page={page}
                        setPage={onChangePage}
                    />
                </div>
            )}
        </>
    );
};

export default observer(PreviewCards);
