import React from 'react';
import { Radio } from '@mantine/core';
import styles from './CustomRadio.module.scss';

type CustomRadioProps = {
  values: any[];
  label?: any;
  value?: any;
  error?: any;
  onChange?: any;
};

const customValue = (value: string) => (
    <div className={styles.customLabel}>
        <div>{value}</div>
        <div className={styles.soon}>Soon</div>
    </div>
);

function CustomRadio({
    values,
    label,
    value,
    onChange,
    error,
    ...rest
}: CustomRadioProps) {
    return (
        <Radio.Group
            value={value}
            orientation="vertical"
            onChange={onChange}
            label={label}
            classNames={{
                label: styles.label,
                root: styles.rootWrapperTest,
            }}
            error={error}
            {...rest}
        >
            {values.map((item) => (
                <Radio
                    key={item.value}
                    value={item.value}
                    label={item.disabled ? customValue(item.label) : item.label}
                    classNames={{
                        labelWrapper: styles.labelWrapper,
                        radio: styles.radio,
                        icon: styles.icon,
                    }}
                    disabled={item.disabled}
                />
            ))}
        </Radio.Group>
    );
}

export default CustomRadio;
