'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types/woocommerce';

export default function TestProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                console.log('Fetching products for test page...');
                const response = await fetch('/api/products?limit=5', {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(`Received ${data.length} products for test page`);
                setProducts(data);
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching products for test page:', err);
                setError(err.message || 'An unknown error occurred');
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    if (loading) {
        return <div className="p-8">Loading products...</div>;
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Test Products Page</h1>
            <p className="mb-4">This is a simple test page to directly fetch and display products.</p>

            <div className="mb-4">
                <Link href="/" className="text-blue-500 hover:underline">
                    Back to Home
                </Link>
            </div>

            <div className="grid gap-4">
                {products.length > 0 ? (
                    products.map(product => (
                        <div key={product.id} className="border p-4 rounded">
                            <h2 className="text-xl font-semibold">{product.name}</h2>
                            <p className="text-gray-600">ID: {product.id}</p>
                            <p className="text-gray-600">Slug: {product.slug}</p>
                            <p className="text-gray-600">Price: ${parseInt(product.price).toLocaleString('es-CL')}</p>
                            {product.images && product.images.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-gray-600">Image URL: {product.images[0].src}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No products found.</p>
                )}
            </div>
        </div>
    );
} 