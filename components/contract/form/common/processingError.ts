import { FormErrors } from '@mantine/form';

export const handleSubmitError = async (errors: FormErrors, refs: any) => {
    const keys = Object.keys(errors);
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        let ref;
        switch (key) {
        case 'title':
            ref = refs.title;
            break;
        case 'progressPercent':
        case 'recipients':
            ref = refs.recipients;
            break;
        case 'chain':
        case 'currencies':
            ref = refs.settings;
            break;
        case 'controller':
            ref = refs.mutabilityRecipients;
            break;
        default:
            break;
        }
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
};
