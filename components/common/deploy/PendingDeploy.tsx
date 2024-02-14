import React from 'react';
import { Loader } from '@mantine/core';
import styles from './PendingDeploy.module.scss';

function PendingDeploy() {
    return (
        <div className={styles.container}>
            <Loader color="rgba(255, 255, 255, 0.7)" size="xs" variant="oval" />
            <div>
                Deploying contract. &nbsp;
                <span> It might take some time...</span>
            </div>
        </div>
    );
}

export default PendingDeploy;
