import { translate } from '@vitalets/google-translate-api';

// Cache for translations to avoid repeated API calls
const translationCache: Record<string, string> = {};

// Add retry mechanism for translation
let retryCount = 0;
const MAX_RETRIES = 2;
const RETRY_DELAY = 500; // 0.5 seconds

// Load cached translations from localStorage if available
if (typeof window !== 'undefined') {
    try {
        const cachedTranslations = localStorage.getItem('translationCache');
        if (cachedTranslations) {
            Object.assign(translationCache, JSON.parse(cachedTranslations));
            console.log(`Loaded ${Object.keys(translationCache).length} cached translations from localStorage`);
        }
    } catch (error) {
        console.error('Error loading cached translations:', error);
    }
}

// Save translations to localStorage
function saveTranslationsToCache() {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('translationCache', JSON.stringify(translationCache));
        } catch (error) {
            console.error('Error saving translations to cache:', error);
        }
    }
}

// Throttle translation requests to avoid rate limiting
const pendingTranslations: Record<string, Promise<string>> = {};

export async function translateText(text: string, targetLang: string = 'en', sourceLang: string = 'es'): Promise<string> {
    if (!text || targetLang === sourceLang) return text;

    // Create a cache key
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;

    // Check if translation is already cached
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    // Check if there's already a pending translation for this text
    if (pendingTranslations[cacheKey]) {
        return pendingTranslations[cacheKey];
    }

    // Create a new translation promise
    const translationPromise = (async () => {
        try {
            // Use direct translation for short texts to avoid API calls
            if (text.length < 5) {
                return text;
            }

            const result = await translate(text, { from: sourceLang, to: targetLang });

            // Cache the result
            translationCache[cacheKey] = result.text;

            // Save to localStorage every 10 new translations
            if (Object.keys(translationCache).length % 10 === 0) {
                saveTranslationsToCache();
            }

            return result.text;
        } catch (error) {
            console.error('Translation error:', error);

            // Retry logic
            if (retryCount < MAX_RETRIES) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                const result = await translateText(text, targetLang, sourceLang);
                retryCount = 0; // Reset retry count on success
                return result;
            }

            retryCount = 0; // Reset retry count
            return text; // Return original text if translation fails
        } finally {
            // Remove from pending translations
            delete pendingTranslations[cacheKey];
        }
    })();

    // Store the promise
    pendingTranslations[cacheKey] = translationPromise;

    return translationPromise;
}

// Batch translation to reduce API calls
const batchSize = 5;
let textBatch: string[] = [];
let batchPromise: Promise<string[]> | null = null;

export async function batchTranslateText(texts: string[], targetLang: string = 'en', sourceLang: string = 'es'): Promise<string[]> {
    // Filter out texts that are already cached
    const uncachedTexts = texts.filter(text => {
        const cacheKey = `${sourceLang}:${targetLang}:${text}`;
        return !translationCache[cacheKey] && text.length > 0;
    });

    if (uncachedTexts.length === 0) {
        // All texts are cached, return from cache
        return texts.map(text => {
            const cacheKey = `${sourceLang}:${targetLang}:${text}`;
            return translationCache[cacheKey] || text;
        });
    }

    // Translate uncached texts
    const translatedTexts = await Promise.all(uncachedTexts.map(text => translateText(text, targetLang, sourceLang)));

    // Map back to original order
    return texts.map(text => {
        const cacheKey = `${sourceLang}:${targetLang}:${text}`;
        if (translationCache[cacheKey]) {
            return translationCache[cacheKey];
        }
        const index = uncachedTexts.indexOf(text);
        return index >= 0 ? translatedTexts[index] : text;
    });
}

export async function translateHtml(html: string, targetLang: string = 'en', sourceLang: string = 'es'): Promise<string> {
    if (!html || targetLang === sourceLang) return html;

    // Create a cache key
    const cacheKey = `html:${sourceLang}:${targetLang}:${html}`;

    // Check if translation is already cached
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        // Extract text content from HTML
        const textParts: string[] = [];
        const htmlParts: string[] = [];

        // Simple HTML parser (this is a basic implementation)
        let currentText = '';
        let inTag = false;

        for (let i = 0; i < html.length; i++) {
            const char = html[i];

            if (char === '<') {
                if (currentText.trim()) {
                    textParts.push(currentText.trim());
                }
                currentText = '';
                inTag = true;
                htmlParts.push(char);
            } else if (char === '>') {
                inTag = false;
                htmlParts.push(char);
                currentText = '';
            } else if (inTag) {
                htmlParts.push(char);
            } else {
                currentText += char;
            }
        }

        if (currentText.trim()) {
            textParts.push(currentText.trim());
        }

        // Translate text parts in batches
        const translatedTextParts = await batchTranslateText(textParts, targetLang, sourceLang);

        // Reconstruct HTML with translated text
        let result = html;
        for (let i = 0; i < textParts.length; i++) {
            result = result.replace(textParts[i], translatedTextParts[i]);
        }

        // Cache the result
        translationCache[cacheKey] = result;
        saveTranslationsToCache();

        return result;
    } catch (error) {
        console.error('HTML translation error:', error);
        return html; // Return original HTML if translation fails
    }
}

export async function translateProduct(product: any, targetLang: string = 'en', sourceLang: string = 'es'): Promise<any> {
    if (!product || targetLang === sourceLang) return product;

    try {
        // Create a deep copy of the product
        const translatedProduct = JSON.parse(JSON.stringify(product));

        // Collect all texts to translate
        const textsToTranslate: string[] = [];
        const textPositions: { type: string; index?: number; field: string }[] = [];

        // Add name
        textsToTranslate.push(product.name);
        textPositions.push({ type: 'main', field: 'name' });

        // Add description and short description
        if (product.description) {
            textsToTranslate.push(product.description);
            textPositions.push({ type: 'main', field: 'description' });
        }

        if (product.short_description) {
            textsToTranslate.push(product.short_description);
            textPositions.push({ type: 'main', field: 'short_description' });
        }

        // Add attributes
        if (product.attributes && Array.isArray(product.attributes)) {
            for (let i = 0; i < product.attributes.length; i++) {
                // Add attribute name
                textsToTranslate.push(product.attributes[i].name);
                textPositions.push({ type: 'attribute', index: i, field: 'name' });

                // Add attribute options
                if (product.attributes[i].options && Array.isArray(product.attributes[i].options)) {
                    for (let j = 0; j < product.attributes[i].options.length; j++) {
                        textsToTranslate.push(product.attributes[i].options[j]);
                        textPositions.push({ type: 'option', index: i, field: `options[${j}]` });
                    }
                }
            }
        }

        // Add meta data
        if (product.meta_data && Array.isArray(product.meta_data)) {
            for (let i = 0; i < product.meta_data.length; i++) {
                const meta = product.meta_data[i];
                // Only translate string values that look like they contain text
                if (typeof meta.value === 'string' && meta.value.length > 3 && /[a-zA-Z]/.test(meta.value)) {
                    textsToTranslate.push(meta.value);
                    textPositions.push({ type: 'meta', index: i, field: 'value' });
                }
            }
        }

        // Translate all texts in one batch
        const translatedTexts = await batchTranslateText(textsToTranslate, targetLang, sourceLang);

        // Apply translations
        for (let i = 0; i < textPositions.length; i++) {
            const pos = textPositions[i];
            const translatedText = translatedTexts[i];

            if (pos.type === 'main') {
                translatedProduct[pos.field] = translatedText;
            } else if (pos.type === 'attribute' && pos.index !== undefined) {
                translatedProduct.attributes[pos.index].name = translatedText;
            } else if (pos.type === 'option' && pos.index !== undefined) {
                const optionIndex = parseInt(pos.field.match(/\[(\d+)\]/)?.[1] || '0');
                translatedProduct.attributes[pos.index].options[optionIndex] = translatedText;
            } else if (pos.type === 'meta' && pos.index !== undefined) {
                translatedProduct.meta_data[pos.index].value = translatedText;
            }
        }

        return translatedProduct;
    } catch (error) {
        console.error('Product translation error:', error);
        return product; // Return original product if translation fails
    }
}