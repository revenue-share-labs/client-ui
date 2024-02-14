import React, { useState } from 'react';
import CustomSelect from 'components/common/select/CustomSelect';
import arrowImg from 'public/icons/arrowRight.svg';

import { useForm } from '@mantine/form';
import { TypeItem } from 'components/common/select/customItems/TypeItem';
import CustomButton from 'components/common/button/CustomButton';
import { CustomInput } from 'components/common/input/CustomInput';
import { useRouter } from 'next/router';
import WizardLayout from 'layouts/wizard';
import { ContractStatusType } from 'types/common/ContractStatusType';
import Image from 'next/image';
import { isValidString } from 'utils/string';
import { Properties, Property } from 'csstype';
import { TITLE_ERROR } from 'utils/validationMessages';
import ContractNew from '../contract/form/ContractNew';
import { getWizardInitialState } from './initialState';
import styles from './Wizard.module.scss';
import BackIcon from '../common/icons/BackIcon';
import BoxSizing = Property.BoxSizing;

type BoxStyles = Properties<string | number> & { boxSizing?: BoxSizing };

const inputStyles: BoxStyles = {
    width: '439px',
    height: '68px',
    paddingTop: '8px',
    boxSizing: 'border-box',
};

const primaryBtnStyles = { width: '218px', height: '56px' };
const backBtnStyles = { width: ' 100px', height: '56px' };

const types = [
    { value: 'VALVE', label: 'Valve' },
    { value: 'PREPAYMENT', label: 'Prepayment', disabled: true },
    { value: 'WATERFALL', label: 'Waterfall', disabled: true },
];

const methods = [
    { value: 'scratch', label: 'From Scratch' },
    {
        value: 'which duplicates content',
        label: 'Which duplicates content',
        disabled: true,
    },
];
const tools = [
    { value: 'editor', label: 'Form Editor' },
    {
        value: 'import .xls/xlsx',
        label: 'Import .xls/xlsx',
        disabled: true,
    },
    { value: 'node Editor', label: 'Node Editor', disabled: true },
];

function Wizard() {
    const router = useRouter();
    const form = useForm(getWizardInitialState());

    const [step, setStep] = useState(1);
    const [contractObj, setContactObj] = useState<any>();

    const onChangeName = (e: any) => {
        const title = e.target.value;
        const fieldName = 'name';
        form.setFieldValue(fieldName, title);

        if (!isValidString(title)) {
            form.setFieldError(fieldName, TITLE_ERROR);
        }
    };

    const createContract = () => {
        const { hasErrors } = form.validate();
        if (hasErrors) {
            return;
        }

        const { values } = form;
        if (values.creationTool === 'editor') {
            setContactObj({
                title: values.name,
                type: values.type,
                status: ContractStatusType.DRAFT,
                visualizationUrl: values.visualizationUrl,
                legalAgreementUrl: values.legalAgreementUrl,
            });
            setStep(2);
        }
    };

    const back = () => {
        router.back();
    };

    const onKeyPress = (e: any) => {
        if (e.code === 'Enter') {
            createContract();
        }
    };

    const type = (
        <CustomSelect
            data={types}
            placeholder="Choose type"
            error={form.errors.type}
            customItem={TypeItem}
            onChange={(value) => form.setFieldValue('type', value)}
            value={form.getInputProps('type').value}
        />
    );

    const creationMethod = (
        <CustomSelect
            data={methods}
            placeholder="Choose method"
            customItem={TypeItem}
            onChange={(value) => form.setFieldValue('creationMethod', value)}
            value={form.getInputProps('creationMethod').value}
            error={form.errors.creationMethod}
        />
    );

    const contract = (
        <>
            <div className={styles.text}>using</div>
            <CustomSelect
                data={[]}
                placeholder="Choose Contract"
                searchable
                onChange={(value) => form.setFieldValue('contract', value)}
                value={form.getInputProps('contract').value}
                error={form.errors.contract}
            />
        </>
    );

    const creationTool = (
        <CustomSelect
            data={tools}
            placeholder="Choose Tool"
            customItem={TypeItem}
            onChange={(value) => form.setFieldValue('creationTool', value)}
            value={form.getInputProps('creationTool').value}
            error={form.errors.creationTool}
        />
    );

    if (step === 2) {
        return (
            <WizardLayout step={step}>
                <ContractNew contract={contractObj} setStep={setStep} />
            </WizardLayout>
        );
    }

    return (
        <div className={styles.container}>
            <CustomButton
                name="Back"
                variant="ghost"
                color="black"
                style={backBtnStyles}
                leftIcon={<BackIcon width="16" height="15" />}
                onClick={back}
            />

            <div className={styles.wizard}>
                <div className={styles.title}>
                    The first step.&nbsp;
                    <span className={styles.titleGrey}>Basic settings.</span>
                </div>
                <div className={styles.subtitle}>
                    This is your first step of creating a contract. Here you can choose
                    <span className={styles.bold}>&nbsp;the way you will work</span>
                    {' '}
                    with
                    the system.
                </div>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <form className={styles.form} onKeyPress={onKeyPress}>
                    <div className={styles.line}>
                        <div className={styles.text}>I want to create</div>
                        {type}
                        <div className={styles.text}>contract, named</div>
                        <CustomInput
                            style={inputStyles}
                            placeholder="Enter contract name"
                            onChange={onChangeName}
                            value={form.getInputProps('name').value}
                            maxLength={100}
                            error={form.errors.name as string | undefined}
                        />
                    </div>

                    <div className={styles.line}>
                        {creationMethod}

                        {form.getInputProps('creationMethod').value
                            === 'which duplicates content' && contract}

                        <div className={styles.text}>using</div>
                        {creationTool}
                        <div className={styles.text}>in the next step</div>
                    </div>
                </form>
                <CustomButton
                    name="Let’s make money"
                    color="blue"
                    style={primaryBtnStyles}
                    rightIcon={<Image src={arrowImg.src} alt="arrow icon" height={15.5} width={16.62} />}
                    onClick={createContract}
                />

            </div>
        </div>
    );
}

export default Wizard;
