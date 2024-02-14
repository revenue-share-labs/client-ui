import { fieldRequired, validateTitle } from 'utils/form';

export function getWizardInitialState() {
    const initialValues = {
        type: 'VALVE',
        name: '',
        creationMethod: 'scratch',
        contract: '',
        creationTool: 'editor',
        visualizationUrl: '',
        legalAgreementUrl: null,
    };

    return {
        initialValues,
        validate: {
            type: fieldRequired,
            name: validateTitle,
            creationMethod: fieldRequired,
            // contract: '',
            creationTool: fieldRequired,
        },
    };
}
