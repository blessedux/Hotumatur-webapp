import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/woocommerce';
import { useTranslation } from 'react-i18next';
import { getCachedProducts, initCache, startBackgroundSync } from '@/services/translationCache.service';

export function useProducts(categoryId?: number, isMounted: boolean = true) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    // Initialize translation cache
    useEffect(() => {
        if (typeof window !== 'undefined' && isMounted) {
            initCache();
        }
    }, [isMounted]);

    // Function to fetch products
    const fetchProducts = useCallback(async () => {
        if (!isMounted) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Build API URL with simple query parameters
            let apiUrl = '/api/products';
            const params = new URLSearchParams();

            // Add language parameter
            params.append('lang', 'es'); // Always fetch Spanish first, we'll translate client-side

            // Add category parameter if provided
            if (categoryId) {
                params.append('category', categoryId.toString());
            }

            // Add parameters to URL
            if (params.toString()) {
                apiUrl += `?${params.toString()}`;
            }

            console.log(`[useProducts] Fetching products from: ${apiUrl}`);

            // Simple fetch with minimal options
            const response = await fetch(apiUrl, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Validate the response format
            if (!Array.isArray(data)) {
                throw new Error('Invalid API response format');
            }

            console.log(`[useProducts] Successfully fetched ${data.length} products`);

            // Use translation cache service to get translated products
            const translatedProducts = await getCachedProducts(data, currentLanguage);

            setProducts(translatedProducts);
            setLoading(false);
        } catch (err) {
            console.error('[useProducts] Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
        }
    }, [categoryId, currentLanguage, isMounted]);

    // Fetch products when component mounts or when dependencies change
    useEffect(() => {
        if (isMounted) {
            fetchProducts();

            // Safety timeout to prevent infinite loading
            const safetyTimeout = setTimeout(() => {
                setLoading(false);
            }, 10000);

            return () => clearTimeout(safetyTimeout);
        } else {
            setLoading(false);
        }
    }, [fetchProducts, isMounted]);

    // Listen for translation updates
    useEffect(() => {
        if (!isMounted) return;

        const handleTranslationUpdate = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('[useProducts] Translation update event received:', customEvent.detail);

            // Refetch products when translations are updated
            fetchProducts();
        };

        window.addEventListener('translation-updated', handleTranslationUpdate);

        return () => {
            window.removeEventListener('translation-updated', handleTranslationUpdate);
        };
    }, [fetchProducts, isMounted]);

    // Start background sync for translations
    useEffect(() => {
        if (isMounted && typeof window !== 'undefined') {
            startBackgroundSync();
        }
    }, [isMounted]);

    return { products, loading, error, refetch: fetchProducts };
}