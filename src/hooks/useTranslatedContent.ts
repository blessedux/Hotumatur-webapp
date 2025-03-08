import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationService } from '@/services/translation.service';

export function useTranslatedContent(content: string) {
    const { i18n } = useTranslation();
    const [translatedContent, setTranslatedContent] = useState(content);

    useEffect(() => {
        async function translateContent() {
            if (i18n.language !== 'es') {
                const translated = await TranslationService.translateText(content, i18n.language);
                setTranslatedContent(translated);
            } else {
                setTranslatedContent(content);
            }
        }

        translateContent();
    }, [content, i18n.language]);

    return translatedContent;
} 