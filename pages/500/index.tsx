import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import DefaultLayout from 'layouts/defaultLayout';

import errorImg from 'public/images/errors/500.svg';
import CustomButton from 'components/common/button/CustomButton';
import Image from 'next/image';
import styles from './index.module.scss';

const btnStyles = {
    width: '300px',
    height: '56px',
    marginTop: '80px',
};

const Error500: React.FC = () => (
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
                <div className={styles.title}>Something bad just happened...</div>
                <div className={styles.subtitle}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Our servers could not handle your request. Don't worry, our
                    development team was already notified. Try refreshing the page.
                </div>
            </div>

            <CustomButton color="blue" name="Refresh Page" style={btnStyles} />
        </div>
    </div>
);
(Error500 as PageWithLayoutType).layout = DefaultLayout;

export default Error500;
