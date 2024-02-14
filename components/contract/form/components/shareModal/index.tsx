import React, { useState } from 'react';
import Image from 'next/image';
import CustomButton from 'components/common/button/CustomButton';
import shareSocialImg from 'public/icons/share-social.svg';
import CustomModal from 'components/common/modal/CustomModal';

import { ContractDto } from 'types/contract/ContractDto';
import { ShareContent } from './shareContent';

type ShareProps = {
    contract?: ContractDto;
    setContract?: (value: ContractDto) => void;
};

const Share = ({ contract, setContract }: ShareProps) => {
    const [isShareModalOpen, setShareModalOpen] = useState(false);

    return (
        <>
            <CustomButton
                name="Share"
                variant="ghost"
                color="white"
                radius={10}
                style={{ width: '85px', height: '32px', fontSize: '14px' }}
                onClick={() => setShareModalOpen(true)}
                leftIcon={(
                    <Image
                        src={shareSocialImg.src}
                        width={16}
                        height={16}
                        alt="Share icon"
                    />
                )}
            />
            <CustomModal
                iconClose
                isOpen={isShareModalOpen}
                onClose={() => setShareModalOpen(false)}
                cancelBtn={false}
                confirmBtnLabel=""
                title="Share"
            >
                <ShareContent contract={contract} setContract={setContract} />
            </CustomModal>
        </>
    );
};

export default Share;
