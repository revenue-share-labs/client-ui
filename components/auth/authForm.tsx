import React from 'react';
import dynamic from 'next/dynamic';
import styles from './login.module.scss';

const DynamicComponent1 = dynamic(() => import('./loginWidget'), {
    loading: () => <div style={{ marginLeft: '50px', marginTop: '50px', marginBottom: '50px' }}>Loading ...</div>,
    ssr: false,
});

export function AuthForm() {
    return (
        <div className={styles.form}>
            <DynamicComponent1 />
        </div>
    );
}
