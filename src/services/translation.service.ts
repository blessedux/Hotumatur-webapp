import axios from 'axios';

export class TranslationService {
    private static readonly API_KEY = process.env.TRANSLATION_API_KEY;
    private static readonly API_URL = 'https://translation-service.com/api';

    static async translateText(text: string, targetLang: string): Promise<string> {
        try {
            const response = await axios.post(`${this.API_URL}/translate`, {
                text,
                target_lang: targetLang,
                api_key: this.API_KEY
            });
            return response.data.translated_text;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    }
} 