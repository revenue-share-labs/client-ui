import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import DefaultLayout from 'layouts/defaultLayout';
import { useRouter } from 'next/router';

import errorImg from 'public/images/errors/404.svg';
import CustomButton from 'components/common/button/CustomButton';
import Image from 'next/image';
import styles from './index.module.scss';

const btnStyles = {
    width: '300px',
    height: '56px',
    marginTop: '80px',
};

const Error403: React.FC = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.block}>
                <Image
                    src={errorImg.src}
                    className={styles.img}
                    alt="Error image"
                    width={312}
                    height={124}
                />
                <div>
                    <div className={styles.title}>
                        Sorry! You couldn&apos;t see this page
                        {' '}
                    </div>
                    <div className={styles.subtitle}>
                        Page you are trying to open require an authentification. To see this
                        page please Log In or Sign Up.
                    </div>
                </div>

                <CustomButton
                    color="blue"
                    name="Take me back to home page"
                    style={btnStyles}
                    onClick={() => router.push('/')}
                />
            </div>
        </div>
    );
};
(Error403 as PageWithLayoutType).layout = DefaultLayout;

export default Error403;
