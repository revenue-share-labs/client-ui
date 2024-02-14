import React from 'react';
import Image from 'next/image';
import styles from './Error404.module.scss';
import errorImg from '../../public/images/errors/404.svg';
import CustomButton from '../common/button/CustomButton';

const btnStyles = {
    width: '300px',
    height: '56px',
    marginTop: '80px',
};

function Error404() {
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
                    <div className={styles.title}>Oops! You’ve found a secret place</div>
                    <div className={styles.subtitle}>
                        Page you are trying to open does not exist. You may have mistyped
                        the address, or the page has been moved to another URL. If you think
                        this is an error contact support.
                    </div>
                </div>

                <CustomButton
                    color="blue"
                    name="Take me back to home page"
                    style={btnStyles}
                />
            </div>
        </div>
    );
}

export default Error404;
