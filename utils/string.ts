export function mergeClasses(...cls: any[]): string {
    return cls.filter((c) => !!c && typeof c === 'string').join(' ');
}

export const truncateFromMiddle = (
    value: string,
    strLength = 13,
    middleStr = '...',
) => {
    if (!value || value.length <= strLength) return value;
    const charsToShow = strLength - middleStr.length;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
        value.substring(0, frontChars)
    + middleStr
    + value.substring(value.length - backChars)
    );
};

export function toUpperCaseFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function removeSpecialSymbols(value: string): string {
    return value.replace(/[^0-9.]/g, '');
}

export function truncateToFiveDecimalPlaces(value: string) {
    if (Number.isInteger(Number(value))) return value;

    // Split the string into integer and decimal parts
    const [integerPart, decimalPart] = value.split('.');

    // Truncate the decimal part to 5 decimal places
    const truncatedDecimalPart = decimalPart ? decimalPart.slice(0, 5) : '';

    // Combine the integer and truncated decimal parts
    return `${integerPart}.${truncatedDecimalPart}`;
}

export function isValidString(value: string) {
    // Regular expression to match Latin letters, special symbols, and numbers
    const regex = /^[A-Za-z0-9 !"#$%&'()*+,-./:;<=>?№±§@[\]^_`{|}~]*$/;
    return regex.test(value);
}
