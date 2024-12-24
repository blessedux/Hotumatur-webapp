import { useState, useEffect } from 'react';
import { Product } from '@/types/woocommerce';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'; // Use the correct base URL
                const response = await fetch('/api/products', {
                    headers: {
                        'Authorization': `Basic ${btoa('consumer_key:consumer_secret')}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(`Failed to fetch products: ${(err as Error).message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return { products, loading, error };
}