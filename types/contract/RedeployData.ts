import { Recipient } from './Recipient';

export type RedeployData = {
    controller?: string,
    // TODO: change to Recipient[], but need to change EditForm.ts
    recipients?: any,
    immutableController?: boolean,
    isRecipientsLocked?: boolean
}
