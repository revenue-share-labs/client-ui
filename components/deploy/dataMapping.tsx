export const toValveContract = (
    address: string,
    isAutoNativeCurrencyDistribution: boolean,
    recipients: any[],
    isImmutableRecipients: boolean,
) => {
    return {
        controller: `${address}`,
        isImmutableRecipients,
        isAutoNativeCurrencyDistribution,
        minAutoDistributeAmountInEthers: '0.001',
        distributors: [`${address}`],
        recipients,
        creationId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    };
};
