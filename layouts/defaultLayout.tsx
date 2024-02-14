import { ReactNode } from 'react';

export type DefaultLayoutProps = {
  children?: ReactNode | ReactNode[];
};

function DefaultLayout(props: DefaultLayoutProps) {
    return <main>{props.children}</main>;
}

export default DefaultLayout;
