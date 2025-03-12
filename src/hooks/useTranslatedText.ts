'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Custom hook to get translated text that updates when language changes
 * @param key The translation key
 * @param fallback Fallback text if translation is not found
 * @returns The translated text
 */
export function useTranslatedText(key: string, fallback: string = '') {
    const { t, i18n } = useTranslation();
    const [translatedText, setTranslatedText] = useState<string>('');

    useEffect(() => {
        // Get initial translation
        const text = t(key, fallback);
        setTranslatedText(text);

        // Update when language changes
        const handleLanguageChange = () => {
            const newText = t(key, fallback);
            console.log(`Translation updated for ${key}: ${newText}`);
            setTranslatedText(newText);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [t, i18n, key, fallback]);

    return translatedText || fallback;
}

/**
 * Custom hook to get direct translations based on current language
 * @param enText English text
 * @param esText Spanish text
 * @returns The text in the current language
 */
export function useDirectTranslation(enText: string, esText: string) {
    const { i18n } = useTranslation();
    const [text, setText] = useState<string>(i18n.language === 'en' ? enText : esText);

    useEffect(() => {
        // Update when language changes
        const handleLanguageChange = () => {
            const newText = i18n.language === 'en' ? enText : esText;
            setText(newText);
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, enText, esText]);

    return text;
} 