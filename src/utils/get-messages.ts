import en from '@/messages/en.json';
import es from '@/messages/es.json';

const messages: Record<string, Record<string, string>> = {
    en,
    es
};

export function getMessages(locale: string) {
    return messages[locale] || messages['es']; // Fallback to Spanish
}