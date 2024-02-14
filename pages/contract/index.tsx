import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import DefaultLayout from 'layouts/defaultLayout';
import Wizard from '../../components/wizard';
import { useWalletConnected } from '../../utils/hooks/useWalletConnected';

const NewContract: React.FC = () => {
    useWalletConnected();

    return <Wizard />;
};

(NewContract as PageWithLayoutType).layout = DefaultLayout;

export default NewContract;
