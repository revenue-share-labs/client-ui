import React, { useCallback, useRef } from 'react';
import { Widget } from '@xsolla/login-sdk';
import styles from './login.module.scss';

const xl = new Widget({
    projectId: process.env.NEXT_PUBLIC_LOGIN_WIDEGT || '',
    preferredLocale: 'en_US',
});

function useHookWithRefCallback() {
    const ref = useRef(null);
    const setRef = useCallback((node: any) => {
        if (ref.current) {
            // Make sure to cleanup any events/references added to the last instance
        }

        if (node) {
            // Check if a node is actually passed. Otherwise node would be null.
            // You can now do what you need to, addEventListeners, measure, etc.
            //xl.mount('xl_auth');
        }

        // Save a reference to the node
        ref.current = node;
    }, []);

    return [setRef];
}

export default function Hello1() {
    const [ref] = useHookWithRefCallback();
    return <div id="xl_auth" className={styles.widget} ref={ref} />;
}
