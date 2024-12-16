import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';

export function validatePhoneNumber(phoneNumber: string, country: CountryCode = 'CL') {
    try {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber, country);
        if (parsedNumber && parsedNumber.isValid()) {
            return {
                isValid: true,
                formatted: parsedNumber.formatInternational(),
            };
        }
        return { isValid: false, formatted: null };
    } catch {
        return { isValid: false, formatted: null };
    }
}
