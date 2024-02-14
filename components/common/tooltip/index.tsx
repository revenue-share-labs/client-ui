import React from 'react';
import { Tooltip } from '@mantine/core';
import styles from './CustomTooltip.module.scss';

type CustomTooltipProps = {
  text: string;
  btn: any;
};

function CustomTooltip({ text, btn }: CustomTooltipProps) {
    return (
        <Tooltip
            label={text}
            withArrow
            arrowSize={8}
            multiline
            classNames={{
                tooltip: styles.tooltip,
            }}
        >
            {btn}
        </Tooltip>
    );
}

export default CustomTooltip;
