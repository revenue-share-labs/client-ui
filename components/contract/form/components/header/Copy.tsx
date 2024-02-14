import React from 'react';
import CustomButton from 'components/common/button/CustomButton';
import copyImg from 'public/icons/copy-white.svg';
import Image from 'next/image';

const Copy = () => {
    const copy = () => {
        console.info('copy');
    };

    return (
        <CustomButton
            name="Make a Copy"
            variant="ghost"
            color="white"
            style={{ width: '133px', height: '32px', fontSize: '14px' }}
            radius={10}
            rightIcon={<Image alt="Copy icon" src={copyImg.src} width={16} height={16} />}
            onClick={copy}
        />
    );
};

export default Copy;
