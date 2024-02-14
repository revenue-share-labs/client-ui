import { ReactNode } from 'react';
import styles from './NotificationContainer.module.scss';

type NotificationContainerProps = {
  children: ReactNode;
};

export function NotificationContainer({
    children,
}: NotificationContainerProps) {
    return <div className={styles.container}>{children}</div>;
}
