import React from 'react';
import { Switch, SwitchProps } from '@mantine/core';
import styles from './CustomSwitch.module.scss';

type CustomSwitchProps = import('@mantine/utils').PolymorphicComponentProps<
    'switch',
    SwitchProps
    > & {
    label?: string;
};

const CustomSwitch = (props: CustomSwitchProps) => {
    const {
        style = {},
        size = 'lg',
        ...rest
    } = props;

    return (
        <Switch
            style={style}
            size={size}
            classNames={{
                track: styles.switch_track,
                input: styles.switch_input,
            }}
            {...rest}
        />
    );
};

export default CustomSwitch;
