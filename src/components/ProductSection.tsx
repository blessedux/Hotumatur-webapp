'use client';

import { useRef } from 'react';
import { useTrail, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function ProductSection() {
    const { products, loading, error } = useProducts();
    const sectionRef = useRef<HTMLElement>(null);

    // Split the title into characters
    const title = 'Vive La Esencia De Rapa Nui';
    const chars = title.split('');

    // Intersection Observer Hook to detect when the section is in view
    const [ref, inView] = useInView({
        threshold: 0.25, // Trigger when 25% of the section is in view
    });

    // React Spring Trail for Animating Characters
    const trail = useTrail(chars.length, {
        opacity: inView ? 1 : 0, // Fade in when in view
        config: { tension: 120, friction: 14 },
    });

    // Filter products by category
    const tours = Array.isArray(products)
        ? products.filter((product) =>
            product.categories.some((category) => category.name === 'Tours')
        )
        : [];

    if (loading) {
        return (
            <section
                ref={(node) => {
                    sectionRef.current = node;
                    ref(node);
                }}
                className="relative z-[2] w-full px-4 py-32 md:px-6 lg:px-8"
            >
                <div className="mx-auto max-w-6xl space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                            <animated.span
                                style={{
                                    opacity: inView ? 1 : 0,
                                    transition: 'opacity 0.8s ease-in-out',
                                }}
                                className="inline-block"
                            >
                                Vive La Esencia De{' '}
                                <span className="font-satisfy">Rapa Nui</span>
                            </animated.span>
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                Error: {error.message || 'An unexpected error occurred.'}
            </div>
        );
    }

    return (
        <section
            ref={(node) => {
                sectionRef.current = node;
                ref(node);
            }}
            className="relative z-[2] w-full px-4 py-32 md:px-6 lg:px-8 shadow-lg"
            style={{
                background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            }}
        >
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        <animated.span
                            style={{
                                opacity: inView ? 1 : 0,
                                transition: 'opacity 0.8s ease-in-out',
                            }}
                            className="inline-block"
                        >
                            Vive La Esencia De{' '}
                            <span className="font-satisfy">Rapa Nui</span>
                        </animated.span>
                    </h2>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {tours.length > 0 ? (
                        tours.map((tour) => (
                            <ProductCard key={tour.id} product={tour} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">
                            No hay tours disponibles en este momento.
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}