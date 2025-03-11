import { translate } from '@vitalets/google-translate-api';

// Type definitions
type TranslationOptions = {
    from?: string;
    to?: string;
    raw?: boolean;
};

// Cache for translations to avoid duplicate requests
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

/**
 * Translate text from one language to another
 * @param text Text to translate
 * @param targetLang Target language code (default: 'en')
 * @param sourceLang Source language code (default: 'es')
 * @returns Translated text
 */
export async function translateText(
    text: string,
    targetLang: string = 'en',
    sourceLang: string = 'es'
): Promise<string> {
    if (!text || text.trim() === '') {
        return text;
    }

    // If source and target languages are the same, return the original text
    if (targetLang === sourceLang) {
        return text;
    }

    // Create a cache key
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;

    // Check if translation is already in cache
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }

    try {
        // Translate the text
        const result = await translate(text, {
            from: sourceLang,
            to: targetLang,
        });

        // Cache the result
        translationCache[cacheKey] = result.text;

        return result.text;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Return original text on error
    }
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

/**
 * Translate a product object from one language to another
 * @param product Product object to translate
 * @param targetLang Target language code (default: 'en')
 * @param sourceLang Source language code (default: 'es')
 * @returns Translated product object
 */
export async function translateProduct(
    product: any,
    targetLang: string = 'en',
    sourceLang: string = 'es'
): Promise<any> {
    if (!product) {
        return product;
    }

    // If source and target languages are the same, return the original product
    if (targetLang === sourceLang) {
        return product;
    }

    // Check if product already has translations in meta_data
    const metaTranslations = getMetaTranslations(product, targetLang);

    // Create a deep copy of the product to avoid modifying the original
    const translatedProduct = JSON.parse(JSON.stringify(product));

    // Apply meta translations if available
    if (metaTranslations.hasTranslations) {
        if (metaTranslations.name) {
            translatedProduct.name = metaTranslations.name;
        }

        if (metaTranslations.description) {
            translatedProduct.description = metaTranslations.description;
        }

        if (metaTranslations.shortDescription) {
            translatedProduct.short_description = metaTranslations.shortDescription;
        }

        // Add translation source info
        translatedProduct._translationSource = 'meta_data';
    } else {
        // Translate main product fields
        try {
            // Translate name
            if (translatedProduct.name) {
                translatedProduct.name = await translateText(
                    translatedProduct.name,
                    targetLang,
                    sourceLang
                );
            }

            // Translate description
            if (translatedProduct.description) {
                translatedProduct.description = await translateText(
                    translatedProduct.description,
                    targetLang,
                    sourceLang
                );
            }

            // Translate short description
            if (translatedProduct.short_description) {
                translatedProduct.short_description = await translateText(
                    translatedProduct.short_description,
                    targetLang,
                    sourceLang
                );
            }

            // Add translation source info
            translatedProduct._translationSource = 'api';
        } catch (error) {
            console.error('Error translating product fields:', error);
        }
    }

    // Translate attributes
    if (Array.isArray(translatedProduct.attributes)) {
        try {
            for (let i = 0; i < translatedProduct.attributes.length; i++) {
                const attribute = translatedProduct.attributes[i];

                // Check if attribute has translation in meta_data
                const attributeKey = `attribute_${attribute.name.toLowerCase()}_${targetLang}`;
                const attributeTranslation = product.meta_data?.find(
                    (meta: any) => meta.key === attributeKey
                );

                if (attributeTranslation?.value) {
                    // Use translation from meta_data
                    attribute.name = attributeTranslation.value;
                } else if (attribute.name) {
                    // Translate attribute name
                    attribute.name = await translateText(
                        attribute.name,
                        targetLang,
                        sourceLang
                    );
                }

                // Translate attribute options
                if (Array.isArray(attribute.options)) {
                    const translatedOptions = [];

                    for (const option of attribute.options) {
                        // Check if option has translation in meta_data
                        const optionKey = `attribute_option_${attribute.name.toLowerCase()}_${option.toLowerCase()}_${targetLang}`;
                        const optionTranslation = product.meta_data?.find(
                            (meta: any) => meta.key === optionKey
                        );

                        if (optionTranslation?.value) {
                            // Use translation from meta_data
                            translatedOptions.push(optionTranslation.value);
                        } else {
                            // Translate option
                            const translatedOption = await translateText(
                                option,
                                targetLang,
                                sourceLang
                            );
                            translatedOptions.push(translatedOption);
                        }
                    }

                    attribute.options = translatedOptions;
                }
            }
        } catch (error) {
            console.error('Error translating product attributes:', error);
        }
    }

    // Add debug info
    translatedProduct._debug = {
        ...(translatedProduct._debug || {}),
        translatedAt: new Date().toISOString(),
        translatedFrom: sourceLang,
        translatedTo: targetLang
    };

    return translatedProduct;
}

/**
 * Extract translations from product meta_data
 * @param product Product object
 * @param lang Target language code
 * @returns Object with extracted translations
 */
function getMetaTranslations(product: any, lang: string): {
    hasTranslations: boolean;
    name?: string;
    description?: string;
    shortDescription?: string;
} {
    if (!product?.meta_data || !Array.isArray(product.meta_data)) {
        return { hasTranslations: false };
    }

    const result = {
        hasTranslations: false,
        name: undefined as string | undefined,
        description: undefined as string | undefined,
        shortDescription: undefined as string | undefined,
    };

    // Check for name translation
    const nameTranslation = product.meta_data.find(
        (meta: any) => meta.key === `name_${lang}` || meta.key === `_name_${lang}`
    );
    if (nameTranslation?.value) {
        result.name = nameTranslation.value;
        result.hasTranslations = true;
    }

    // Check for description translation
    const descriptionTranslation = product.meta_data.find(
        (meta: any) => meta.key === `description_${lang}` || meta.key === `_description_${lang}`
    );
    if (descriptionTranslation?.value) {
        result.description = descriptionTranslation.value;
        result.hasTranslations = true;
    }

    // Check for short description translation
    const shortDescriptionTranslation = product.meta_data.find(
        (meta: any) =>
            meta.key === `short_description_${lang}` ||
            meta.key === `_short_description_${lang}`
    );
    if (shortDescriptionTranslation?.value) {
        result.shortDescription = shortDescriptionTranslation.value;
        result.hasTranslations = true;
    }

    return result;
}