'use client';

import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation(['common']);

    useEffect(() => {
        setClient(true);
    }, []);

    if (!client) {
        return <p>{t('loading', { ns: 'common' })}</p>;
    }

    if (loading) return <p>{t('loadingProducts', { ns: 'common' })}</p>;
    if (error) return <p className="text-red-500">{t('error', { ns: 'common' })}: {error}</p>;

    console.log("🚀 Selected Category ID:", categoryId);
    console.log("✅ Filtered Products Displayed:", products);

    return (
        <section className="product-section mt-20">
            <div className="grid md:grid-cols-3 gap-8 mx-auto">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">{t('noProducts', { ns: 'common' })}</p>
                )}
            </div>
        </section>
    );
}