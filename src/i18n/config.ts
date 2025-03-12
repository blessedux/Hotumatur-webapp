'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslations from './translations/en.json';
import esTranslations from './translations/es.json';

// Initialize i18next
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: enTranslations,
            es: esTranslations
        },
        fallbackLng: 'es',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged',
            bindI18nStore: 'added removed',
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

// Add a listener to log language changes
i18n.on('languageChanged', (lng) => {
    console.log(`i18n language changed to: ${lng}`);
    console.log('Current translations:', i18n.getResourceBundle(lng, 'hero'));
});

// Function to change language
export const changeLanguage = (language: string) => {
    if (i18n.language !== language) {
        console.log(`Changing language from ${i18n.language} to ${language}`);

        // Change language in i18next
        i18n.changeLanguage(language)
            .then(() => {
                console.log(`Language successfully changed to ${language}`);
                console.log('Hero welcome translation:', i18n.t('hero.welcome'));
            })
            .catch((error) => {
                console.error('Error changing language:', error);
            });

        // Store language preference
        if (typeof window !== 'undefined') {
            localStorage.setItem('i18nextLng', language);
        }
    }
};

export default i18n; 