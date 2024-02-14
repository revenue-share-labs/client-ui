import React from 'react';
import SideMenu from 'components/sidemenu';
import styles from '../../styles/General.module.scss';

type WizardLayoutProps = {
  step: number;
  children: any;
};

const WizardLayout: React.FunctionComponent<WizardLayoutProps> = ({
    step,
    children,
}) => {
    if (step === 1) {
        return <main>{children}</main>;
    }

    return (
        <div className={`${styles.generalContainer} ${styles.formEditorContainer}`}>
            <div className={styles.leftBlock}>
                <SideMenu />
            </div>
            <div className={styles.rightBlock}>
                <div className={styles.contentBlock}>{children}</div>
            </div>
        </div>
    );
};

export default WizardLayout;
