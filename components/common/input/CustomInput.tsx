import { Input, InputProps as MantineInputProps } from '@mantine/core';
import { mergeClasses } from 'utils/string';
import warningImg from 'public/icons/warning.svg';
import React from 'react';
import Image from 'next/image';
import styles from './CustomInput.module.scss';

type CustomInputProps = import('@mantine/utils').PolymorphicComponentProps<
  'input',
  MantineInputProps
> & {
  error?: string;
  hideErrorMargin?: boolean;
  description?: string;
  label?: string;
  notStyle?: boolean;
  onChange?: any;
  labelError?: boolean;
  refs?: any;
};

export function CustomInput(props: CustomInputProps) {
    const {
        hideErrorMargin,
        error,
        style = {},
        description = '',
        label = '',
        radius = 'md',
        onChange,
        notStyle,
        readOnly,
        rightSection,
        labelError = true,
        refs,
        ...rest
    } = props;
    const wrapperClass = mergeClasses(
        !error && !hideErrorMargin ? 'errorPlaceholder' : '',
    );

    const warning = (
        <Image
            src={warningImg.src}
            alt="Warning"
            height={17.83}
            width={18.9}
        />
    );

    let inputStyles;
    if (notStyle) {
        if (error) {
            inputStyles = styles.none_style_error;
        } else {
            inputStyles = (readOnly ? styles.none_style : `${styles.none_style} ${styles.none_style_focused}`);
        }
    } else {
        inputStyles = error ? styles.errorInput : styles.input;
    }

    let rightSectionDiv;

    if (error && rightSection) {
        rightSectionDiv = (
            <div className={styles.rightSectionWithWarning}>
                {warning}
                {rightSection}
            </div>
        );
    } else if (error) {
        rightSectionDiv = warning;
    } else if (rightSection) {
        rightSectionDiv = rightSection;
    }

    return (
        <Input.Wrapper
            error={labelError && error}
            className={wrapperClass}
            style={style}
            description={description}
            classNames={{
                root: styles.root,
                error: styles.error,
                label: styles.label,
            }}
            label={label}
            inputWrapperOrder={['label', 'input', 'error']}
        >
            <Input
                radius={radius}
                invalid={!!error}
                rightSection={rightSectionDiv}
                classNames={{
                    input: inputStyles,
                    rightSection: rightSection ? styles.rightSection : '',
                }}
                autoComplete="off"
                onChange={onChange}
                ref={refs}
                {...rest}
            />
        </Input.Wrapper>
    );
}

CustomInput.defaultProps = {
    error: '',
    hideErrorMargin: false,
};
