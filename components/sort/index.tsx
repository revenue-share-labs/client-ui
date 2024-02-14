import React, { useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useOnClickOutside } from 'utils/hooks/useOnClickOutside';

import checkImg from 'public/icons/check.svg';
import chevronDown from 'public/icons/chevron-down.svg';
import Image from 'next/image';
import { useSearchStore } from 'stores/SearchStore';
import { useRouter } from 'next/router';
import styles from './Sort.module.scss';
import { SORT_BY_VALUES_DRAFTS, SORT_BY_VALUES_PUBLISHED } from '../../constants/sortParam';

type SortParamsType = {
    sortBy: any;
    setSortBy: (value: any) => void;
    order: string;
    setOrder: (value: string) => void;

};

type SortType = {
    sortByValues: any[];
    orderValues: any;
    sort: SortParamsType;
    setIsPrepareSearchParams: (value: boolean) => void;
};

const selectedImg = (
    <Image src={checkImg.src} width={24} height={24} alt="Selected image" />
);

function Sort({
    sortByValues, orderValues, sort, setIsPrepareSearchParams,
}: SortType) {
    const [isOpen, setOpen] = useState(false);
    const { query } = useRouter();

    const [activeSort, setActiveSort] = useState(query.status === 'drafts'
        ? SORT_BY_VALUES_DRAFTS[2].name : SORT_BY_VALUES_PUBLISHED[2].name);

    const searchStore = useSearchStore();

    const orderOptions = useMemo(
        () => orderValues[sort.sortBy.name],
        [sort],
    );

    const sortRef = useRef<HTMLDivElement | null>(null);
    // Call hook passing in the ref and a function to call on outside click
    useOnClickOutside(sortRef, () => setOpen(false));

    const onClick = async (name: string) => {
        const selectedValue = sortByValues.find((item) => item.name === name);
        sort.setSortBy(selectedValue);
        if (orderValues[name] && orderValues[name][0]) {
            sort.setOrder(orderValues[name][0].name);
        }

        setActiveSort(name);

        const searchAttributes = searchStore.getSearchParams();
        if (name === 'alphabetical') {
            searchAttributes.titleSortOrder = 'asc';
            delete searchAttributes.dateSortOrder;
            delete searchAttributes.epoch;
        }

        if (name === 'created_date') {
            searchAttributes.dateSortOrder = 'desc';
            searchAttributes.epoch = 'CREATED';
            delete searchAttributes.titleSortOrder;
        }

        if (name === 'last_edit') {
            searchAttributes.dateSortOrder = 'desc';
            searchAttributes.epoch = 'UPDATED';
            delete searchAttributes.titleSortOrder;
        }

        if (name === 'published_date') {
            searchAttributes.dateSortOrder = 'desc';
            searchAttributes.epoch = 'PUBLISHED';
            delete searchAttributes.titleSortOrder;
        }

        if (name === 'update_date') {
            searchAttributes.dateSortOrder = 'desc';
            searchAttributes.epoch = 'UPDATED';
            delete searchAttributes.titleSortOrder;
        }

        searchStore.setSearchParams(searchAttributes);
        setOpen(false);
    };

    const onChangeOrder = async (name: string) => {
        sort.setOrder(name);

        const searchAttributes = searchStore.getSearchParams();
        if (activeSort === 'alphabetical') {
            searchAttributes.titleSortOrder = name;
        }

        if (activeSort === 'created_date') {
            searchAttributes.dateSortOrder = name;
            searchAttributes.epoch = 'CREATED';
        }

        if (activeSort === 'last_edit') {
            searchAttributes.dateSortOrder = name;
            searchAttributes.epoch = 'UPDATED';
        }

        if (activeSort === 'update_date') {
            searchAttributes.dateSortOrder = name;
            searchAttributes.epoch = 'UPDATED';
        }

        if (activeSort === 'published_date') {
            searchAttributes.dateSortOrder = name;
            searchAttributes.epoch = 'PUBLISHED';
        }
        searchStore.setSearchParams(searchAttributes);
        setOpen(false);
    };

    const sortBy = async (name: string) => {
        if (sort.sortBy.name !== name) {
            setIsPrepareSearchParams(true);
            onClick(name).then(() => {
                setIsPrepareSearchParams(false);
            });
        }
    };

    const orderBy = async (name: string) => {
        if (sort.order !== name) {
            setIsPrepareSearchParams(true);
            onChangeOrder(name).then(() => {
                setIsPrepareSearchParams(false);
            });
        }
    };

    return (
        <div className={styles.sort}>
            <div className={styles.details} onClick={() => setOpen(!isOpen)}>
                <div className={styles.title}>Sort:</div>
                <div className={styles.sortType}>
                    <div className={styles.label}>{sort.sortBy.label}</div>
                    <Image
                        src={chevronDown.src}
                        width={16}
                        height={16}
                        alt="Chevron down image"
                    />
                </div>
            </div>
            {isOpen && (
                <div className={styles.params} ref={sortRef}>
                    <div className={styles.param}>
                        <div className={styles.name}>Sort by</div>

                        {sortByValues.map((item) => {
                            if (item.name === sort.sortBy.name) {
                                return (
                                    <div
                                        className={styles.option_selected}
                                        key={item.name}
                                        onClick={() => sortBy(item.name)}
                                    >
                                        {item.label}
                                        {selectedImg}
                                    </div>
                                );
                            }
                            return (
                                <div
                                    className={styles.option}
                                    key={item.name}
                                    onClick={() => sortBy(item.name)}
                                >
                                    {item.label}
                                </div>
                            );
                        })}
                    </div>
                    <div className={styles.divider} />
                    <div className={styles.param}>
                        <div className={styles.name}>Order</div>
                        {orderOptions
                            && orderOptions.map((item: any) => {
                                if (item.name === sort.order) {
                                    return (
                                        <div
                                            className={styles.option_selected}
                                            key={item.name}
                                            onClick={() => orderBy(item.name)}
                                        >
                                            <div>{item.label}</div>
                                            {selectedImg}
                                        </div>
                                    );
                                }
                                return (
                                    <div
                                        key={item.name}
                                        className={styles.option}
                                        onClick={() => orderBy(item.name)}
                                    >
                                        {item.label}
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default observer(Sort);
