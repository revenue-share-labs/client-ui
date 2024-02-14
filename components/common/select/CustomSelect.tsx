import React from 'react';
import { Select } from '@mantine/core';
import chevronImg from 'public/icons/chevron-down-circle.svg';
import warningImg from 'public/icons/warning.svg';
import Image from 'next/image';
import styles from './CustomSelect.module.scss';

type SelectProps = {
  label?: string;
  data: any[];
  value?: string;
  placeholder?: string;
  onChange?: (option: string) => void;
  error?: any;
  customItem?: any;
  searchable?: boolean;
  icon?: any;
  size?: string;
  style?: any;
  iconLeft?: JSX.Element;
  newClassnames?: Record<string, string>;
  defaultValue?: string;
};

const nothingFound = 'Search has no results';

function CustomSelect(props: SelectProps) {
    const {
        label,
        data,
        value,
        size,
        icon,
        onChange,
        placeholder,
        error,
        customItem,
        searchable,
        style,
        newClassnames,
        iconLeft,
        defaultValue,
        ...rest
    } = props;

    const inputStyles = error
        ? `${styles.input} ${styles.errorInput}`
        : styles.input;

    const chevronDown = (
        <Image
            src={chevronImg.src}
            alt="Chevron down"
            width={24}
            height={24}
        />
    );
    const warning = (
        <Image
            src={warningImg.src}
            alt="Warning"
            height={17.83}
            width={18.9}
        />
    );

    const errorDiv = (
        <div className={styles.icons}>
            {warning}
            {chevronDown}
        </div>
    );

    const rightSection = icon || (error ? errorDiv : chevronDown);

    const classNames = {
        root: size ? styles[['root', size].join('_')] : styles.root,
        wrapper: styles.wrapper,
        dropdown: styles.dropdown,
        input: inputStyles,
        item: styles.item,
        itemsWrapper: styles.itemsWrapper,
        error: styles.error,
        rightSection: error && styles.rightSection,
        nothingFound: styles.nothingFound,
        label: styles.label,
        ...newClassnames,
    };

    return (
        <Select
            placeholder={placeholder}
            data={data}
            error={error}
            label={label}
            rightSection={rightSection}
            icon={iconLeft}
            searchable={searchable}
            nothingFound={nothingFound}
            classNames={classNames}
            style={style}
            value={value}
            onChange={onChange}
            itemComponent={customItem}
            defaultValue={defaultValue}
            styles={{ rightSection: { pointerEvents: 'none' } }}
            {...rest}
        />
    );
}

export default CustomSelect;
