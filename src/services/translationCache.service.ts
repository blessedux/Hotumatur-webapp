// TranslationCache service for static translations
import { translateProduct } from './translation.service';

// Type definitions
type CachedProduct = {
    es: any;
    en?: any; // Make English optional
    lastUpdated: number;
    [key: string]: any; // Allow string indexing
};

type TranslationCache = {
    products: Record<string, CachedProduct>;
    texts: Record<string, Record<string, string>>;
    lastSync: number;
    isPreloading: boolean;
};

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Initialize cache
let cache: TranslationCache = {
    products: {},
    texts: {},
    lastSync: 0,
    isPreloading: false
};

// Flag to track if cache is initialized
let isCacheInitialized = false;

// Load cache from localStorage
export function initCache(): void {
    if (typeof window === 'undefined' || isCacheInitialized) return;

    try {
        const savedCache = localStorage.getItem('translationCache');
        if (savedCache) {
            cache = JSON.parse(savedCache);
            console.log(`Loaded translation cache with ${Object.keys(cache.products).length} products`);
        }
        isCacheInitialized = true;

        // Start background sync after initialization
        startBackgroundSync();
    } catch (error) {
        console.error('Failed to load translation cache:', error);
    }
}

// Save cache to localStorage
export function saveCache(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem('translationCache', JSON.stringify(cache));
    } catch (error) {
        console.error('Failed to save translation cache:', error);

        // If the cache is too large, try clearing older entries
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            pruneCache();
            try {
                localStorage.setItem('translationCache', JSON.stringify(cache));
            } catch (e) {
                console.error('Still failed to save cache after pruning:', e);
            }
        }
    }
}

// Prune old entries from cache
function pruneCache(): void {
    const now = Date.now();

    // Remove products older than expiration time
    Object.keys(cache.products).forEach(slug => {
        if (now - cache.products[slug].lastUpdated > CACHE_EXPIRATION) {
            delete cache.products[slug];
        }
    });

    // Remove least recently used products if still too many
    if (Object.keys(cache.products).length > 20) {
        const sortedProducts = Object.entries(cache.products)
            .sort(([, a], [, b]) => a.lastUpdated - b.lastUpdated);

        // Keep only the 20 most recent products
        sortedProducts.slice(0, -20).forEach(([slug]) => {
            delete cache.products[slug];
        });
    }
}

// Get product from cache or fetch and translate
export async function getCachedProduct(slug: string, lang: string = 'es'): Promise<any> {
    // Initialize cache if needed
    if (!isCacheInitialized) {
        initCache();
    }

    try {
        // Check if product is in cache and not expired
        if (cache.products[slug] && cache.products[slug][lang]) {
            const now = Date.now();
            const product = cache.products[slug];

            // Return cached product if not expired
            if (now - product.lastUpdated < CACHE_EXPIRATION) {
                console.log(`Using cached ${lang} product for ${slug}`);
                return product[lang];
            }
        }

        // Product not in cache or expired, fetch it
        console.log(`Fetching and caching product: ${slug}`);
        return await fetchAndCacheProduct(slug, lang);
    } catch (error) {
        console.error(`Error in getCachedProduct for ${slug}:`, error);

        // If we have any version of the product in cache, return it as fallback
        if (cache.products[slug]) {
            if (cache.products[slug][lang]) {
                console.log(`Using expired cached ${lang} product for ${slug} as fallback`);
                return cache.products[slug][lang];
            } else if (cache.products[slug].es) {
                console.log(`Using Spanish product for ${slug} as fallback`);
                return cache.products[slug].es;
            }
        }

        // If all else fails, throw the error to be handled by the caller
        throw error;
    }
}

// Get multiple products from cache or fetch and translate
export async function getCachedProducts(products: any[], lang: string = 'es'): Promise<any[]> {
    // Initialize cache if needed
    if (!isCacheInitialized) {
        initCache();
    }

    const now = Date.now();
    const result: any[] = [];
    const productsToFetch: any[] = [];

    // Check which products are in cache
    for (const product of products) {
        const slug = product.slug;

        // If product is in cache and not expired, use it
        if (cache.products[slug] && cache.products[slug][lang] &&
            now - cache.products[slug].lastUpdated < CACHE_EXPIRATION) {
            result.push(cache.products[slug][lang]);
        } else {
            // Otherwise, add to list of products to fetch
            productsToFetch.push(product);

            // Cache the Spanish version if we have it
            if (lang === 'es') {
                result.push(product);

                // Add to cache
                if (!cache.products[slug]) {
                    cache.products[slug] = {
                        es: product,
                        en: null,
                        lastUpdated: now
                    };
                } else {
                    cache.products[slug].es = product;
                    cache.products[slug].lastUpdated = now;
                }
            } else if (cache.products[slug] && cache.products[slug][lang]) {
                // Use cached version even if expired
                result.push(cache.products[slug][lang]);
            } else {
                // Add original product as placeholder
                result.push(product);
            }
        }
    }

    // Start background translation for products that need it
    if (productsToFetch.length > 0 && lang !== 'es') {
        console.log(`Starting background translation for ${productsToFetch.length} products`);
        translateProductsInBackground(productsToFetch, lang);
    }

    // Save cache
    saveCache();

    return result;
}

// Fetch product from API and cache all translations
async function fetchAndCacheProduct(slug: string, lang: string = 'es'): Promise<any> {
    // Try to get from cache first, even if expired
    if (cache.products[slug]) {
        if (cache.products[slug][lang]) {
            console.log(`Using cached ${lang} product for ${slug} (might be expired)`);
            return cache.products[slug][lang];
        } else if (lang !== 'es' && cache.products[slug].es) {
            console.log(`Using Spanish product for ${slug} as fallback`);
            return cache.products[slug].es;
        }
    }

    // Maximum number of retries
    const maxRetries = 2;
    let retryCount = 0;
    let lastError: any = null;

    while (retryCount <= maxRetries) {
        try {
            // Fetch the product with a timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

            console.log(`Fetching product (attempt ${retryCount + 1}): ${slug}`);

            // Fetch the product
            const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Failed to fetch product: ${response.status}`);
            }

            const products = await response.json();

            if (!Array.isArray(products) || products.length === 0) {
                throw new Error('Product not found');
            }

            const esProduct = products[0];

            // Cache the Spanish version
            if (!cache.products[slug]) {
                cache.products[slug] = {
                    es: esProduct,
                    lastUpdated: Date.now()
                };
            } else {
                cache.products[slug].es = esProduct;
                cache.products[slug].lastUpdated = Date.now();
            }

            // If we need English, translate it in the background
            if (lang === 'en') {
                translateProductInBackground(esProduct, 'en');

                // If we already have a cached English version, return it
                if (cache.products[slug].en) {
                    return cache.products[slug].en;
                }

                // Otherwise, return the Spanish version as fallback
                return esProduct;
            }

            // Save cache
            saveCache();

            return esProduct;
        } catch (error) {
            lastError = error;
            retryCount++;

            if (retryCount <= maxRetries) {
                console.log(`Retrying fetch for ${slug} (${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            }
        }
    }

    // If we've exhausted all retries, throw the last error
    console.error(`Failed to fetch product after ${maxRetries} retries:`, lastError);
    throw lastError;
}

// Translate a product in the background and cache it
async function translateProductInBackground(product: any, targetLang: string): Promise<void> {
    if (!product || !product.slug) return;

    try {
        console.log(`Translating product in background: ${product.slug} to ${targetLang}`);

        // Translate the product
        const translatedProduct = await translateProduct(product, targetLang);

        // Cache the translated product
        if (cache.products[product.slug]) {
            cache.products[product.slug][targetLang] = translatedProduct;
            saveCache();

            // Dispatch an event to notify components that translation is complete
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('translation-updated', {
                    detail: {
                        slug: product.slug,
                        language: targetLang
                    }
                }));
            }
        }
    } catch (error) {
        console.error(`Error translating product ${product.slug}:`, error);
    }
}

// Translate multiple products in the background
async function translateProductsInBackground(products: any[], targetLang: string): Promise<void> {
    for (const product of products) {
        if (product && product.slug) {
            translateProductInBackground(product, targetLang);
        }
    }
}

// Preload all products and their translations
export async function preloadAllProducts(): Promise<void> {
    if (cache.isPreloading) return;

    try {
        cache.isPreloading = true;
        console.log('Preloading all products...');

        // Fetch all products
        const response = await fetch('/api/products', {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const products = await response.json();

        if (!Array.isArray(products)) {
            throw new Error('Invalid response format');
        }

        console.log(`Preloading ${products.length} products`);

        // Cache all products
        const now = Date.now();

        for (const product of products) {
            if (product && product.slug) {
                // Cache the Spanish version
                if (!cache.products[product.slug]) {
                    cache.products[product.slug] = {
                        es: product,
                        lastUpdated: now
                    };
                } else {
                    cache.products[product.slug].es = product;
                    cache.products[product.slug].lastUpdated = now;
                }

                // Translate to English in the background
                translateProductInBackground(product, 'en');
            }
        }

        // Save cache
        saveCache();

        console.log('Preloading complete');
    } catch (error) {
        console.error('Error preloading products:', error);
    } finally {
        cache.isPreloading = false;
    }
}

// Start background sync process
export function startBackgroundSync(): void {
    if (typeof window === 'undefined') return;

    // Preload all products when the page loads
    preloadAllProducts();

    // Set up periodic sync
    const syncInterval = 30 * 60 * 1000; // 30 minutes

    // Check if we need to sync
    const now = Date.now();
    if (now - cache.lastSync > syncInterval) {
        console.log('Starting background sync...');
        preloadAllProducts();
        cache.lastSync = now;
        saveCache();
    }

    // Set up interval for future syncs
    setInterval(() => {
        console.log('Running periodic background sync...');
        preloadAllProducts();
        cache.lastSync = Date.now();
        saveCache();
    }, syncInterval);
}

// Get translation status
export function getTranslationStatus(): {
    productCount: number,
    translatedCount: number,
    isPreloading: boolean
} {
    return {
        productCount: Object.keys(cache.products).length,
        translatedCount: Object.values(cache.products).filter(p => p.en).length,
        isPreloading: cache.isPreloading
    };
} 