import React from 'react';
import styles from 'styles/General.module.scss';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => (
    <div className={styles.authContainer}>{children}</div>
);

export default Layout;
