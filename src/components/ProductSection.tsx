'use client';

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";

// Category ID to Name Mapping
const categoryNames: Record<number, string> = {
    24: "Tour Privados",
    25: "Tour Grupales",
    26: "Tour Especiales",
};

interface ProductSectionProps {
    categoryId: number; // Use category ID
}

export default function ProductSection({ categoryId }: ProductSectionProps) {
    const { products, loading, error } = useProducts(categoryId);
    const [client, setClient] = useState(false);

    useEffect(() => {
        setClient(true);
    }, []);

    if (!client) {
        return <p>Loading...</p>;
    }

    if (loading) return <p>Loading products...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    // Get category name from ID, fallback to "Unknown Category"
    const categoryTitle = categoryNames[categoryId] || "Unknown Category";

    console.log("🚀 Selected Category ID:", categoryId);
    console.log("✅ Filtered Products Displayed:", products);

    return (
        <section className="product-section">
            <h2 className="text-3xl font-bold text-center mt-12 mb-12">{categoryTitle}</h2>
            <div className="grid md:grid-cols-3 gap-8 mx-auto">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No products found in this category.</p>
                )}
            </div>
        </section>
    );
}