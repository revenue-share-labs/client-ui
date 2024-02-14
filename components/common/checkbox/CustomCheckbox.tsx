import React from 'react';
import { Checkbox } from '@mantine/core';
import styles from './CustomCheckbox.module.scss';

type CustomCheckboxProps = {
  label?: string;
  checked: boolean;
  style?: any;
  onChange?: any;
  disabled?: boolean
};

function CustomCheckbox({
    label,
    checked,
    style,
    onChange,
    disabled,
}: CustomCheckboxProps) {
    return (
        <Checkbox
            checked={checked}
            label={label}
            style={style}
            onChange={(event: any) => onChange(event.currentTarget.checked)}
            classNames={{
                input: styles.input,
                label: styles.label,
                body: styles.body,
                icon: checked ? styles.icon : '',
            }}
            disabled={disabled}
        />
    );
}

export default CustomCheckbox;
