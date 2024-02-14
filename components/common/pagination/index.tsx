import React from 'react';
import { Pagination } from '@mantine/core';
import Image from 'next/image';
import chevronDown from 'public/icons/chevron-down.svg';
import CustomSelect from 'components/common/select/CustomSelect';
import styles from './PagitationElement.module.scss';

type ElementPaginationProps = {
  totalElements: number;
  pageSize: number;
  setPageSize: (value: number) => void;
  page: number;
  setPage: (value: number) => void;
};

const options = [
    { value: '10', label: ' 10 / page' },
    { value: '20', label: ' 20 / page' },
    { value: '30', label: ' 30 / page' },
    { value: '40', label: ' 40 / page' },
    { value: '50', label: ' 50 / page' },
];

function PaginationElement({
    totalElements,
    pageSize,
    setPageSize,
    page,
    setPage,
}: ElementPaginationProps) {
    const pageCount = Math.ceil(totalElements / pageSize);

    return (
        <div className={styles.pagination}>
            <div className={styles.left}>
                <Pagination
                    page={page}
                    onChange={setPage}
                    total={pageCount}
                    classNames={{
                        item: styles.element,
                    }}
                    siblings={1}
                />
                <div className={styles.pageSize}>
                    <CustomSelect
                        data={options}
                        value={pageSize.toString()}
                        icon={<Image src={chevronDown.src} alt="" width={20} height={20} />}
                        size="sm"
                        onChange={(value) => setPageSize(+value)}
                    />
                </div>
            </div>
            <div className={styles.total}>
                {totalElements}
                {' '}
                total
            </div>
        </div>
    );
}

export default PaginationElement;
