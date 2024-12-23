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
    const backgroundRef = useRef<HTMLDivElement>(null);

    // Filter products by category
    const tours = Array.isArray(products)
        ? products.filter((product) =>
            product.categories.some((category) => category.name === 'Tours')
        )
        : [];

    useEffect(() => {
        const section = sectionRef.current;
        const background = backgroundRef.current;

        if (section && background) {
            // Animate the background opacity in a gradient pattern
            gsap.fromTo(
                background,
                { backgroundPosition: 'left top', opacity: 0 },
                {
                    backgroundPosition: 'right bottom',
                    opacity: 1,
                    duration: 3,
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: true,
                    },
                }
            );
        }
    }, []);

    if (loading) {
        return (
            <section ref={sectionRef} className="w-full px-4 py-32 md:px-6 lg:px-8">
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
            className="relative w-full px-4 py-32 md:px-6 lg:px-8 overflow-hidden"
        >
            {/* Animated Background */}
            <div
                ref={backgroundRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{
                    backgroundImage: "url('./images/rapanui-background.svg')",
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0, // Start fully transparent
                }}
            ></div>

            {/* Product Section Content */}
            <div className="relative z-10 mx-auto max-w-6xl space-y-12">
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