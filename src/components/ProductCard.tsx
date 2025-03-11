'use client';

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/woocommerce";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import FadeIn from "./FadeIn";
import { useTranslation } from 'react-i18next';
import TranslatedContent from "./TranslatedContent";

interface ProductCardProps {
    product: Product;
}

function truncateHTML(html: string, maxLength: number = 250): { text: string; isTruncated: boolean } {
    if (!html) return { text: '', isTruncated: false };

    // Only run in browser environment
    if (typeof document === 'undefined') {
        return { text: html.slice(0, maxLength), isTruncated: html.length > maxLength };
    }

    try {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';

        const isTruncated = text.length > maxLength;
        return {
            text: isTruncated ? text.slice(0, maxLength).trim() + '...' : text,
            isTruncated,
        };
    } catch (error) {
        // Fallback if there's an error processing the HTML
        return { text: html.slice(0, maxLength), isTruncated: html.length > maxLength };
    }
}

function formatPrice(price: string): string {
    if (!price) return '0';
    try {
        return parseInt(price).toLocaleString('es-CL');
    } catch (error) {
        return '0';
    }
}

export function ProductCard({ product }: ProductCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { t } = useTranslation(['common']);
    const [isMounted, setIsMounted] = useState(false);

    // Set mounted flag after initial render
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Ensure product has required fields
    if (!product || !product.id) {
        return (
            <FadeIn>
                <div className="group relative overflow-hidden rounded-lg border bg-background p-2 flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden rounded-md relative h-[240px] bg-gray-200"></div>
                    <div className="p-4 flex flex-col flex-grow">
                        <div className="h-6 bg-gray-200 rounded mb-4"></div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                            <div className="h-8 w-24 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </FadeIn>
        );
    }

    // Don't process HTML on server to avoid hydration issues
    const descriptionText = product?.short_description || '';
    const { text, isTruncated } = isMounted
        ? truncateHTML(descriptionText)
        : { text: '', isTruncated: false };

    const description = isExpanded ? descriptionText : text;

    // Ensure product has a slug, default to ID if not
    const productSlug = product.slug || `product-${product.id}`;

    return (
        <FadeIn>
            <div className="group relative overflow-hidden rounded-lg border bg-background p-2 flex flex-col h-full">
                <Link href={`/tours/${productSlug}`} className="flex flex-col h-full">
                    <div className="aspect-[4/3] overflow-hidden rounded-md relative h-[240px]">
                        {isMounted ? (
                            <Image
                                src={imageError ? "/placeholder.svg" : (product.images?.[0]?.src || "/placeholder.svg")}
                                alt={product.name || ''}
                                fill
                                className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-110"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                onError={() => setImageError(true)}
                                priority={true}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                        )}
                    </div>

                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-xl font-semibold">{product.name || ''}</h3>
                        <div className="text-sm text-muted-foreground mt-2 flex-grow">
                            {isMounted ? (
                                <>
                                    <TranslatedContent
                                        html={description || 'No description available'}
                                        className="text-sm text-muted-foreground"
                                    />
                                    {isTruncated && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsExpanded(!isExpanded);
                                            }}
                                            className="text-blue-500 hover:text-blue-600 mt-1 text-sm font-medium"
                                        >
                                            {isExpanded ? t('showLess', { ns: 'common' }) : t('showMore', { ns: 'common' })}
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
                            )}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                                <span className="text-xl font-bold">${formatPrice(product.price || '0')}</span>
                                <span className="text-sm text-muted-foreground">/{t('perPerson', { ns: 'common' })}</span>
                            </div>
                            <Button variant="default" size="sm">
                                {t('viewDetails', { ns: 'common' })}
                            </Button>
                        </div>
                    </div>
                </Link>
            </div>
        </FadeIn>
    );
}