import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import DefaultLayout from 'layouts/defaultLayout';

import errorImg from 'public/images/errors/503.svg';
import CustomButton from 'components/common/button/CustomButton';
import Image from 'next/image';
import styles from './index.module.scss';

const btnStyles = {
    width: '300px',
    height: '56px',
    marginTop: '80px',
};

const Error503: React.FC = () => (
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
                <div className={styles.title}>All of our servers are busy</div>
                <div className={styles.subtitle}>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    We cannot handle your request right now, please wait for a couple of
                    minutes and refresh the page. Our team is already working on this
                    issue.
                </div>
            </div>

            <CustomButton color="blue" name="Refresh Page" style={btnStyles} />
        </div>
    </div>
);
(Error503 as PageWithLayoutType).layout = DefaultLayout;

export default Error503;
