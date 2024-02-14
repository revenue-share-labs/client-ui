import { Button, ButtonProps } from '@mantine/core';
import React from 'react';
import { mergeClasses } from 'utils/string';
import CustomSpinner from 'components/common/spinner';
import styles from './CustomButton.module.scss';

type CustomButtonProps = Omit<
  import('@mantine/utils').PolymorphicComponentProps<'button', ButtonProps>,
  'color' | 'variant'
> & {
  color?: 'blue' | 'black' | 'violet' | 'white' | 'light-blue';
  variant?: 'filled' | 'ghost' | 'outlined' | 'subtle';
  isLoading?: boolean;
};

function CustomButton(props: CustomButtonProps) {
    const {
        color = 'blue',
        variant = 'filled',
        radius = 16,
        isLoading = false,
        ...rest
    } = props;

    const rootClassname = mergeClasses(
        styles.root,
        styles[color],
        isLoading
            ? styles[[color, 'loading'].join('_')]
            : props.disabled && styles[[color, 'disabled'].join('_')],
        styles[[color, variant].join('-')],
    );

    const rightIconStyle = styles[[color, variant, 'rightIcon'].join('_')];
    const leftIconStyle = styles[[color, variant, 'leftIcon'].join('_')];

    return (
        <Button
            classNames={{
                root: rootClassname,
                inner: styles.inner,
                rightIcon: rightIconStyle,
                leftIcon: leftIconStyle,
            }}
            rightIcon={isLoading ? <CustomSpinner /> : props.rightIcon}
            leftIcon={props.leftIcon}
            onClick={props.onClick}
            style={props.style}
            radius={radius}
            disabled={props.disabled}
            {...rest}
        >
            {props.name}
        </Button>
    );
}

export default CustomButton;
