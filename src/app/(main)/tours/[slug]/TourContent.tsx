'use client';

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { MdAccessTime } from "react-icons/md";
import { RiBatteryChargeLine } from "react-icons/ri";
import { CheckCircle } from 'lucide-react'
import { VscError } from "react-icons/vsc";
import SingleTourSelector from "@/components/SingleTourSelector";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Product } from "@/types/woocommerce";

interface ProductWithAttributes extends Product {
    subtitulo?: string;
    productAttributes: {
        name: string;
        value: string;
        value_en: string;
    }[];
}

const iconConfig = {
    'duración': {
        icon: MdAccessTime,
        size: 'h-6 w-6',
        color: 'text-blue-500',
        translation: 'tour_section.duration'
    },
    'dificultad': {
        icon: RiBatteryChargeLine,
        size: 'h-6 w-6',
        color: 'text-green-500',
        translation: 'tour_section.difficulty'
    },
    'incluye': {
        icon: CheckCircle,
        size: 'h-6 w-6',
        color: 'text-emerald-500',
        translation: 'tour_section.includes'
    },
    'no incluye': {
        icon: VscError,
        size: 'h-6 w-6',
        color: 'text-red-500',
        translation: 'tour_section.notIncludes'
    }
};

interface TourContentProps {
    slug: string;
}

export default function TourContent({ slug }: TourContentProps) {
    const { t, i18n } = useTranslation();
    const [product, setProduct] = useState<ProductWithAttributes | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`);

                if (!response.ok) {
                    throw new Error(`Failed to fetch product: ${response.status}`);
                }

                const products = await response.json();

                if (!Array.isArray(products) || products.length === 0) {
                    throw new Error('Product not found');
                }

                const productData = products[0];

                // Process the product data
                const processedProduct = {
                    ...productData,
                    productAttributes: productData.attributes.map((attr: any) => {
                        const name = attr.name.charAt(0).toUpperCase() + attr.name.slice(1);
                        const value = attr.options[0] || '';
                        const value_en = productData.meta_data?.find((meta: any) =>
                            meta.key === `${attr.name}_en` ||
                            meta.key === `attribute_${attr.name}_en`
                        )?.value || value;

                        return {
                            name,
                            value,
                            value_en
                        };
                    }),
                    name: i18n.language === 'en' && productData.meta_data?.find((meta: any) => meta.key === 'name_en')?.value
                        ? productData.meta_data?.find((meta: any) => meta.key === 'name_en')?.value
                        : productData.name,
                    subtitulo: productData.meta_data?.find((meta: any) => meta.key === 'subtitulo')?.value || '',
                    description_en: productData.meta_data?.find((meta: any) => meta.key === 'description_en')?.value || '',
                    short_description_en: productData.meta_data?.find((meta: any) => meta.key === 'short_description_en')?.value || ''
                };

                setProduct(processedProduct);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug, i18n.language]);

    if (loading) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg">{t('common.loading')}</p>
        </div>
    );

    if (error) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg text-red-500">{t('common.error')}: {error}</p>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen pt-[120px] flex items-center justify-center">
            <p className="text-lg">{t('common.noProducts')}</p>
        </div>
    );

    // Get the appropriate description based on language
    const description = i18n.language === 'en' && product.description_en
        ? product.description_en
        : product.description;

    // Log the description being used for debugging
    console.log('Description being used:', {
        language: i18n.language,
        hasEnglishDescription: Boolean(product.description_en),
        selectedDescription: description
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[80vh] w-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={product.images[0]?.src || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end">
                    <div className="container mx-auto px-4 pb-20">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-3xl font-bold text-white">
                                    ${parseInt(product.price).toLocaleString('es-CL')}
                                </span>
                                <span className="text-white/80">/{t('common.perPerson')}</span>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6">
                                <SingleTourSelector
                                    tourId={product.id}
                                    tourName={product.name}
                                    tourPrice={parseInt(product.price)}
                                    tourImage={product.images[0]?.src || "/placeholder.svg"}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto py-12 px-4 max-w-[1200px]">
                <div
                    className="prose prose-lg max-w-none
                            prose-headings:font-bold prose-headings:text-gray-900
                            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                            prose-p:text-gray-600 prose-p:leading-relaxed
                            prose-ul:mt-4 prose-ul:list-disc prose-ul:pl-6
                            prose-li:text-gray-600 prose-li:mb-2
                            prose-strong:text-gray-900 prose-strong:font-semibold"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
                <Card className="mt-10">
                    <CardContent className="p-10">
                        <h3 className="text-2xl font-bold mb-6">{t('tour_section.title')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {product.productAttributes.map((attr) => {
                                const config = iconConfig[attr.name.toLowerCase() as keyof typeof iconConfig] || {
                                    icon: CheckCircle,
                                    size: 'h-5 w-5',
                                    color: 'text-gray-600',
                                    translation: attr.name
                                };
                                const Icon = config.icon;

                                if (attr.name.toLowerCase() === 'incluye' || attr.name.toLowerCase() === 'no incluye') {
                                    const value = i18n.language === 'en' && attr.value_en ? attr.value_en : attr.value;
                                    const items = value
                                        .split('•')
                                        .map(item => item.trim())
                                        .filter(item => item !== '');

                                    return (
                                        <div key={attr.name} className="space-y-2">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <Icon className={`${config.size} ${config.color}`} />
                                                <span>{t(config.translation)}</span>
                                            </div>
                                            <ul className="list-disc list-inside space-y-1 ml-8 text-sm text-gray-600">
                                                {items.map((item, index) => (
                                                    <li key={index}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }

                                // Special handling for duration
                                if (attr.name.toLowerCase() === 'duración') {
                                    // Get the appropriate value based on language
                                    const value = i18n.language === 'en' && attr.value_en ? attr.value_en : attr.value;

                                    // Extract numeric part and determine unit
                                    const numericPart = value.match(/\d+/)?.[0] || '';
                                    const isHours = value.toLowerCase().includes('hora') || value.toLowerCase().includes('hour');
                                    const unit = isHours ? 'hours' : 'days';

                                    // Create translated value
                                    const translatedValue = `${numericPart} ${t(`tour_section.${unit}`)}`;

                                    return (
                                        <div key={attr.name} className="flex items-center gap-2">
                                            <Icon className={`${config.size} ${config.color}`} />
                                            <span className="font-semibold">{t(config.translation)}:</span>
                                            <span>{translatedValue}</span>
                                        </div>
                                    );
                                }

                                // For all other attributes
                                const value = i18n.language === 'en' && attr.value_en ? attr.value_en : attr.value;
                                return (
                                    <div key={attr.name} className="flex items-center gap-2">
                                        <Icon className={`${config.size} ${config.color}`} />
                                        <span className="font-semibold">{t(config.translation)}:</span>
                                        <span>{value}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 