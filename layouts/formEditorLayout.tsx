import React, { useEffect, useState } from 'react';

import { useAuthStore } from 'stores/AuthStore';

import SideMenu from 'components/sidemenu';

import styles from 'styles/General.module.scss';

type LayoutProps = {
  children: React.ReactNode;
};

const FormEditorLayout: React.FunctionComponent<LayoutProps> = ({
    children,
}) => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const authStore = useAuthStore();

    useEffect(() => {
        if (authStore.isAuthenticated) {
            setAuthenticated(!isAuthenticated);
        }
    }, [authStore.isAuthenticated]);

    return (
        <div className={`${styles.generalContainer} ${styles.formEditorContainer}`}>
            {isAuthenticated && (
                <div className={styles.leftBlock}>
                    <SideMenu />
                </div>
            )}
            <div className={styles.rightBlock}>
                <div className={styles.contentBlock}>{children}</div>
            </div>
        </div>
    );
};

export default FormEditorLayout;
