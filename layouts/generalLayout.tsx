import React from 'react';

import styles from 'styles/General.module.scss';
import SideMenu from 'components/sidemenu';
import { Header } from 'components/header';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => (
    <div className={styles.generalContainer}>
        <div className={styles.leftBlock}>
            <SideMenu />
        </div>
        <div className={styles.rightBlock}>
            <div className={styles.headerBlock}>
                <Header />
            </div>
            <div className={styles.contentBlock}>{children}</div>
        </div>
    </div>
);

export default Layout;
