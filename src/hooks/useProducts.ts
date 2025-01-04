import { useState, useEffect } from 'react';
import { Product } from '@/types/woocommerce';

export function useProducts(categoryId?: number) { // Accept category ID directly
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

                // Use category ID directly in API call
                let apiUrl = '/api/products';
                if (categoryId) {
                    apiUrl += `?category=${categoryId}`;
                }

                console.log("🔄 Fetching products from:", apiUrl);

                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Basic ${btoa('consumer_key:consumer_secret')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log("📦 Raw API Response:", data);

                if (!Array.isArray(data)) {
                    console.error("❌ ERROR: API response is not an array!");
                    return;
                }

                // Store all products or filter by category if categoryId is provided
                const filteredProducts = categoryId
                    ? data.filter((product: any) =>
                        product.categories.some((c: any) => c.id === categoryId)
                    )
                    : data;

                console.log("✅ Filtered Products:", filteredProducts);
                setProducts(filteredProducts);
            } catch (err) {
                setError(`Failed to fetch products: ${(err as Error).message}`);
                console.error("❌ Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryId]);

    return { products, loading, error };
}