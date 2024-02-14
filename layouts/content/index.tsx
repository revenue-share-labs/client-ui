import { ReactNode } from 'react';
import { mergeClasses } from 'utils/string';
import s from './content.module.scss';

export type ContentProps = {
  children?: ReactNode | ReactNode[] | string | number;
};

export function HomeContent(props: ContentProps) {
    return (
        <div className={mergeClasses(s.root, s.white)}>
            <div className={s.home}>{props.children}</div>
        </div>
    );
}

export function Content(props: ContentProps) {
    return (
        <div className={s.root}>
            <div className={s.content}>{props.children}</div>
        </div>
    );
}
