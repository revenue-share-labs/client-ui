import React from 'react';
import { mergeClasses, toUpperCaseFirstLetter } from 'utils/string';
import lockOpen from 'public/icons/lock-open.svg';
import lockClosed from 'public/icons/lock-closed.svg';
import time from 'public/icons/time.svg';
import { TagType } from 'types/common/TagType';
import Image from 'next/image';
import styles from './Tag.module.scss';

type TagProps = {
  name: TagType;
};

function Tag({ name }: TagProps) {
    const title = toUpperCaseFirstLetter(name.toLocaleLowerCase());
    let background;

    if (name === TagType.DRAFT) {
        background = 'orange';
    } else if (name === TagType.PRIVATE || name === TagType.COMMUNITY || name === TagType.PENDING) {
        background = 'white';
    } else if (name === TagType.RECIPIENT || name === TagType.DISTRIBUTOR) {
        background = 'blue';
    } else if (name === TagType.PUBLISHED) {
        background = 'green';
    }

    const classes = mergeClasses(styles.tag, styles[`bg_${background}`]);

    const lockOpenImg = (
        <Image alt="lock open icon" src={lockOpen.src} width={16} height={16} />
    );
    const lockClosedImg = (
        <Image alt="lock close icon" src={lockClosed.src} width={16} height={16} />
    );
    const timeImg = (
        <Image alt="lock close icon" src={time.src} width={16} height={16} className={styles.svgBlack} />
    );

    if (name === TagType.COMMUNITY || name === TagType.PRIVATE || name === TagType.PENDING) {
        return (
            <div className={`${styles.title} ${classes}`}>
                {title}
                {name === TagType.COMMUNITY && lockOpenImg}
                {name === TagType.PRIVATE && lockClosedImg}
                {name === TagType.PENDING && timeImg}
            </div>
        );
    }

    return <div className={classes}>{title}</div>;
}

export default Tag;
