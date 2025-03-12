import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/types/woocommerce';
import { useTranslation } from 'react-i18next';

export function useProducts(categoryId?: number, isMounted: boolean = true) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

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

            // Always fetch Spanish products (original language)
            params.append('lang', 'es');

            // Add category parameter if provided
            if (categoryId) {
                params.append('category', categoryId.toString());
            }

            // Add parameters to URL
            if (params.toString()) {
                apiUrl += `?${params.toString()}`;
            }

            console.log(`[useProducts] Fetching products from: ${apiUrl}`);

            // Set a timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            try {
                // Simple fetch with minimal options
                const response = await fetch(apiUrl, {
                    cache: 'no-store',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`[useProducts] HTTP error! status: ${response.status}, details:`, errorText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Validate the response format
                if (!Array.isArray(data)) {
                    console.error('[useProducts] Invalid API response format:', data);
                    throw new Error('Invalid API response format');
                }

                console.log(`[useProducts] Successfully fetched ${data.length} products`);

                // Set products directly - we'll handle translations in the UI
                setProducts(data);
                setLoading(false);
            } catch (fetchError) {
                clearTimeout(timeoutId);

                // Handle timeout specifically
                if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
                    console.error('[useProducts] API request timed out');
                    // Instead of throwing an error, set an error message and continue
                    setError('Request to API timed out. Please try again later.');
                    setLoading(false);
                    return;
                }

                // Re-throw for general error handling
                throw fetchError;
            }
        } catch (err) {
            console.error('[useProducts] Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
        }
    }, [categoryId, isMounted]);

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

    // Listen for language changes
    useEffect(() => {
        if (!isMounted) return;

        const handleLanguageChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('[useProducts] Language change event received:', customEvent.detail);
            // No need to refetch, just update the UI
        };

        window.addEventListener('language-changed', handleLanguageChange);

        return () => {
            window.removeEventListener('language-changed', handleLanguageChange);
        };
    }, [isMounted]);

    return { products, loading, error, refetch: fetchProducts };
}