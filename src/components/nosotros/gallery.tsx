'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const gallery = [
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/viaje-a-ios-motus.webp',
        alt: 'Viaje a los Motus',
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
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Vista-Orongo-Motus-1-scaled.webp',
        alt: 'Vista de los Motus desde Orongo',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Ahu-Akivi-3-scaled.webp',
        alt: 'Majestuosos Moais en la isla de pascua',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Snorkeling-Rapa-Nui-Easter-Island-Scuba-Diving-09.webp',
        alt: 'Buzos explorando las playas de Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/WhatsApp-Image-2024-01-05-at-00.01.55.webp',
        alt: 'Grupo de turistas recorriendo la Isla de Pascua',
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
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/WhatsApp-Image-2023-12-16-at-17.50.04.webp',
        alt: 'Turistas con turismo hotumatur en Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Panoramica-Orongo-scaled.jpg',
        alt: 'Vista panormica desde el volcan Orongo',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/WhatsApp-Image-2024-01-29-at-19.59.25.webp',
        alt: 'Turistas en el volcan Orongo',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/WhatsApp-Image-2024-01-29-at-19.59.27.webp',
        alt: 'Visita guiada en Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Hare-Keho-Orongo-4-1-scaled.webp',
        alt: 'Hare Keho en Orongo',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Ahu-Akivi-2-scaled.webp',
        alt: 'Ahu Akivi en Rapa Nui',
    },
    {
        src: 'https://backend.hotumatur.com/wp-content/uploads/2025/02/Vinapu-2.webp',
        alt: 'Visita guiada en Rapa Nui',
    },

];

// Filter out images with empty src
const validGallery = gallery.filter(img => img.src !== '');
// Create extended array with cloned items for infinite scroll
const extendedGallery = [...validGallery.slice(-2), ...validGallery, ...validGallery.slice(0, 2)];

export default function AutoSlidingGallery() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrolling = useRef(false);
    const lastScrollPosition = useRef(0);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        let animationId: number;
        let scrollSpeed = 0.8;

        const handleScroll = () => {
            if (!slider || scrolling.current || isDragging) return;

            const totalWidth = slider.scrollWidth;
            const sectionWidth = totalWidth / 3;

            // Only handle jumps during auto-scroll, not during drag
            if (!isDragging) {
                if (slider.scrollLeft >= sectionWidth * 2) {
                    scrolling.current = true;
                    slider.scrollLeft = sectionWidth;
                    lastScrollPosition.current = sectionWidth;
                    setTimeout(() => {
                        scrolling.current = false;
                    }, 50);
                } else if (slider.scrollLeft <= 0) {
                    scrolling.current = true;
                    slider.scrollLeft = sectionWidth;
                    lastScrollPosition.current = sectionWidth;
                    setTimeout(() => {
                        scrolling.current = false;
                    }, 50);
                }
            }
        };

        const scrollGallery = () => {
            if (!isDragging && !scrolling.current) {
                slider.scrollLeft += scrollSpeed;
                lastScrollPosition.current = slider.scrollLeft;
            }
            animationId = requestAnimationFrame(scrollGallery);
        };

        // Initialize scroll position
        if (lastScrollPosition.current === 0) {
            slider.scrollLeft = slider.scrollWidth / 3;
            lastScrollPosition.current = slider.scrollLeft;
        } else {
            slider.scrollLeft = lastScrollPosition.current;
        }

        slider.addEventListener('scroll', handleScroll);
        animationId = requestAnimationFrame(scrollGallery);

        return () => {
            cancelAnimationFrame(animationId);
            slider.removeEventListener('scroll', handleScroll);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const slider = sliderRef.current;
        if (!slider) return;

        setIsDragging(true);
        setStartX(e.pageX - slider.offsetLeft);
        setScrollLeft(slider.scrollLeft);
        lastScrollPosition.current = slider.scrollLeft;
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;

        const slider = sliderRef.current;
        if (!slider) return;

        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = x - startX;
        const newScrollPosition = scrollLeft - walk;
        slider.scrollLeft = newScrollPosition;
        lastScrollPosition.current = newScrollPosition;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Don't reset position, just continue from current position
    };

    const handleMouseLeave = handleMouseUp;

    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Galería de Rapa Nui
                </h2>
                <div
                    ref={sliderRef}
                    className={`flex overflow-x-hidden space-x-4 py-4 cursor-${isDragging ? 'grabbing' : 'grab'}`}
                    style={{
                        whiteSpace: 'nowrap',
                        scrollBehavior: 'auto'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {extendedGallery.map((image, index) => (
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
                                draggable={false}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}