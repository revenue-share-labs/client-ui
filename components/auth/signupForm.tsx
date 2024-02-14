import React from 'react';
import { Button, PasswordInput, TextInput } from '@mantine/core';
import styles from './login.module.scss';

export function SignUpForm() {
    return (
        <div className={styles.form}>
            {/* <Input.Wrapper id='username' label="Username" >
      <Input id='username' placeholder="Enter username" />
    </Input.Wrapper> */}
            <TextInput
                label="Username"
                placeholder="Enter username"
                classNames={{ label: styles.label, input: styles.input }}
            />

            <div className={styles.pswdContainer}>
                <div className={styles.pswdTitle}>
                    <div>Password</div>
                </div>
                <PasswordInput
                    placeholder="Enter password"
                    classNames={{
                        label: styles.label,
                        input: styles.input,
                        innerInput: styles.innerInput,
                    }}
                />
            </div>

            <div className={styles.pswdContainer}>
                <div className={styles.pswdTitle}>
                    <div>Confirm Password</div>
                </div>
                <PasswordInput
                    placeholder="Enter password"
                    classNames={{
                        label: styles.label,
                        input: styles.input,
                        innerInput: styles.innerInput,
                    }}
                />
            </div>

            <Button classNames={{ root: styles.btnLogin }}>Login</Button>
        </div>
    );
}
