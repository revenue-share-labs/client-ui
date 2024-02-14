import React from 'react';
import PageWithLayoutType from 'types/layoutPages';
import FormEditorLayout from 'layouts/formEditorLayout';
import { NextPage } from 'next';
import ContractEdit from '../../components/contract/form/ContractEdit/ContractEdit';

const EditContract: NextPage = () => {
    return <ContractEdit />;
};

(EditContract as PageWithLayoutType).layout = FormEditorLayout;

export default EditContract;
