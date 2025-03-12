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
        fallbackLng: 'es', // Default to Spanish if no language is detected
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
            order: ['navigator', 'localStorage', 'htmlTag'], // First check browser language, then localStorage
            caches: ['localStorage'],
        },
        load: 'languageOnly', // Only load language without region (e.g., 'en' instead of 'en-US')
        supportedLngs: ['en', 'es'], // Only allow English and Spanish
        nonExplicitSupportedLngs: true, // Allow partial language matches (e.g., 'en-US' matches 'en')
    });

// Function to detect and set the initial language based on browser settings
const detectAndSetInitialLanguage = () => {
    if (typeof window !== 'undefined') {
        // Get browser language
        const browserLang = navigator.language || (navigator as any).userLanguage;
        console.log('Browser language detected:', browserLang);

        // Check if browser language starts with 'es' (Spanish)
        if (browserLang && browserLang.startsWith('es')) {
            i18n.changeLanguage('es');
            localStorage.setItem('i18nextLng', 'es');
            console.log('Setting initial language to Spanish based on browser settings');
        }
        // Check if browser language starts with 'en' (English)
        else if (browserLang && browserLang.startsWith('en')) {
            i18n.changeLanguage('en');
            localStorage.setItem('i18nextLng', 'en');
            console.log('Setting initial language to English based on browser settings');
        }
        // Default to Spanish for any other language
        else {
            i18n.changeLanguage('es');
            localStorage.setItem('i18nextLng', 'es');
            console.log('Setting initial language to Spanish (default)');
        }
    }
};

// Call the function to detect and set initial language
detectAndSetInitialLanguage();

// Add a listener to log language changes
i18n.on('languageChanged', (lng) => {
    console.log(`i18n language changed to: ${lng}`);

    // Dispatch a custom event when language changes
    if (typeof window !== 'undefined') {
        const event = new CustomEvent('language-changed', {
            detail: {
                language: lng,
                timestamp: new Date().getTime()
            }
        });
        window.dispatchEvent(event);

        // Force a refresh after a short delay to ensure all components update
        setTimeout(() => {
            const refreshEvent = new CustomEvent('language-refresh', {
                detail: { timestamp: new Date().getTime() }
            });
            window.dispatchEvent(refreshEvent);
        }, 100);
    }
});

// Function to change language
export const changeLanguage = (language: string) => {
    if (i18n.language !== language) {
        console.log(`Changing language from ${i18n.language} to ${language}`);

        // Change language in i18next
        i18n.changeLanguage(language)
            .then(() => {
                console.log(`Language successfully changed to ${language}`);
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