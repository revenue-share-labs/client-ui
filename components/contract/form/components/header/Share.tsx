import React from 'react';
import Image from 'next/image';
import CustomButton from 'components/common/button/CustomButton';
import shareSocialImg from 'public/icons/share-social.svg';

const Share = () => {
    return (
        <CustomButton
            name="Share"
            variant="ghost"
            color="white"
            radius={10}
            style={{ width: '85px', height: '32px', fontSize: '14px' }}
            rightIcon={(
                <Image
                    src={shareSocialImg.src}
                    width={16}
                    height={16}
                    alt="Share icon"
                />
            )}
        />
    );
};

export default Share;
