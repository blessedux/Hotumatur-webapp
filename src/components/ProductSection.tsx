'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import SkeletonCard from '@/components/SkeletonCard';

gsap.registerPlugin(ScrollTrigger);

export default function ProductSection() {
    const { products, loading, error } = useProducts();
    const sectionRef = useRef<HTMLElement>(null);

    // Filter products by category
    const tours = Array.isArray(products)
        ? products.filter((product) =>
            product.categories.some((category) => category.name === 'Tours')
        )
        : [];

    useEffect(() => {
        const section = sectionRef.current;

        if (section) {
            gsap.fromTo(
                section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        }
    }, []);

    if (loading) {
        return (
            <section ref={sectionRef} className="relative z-[2] w-full px-4 py-32 md:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl space-y-12">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                            Vive La Esencia De <span className="font-satisfy">Rapa Nui</span>
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

    if (error) return <div>Error: {error}</div>;

    return (
        <section
            ref={sectionRef}
            className="relative z-[2] w-full px-4 py-32 md:px-6 lg:px-8 border-4 border-gray-500 shadow-lg"
            style={{
                background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
            }}
        >
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="text-center">
                    <h2 className="text-2xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                        Vive La Esencia De <span className="font-satisfy">Rapa Nui</span>
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