'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const gallery = [
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/835481a75410efaac35d2a4593bef8f8.webp',
        alt: 'Vista panorámica de Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/viaje-a-ios-motus.webp',
        alt: 'Viaje a los Motus',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/1000039572.jpg',
        alt: 'Moai al atardecer',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/poike-volcano-view-from-1.webp',
        alt: 'Hombre observando formación rocosa',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg',
        alt: 'Palmeras en la playa Anakena',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/about_6_1-1.webp',
        alt: 'Vista de Orongo',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/01aaad9c-dcd9-4e2e-967e-3004ff6197f3-large16x9_AP22349703471982.webp',
        alt: 'Majestuosos Moais en la isla de pascua',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Snorkeling-Rapa-Nui-Easter-Island-Scuba-Diving-09.webp',
        alt: 'Buzos explorando las playas de Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/pexels-bianeyre-1236028-1.webp',
        alt: 'Grupo de turistas a caballo recorriendo la Isla de Pascua',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/rano-kau-prin-min.webp',
        alt: 'Volcan Orongo en Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/1000039573.jpg',
        alt: 'Escena cultural de Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/PC090024-scaled-pzqqzsdpw0t2olbkp02eczdx7b5khwc0j6cxocl3b4.webp',
        alt: 'Entrada del Hotel Tupa en Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/pexels-luqmaantee-3104444-scaled.webp',
        alt: 'Pesca de orilla en la costa de Rapa Nui',
    },

];

export default function AutoSlidingGallery() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        let animationId: number;
        let scrollSpeed = 0.5; // Adjust for faster or slower scrolling

        const scrollGallery = () => {
            if (!isDragging) {
                if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                    slider.scrollLeft = 0; // Reset to the start when reaching the end
                } else {
                    slider.scrollLeft += scrollSpeed;
                }
            }
            animationId = requestAnimationFrame(scrollGallery);
        };

        animationId = requestAnimationFrame(scrollGallery);

        return () => cancelAnimationFrame(animationId); // Cleanup on component unmount
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = sliderRef.current;
        if (!slider) return;

        setIsDragging(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const slider = sliderRef.current;
        if (!slider) return;

        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = x - startX; // Distance dragged
        slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Galería de Rapa Nui
                </h2>
                <div
                    ref={sliderRef}
                    className={`flex overflow-x-hidden space-x-4 py-4 cursor-${isDragging ? 'grabbing' : 'grab'}`}
                    style={{ whiteSpace: 'nowrap' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {gallery.map((image, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-60 h-60 overflow-hidden rounded-lg"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="25vw"
                                className="object-cover transition-transform duration-300 hover:scale-110 pointer-events-none"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}