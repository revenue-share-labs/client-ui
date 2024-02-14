import React from 'react';
import { Progress } from '@mantine/core';
import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  value: number;
  error?: string;
};

function ProgressBar({ value, error }: ProgressBarProps) {
    const isMore100 = value > 100;
    let valueStyles;

    if (value === 100) {
        valueStyles = styles.progressBar_equal_100;
    } else {
        valueStyles = isMore100
            ? styles.progressBar_more_100
            : styles.progressBar_less_100;
    }

    const remaining = isMore100 ? 0 : +(100 - value).toFixed(5);

    return (
        <div className={styles.progress}>
            <Progress
                value={value}
                style={{ height: '6px', backgroundColor: '#2E2E2E' }}
                classNames={{
                    bar: valueStyles,
                }}
            />
            <div className={`${styles.details}`}>
                <div className={isMore100 ? styles.font_red : ''}>
                    {`${value}%`}
                    {' '}
                    Allocated
                </div>
                <div>
                    {`${remaining}%`}
                    {' '}
                    Remaining
                </div>
            </div>
            <div className={styles.error}>
                {' '}
                {isMore100 ? 'Shares must add up to 100%' : error}
            </div>
        </div>
    );
}

export default ProgressBar;
