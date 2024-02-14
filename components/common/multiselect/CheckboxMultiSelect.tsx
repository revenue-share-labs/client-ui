import React from 'react';
import ReactSelect, { components, OptionProps, StylesConfig } from 'react-select';
import { Checkbox } from '@mantine/core';
import { MultiSelectItem } from 'types/common/MultiSelectItem';
import styles from './CheckboxMultiSelect.module.scss';

type CheckboxMultiSelectProps = {
  options: MultiSelectItem[];
  onChange: (value: any) => void;
  optionsSelected: MultiSelectItem[];
};

function Option(props: OptionProps) {
    return (
        <div>
            <components.Option {...props}>
                <Checkbox
                    checked={props.isSelected}
                    classNames={{
                        input: styles.input,
                        label: styles.label,
                        body: styles.body,
                        icon: props.isSelected ? styles.icon : '',
                    }}
                    onChange={() => null}
                    label={props.label}
                />
            </components.Option>
        </div>
    );
}

const selectStyles: StylesConfig<any, true> = {
    control: (styles) => ({
        ...styles,
        backgroundColor: '#2E2E2E',
        width: '420px',
        border: 'none',
        borderRadius: '12px',
        ':hover': {
            borderColor: '#2E2E2E',
        },
        ':active': {
            borderColor: '#2E2E2E',
        },
        ':focus': {
            borderColor: '#2E2E2E',
        },
    }),
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: '#3E3E3E',
        borderRadius: '6px',
        height: '24px',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: '#fff',
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        ':hover': {
            backgroundColor: '#3E3E3E',
        },
    }),
    indicatorsContainer: (styles) => ({
        ...styles,
        '& span': {
            display: 'none',
        },
        '& div svg': {
            backgroundColor: '#fff',
            borderRadius: '10px',
            color: '#3E3E3E',
            width: '19.5px',
            height: '19.5px',
        },
    }),

    menu: (styles) => ({
        ...styles,
        background: '#2E2E2E',
        boxShadow: '0px 70px 100px rgba(0, 0, 0, 0.3)',
        borderRadius: '16px',
    }),
    menuList: (styles) => ({
        ...styles,
        paddingTop: '12px',
        borderRadius: '16px',
    }),

    option: (styles) => ({
        ...styles,
        backgroundColor: '#2E2E2E',
        ':hover': {
            backgroundColor: '#3E4FEA',
        },
    }),
};

function CheckboxMultiSelect({
    options,
    onChange,
    optionsSelected,
}: CheckboxMultiSelectProps) {
    return (
        <ReactSelect
            options={options}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            isClearable={false}
            components={{
                Option,
            }}
            placeholder="Select contract type"
            styles={selectStyles}
            onChange={onChange}
            value={optionsSelected}
        />
    );
}

export default CheckboxMultiSelect;
