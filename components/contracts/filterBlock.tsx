import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import FilterArea from 'components/common/filterArea';
import {
    ORDER_VALUES_COMMUNITY,
    ORDER_VALUES_DRAFTS,
    ORDER_VALUES_PUBLISHED,
    SORT_BY_VALUES_COMMUNITY,
    SORT_BY_VALUES_DRAFTS,
    SORT_BY_VALUES_PUBLISHED,
} from 'constants/sortParam';
import { useSearchStore } from 'stores/SearchStore';
import Sort from '../sort';
import styles from './filterBlock.module.scss';

type FilterBlockProps = {
    setIsPrepareSearchParams: (value: boolean) => void;
};

export const FilterBlock = ({
    setIsPrepareSearchParams,
}: FilterBlockProps) => {
    const searchStore = useSearchStore();

    const { query } = useRouter();

    const [sortBy, setSortBy] = useState(query.status === 'drafts'
        ? SORT_BY_VALUES_DRAFTS[2].name : SORT_BY_VALUES_PUBLISHED[2]);
    const [order, setOrder] = useState('desc');
    const router = useRouter();

    useEffect(() => {
        setSortBy(query.status === 'drafts' ? SORT_BY_VALUES_DRAFTS[2] : SORT_BY_VALUES_PUBLISHED[2]);
        setOrder('desc');
    }, [router, router.query]);

    const getSortByValues = () => {
        if (searchStore.isMy) {
            return searchStore.isDraft ? SORT_BY_VALUES_DRAFTS : SORT_BY_VALUES_PUBLISHED;
        }

        return SORT_BY_VALUES_COMMUNITY;
    };

    const getOrderValues = () => {
        if (searchStore.isMy) {
            return searchStore.isDraft ? ORDER_VALUES_DRAFTS : ORDER_VALUES_PUBLISHED;
        }

        return ORDER_VALUES_COMMUNITY;
    };

    return (
        <div className={styles.filterContainer}>
            <FilterArea
                setIsPrepareSearchParams={setIsPrepareSearchParams}
            />
            <div className={styles.sortBy}>
                <span>
                    <Sort
                        sort={
                            {
                                sortBy,
                                setSortBy,
                                order,
                                setOrder,
                            }
                        }
                        sortByValues={getSortByValues()}
                        orderValues={getOrderValues()}
                        setIsPrepareSearchParams={setIsPrepareSearchParams}
                    />
                </span>
            </div>
        </div>
    );
};
