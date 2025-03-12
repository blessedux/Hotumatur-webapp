'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to ensure components re-render when the language changes
 * @returns The current language
 */
export function useLanguageChange() {
    const { i18n } = useTranslation();
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

    useEffect(() => {
        // Log initial language
        console.log('Initial language in hook:', i18n.language);

        // Update state when i18n language changes
        if (currentLanguage !== i18n.language) {
            console.log(`Language changed in hook from ${currentLanguage} to ${i18n.language}`);
            setCurrentLanguage(i18n.language);
        }

        // Force re-render when language changes
        const handleLanguageChange = (lng: string) => {
            console.log(`Language changed event in hook: ${lng}`);
            setCurrentLanguage(lng);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, currentLanguage]);

    return currentLanguage;
} 