'use client';

import { useState, useEffect, useRef } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { useTranslation } from 'react-i18next';

// Category ID to Name Mapping
const categoryNames: Record<number, string> = {
    24: "Tour Privados",
    25: "Tour Grupales",
    26: "Tour Especiales",
    23: "Actividades",
    19: "Tours",
};

interface ProductSectionProps {
    categoryId: number | undefined; // Use category ID
}

export default function ProductSection({ categoryId }: ProductSectionProps) {
    const [isMounted, setIsMounted] = useState(false);
    const { t, i18n } = useTranslation(['common']);
    const [showSkeleton, setShowSkeleton] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Only fetch products after component is mounted to avoid hydration issues
    const { products, loading, error, refetch } = useProducts(categoryId, isMounted);

    // Set mounted flag after initial render
    useEffect(() => {
        setIsMounted(true);

        // Set a timeout to stop showing the skeleton after 10 seconds
        // even if loading is still true
        timeoutRef.current = setTimeout(() => {
            setShowSkeleton(false);
        }, 10000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Update skeleton visibility based on loading state
    useEffect(() => {
        if (!loading) {
            setShowSkeleton(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        }
    }, [loading]);

    // Listen for language changes
    useEffect(() => {
        if (!isMounted) return;

        const handleLanguageChange = (event: Event) => {
            refetch();
        };

        window.addEventListener('language-changed', handleLanguageChange);

        return () => {
            window.removeEventListener('language-changed', handleLanguageChange);
        };
    }, [refetch, isMounted]);

    // Show loading state during initial server render and client hydration
    if (!isMounted || (loading && showSkeleton)) {
        return renderLoadingSkeleton();
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{t('error', { ns: 'common' })}: {error}</p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {t('retry', { ns: 'common' })}
                </button>
            </div>
        );
    }

    return (
        <section className="product-section mt-20">
            <div className="grid md:grid-cols-3 gap-8 mx-auto">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center col-span-3 py-8 text-gray-500">{t('noProducts', { ns: 'common' })}</p>
                )}
            </div>
        </section>
    );
}

// Helper function to render loading skeleton
function renderLoadingSkeleton() {
    return (
        <div className="grid md:grid-cols-3 gap-8 mx-auto">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border bg-background p-2 flex flex-col h-full opacity-70">
                    <div className="aspect-[4/3] rounded-md relative h-[240px] bg-gray-200 animate-pulse"></div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}