'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";

const gallery = [
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/835481a75410efaac35d2a4593bef8f8.webp",
        alt: "Vista panorámica de Rapa Nui",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/viaje-a-ios-motus.webp",
        alt: "Viaje a los Motus",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/1000039572.jpg",
        alt: "Moai al atardecer",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/poike-volcano-view-from-1.webp",
        alt: "Hombre observando formación rocosa",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Palmeras en la playa Anakena",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Vista de Orongo",
    },
    {
        src: "https://hotumatur.thefullstack.digital/wp-content/uploads/2024/12/Palmeras-Anakena-scaled-1.jpg",
        alt: "Escena cultural de Rapa Nui",
    },
];

export default function AutoSlidingGallery() {
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        let animationId: number;
        let scrollSpeed = 0.5; // Adjust for faster or slower scrolling

        const scrollGallery = () => {
            if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                slider.scrollLeft = 0; // Reset to the start when reaching the end
            } else {
                slider.scrollLeft += scrollSpeed;
            }
            animationId = requestAnimationFrame(scrollGallery);
        };

        animationId = requestAnimationFrame(scrollGallery);

        return () => cancelAnimationFrame(animationId); // Cleanup on component unmount
    }, []);

    return (
        <section className="py-20 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center text-white mb-12">
                    Galería de Rapa Nui
                </h2>
                <div
                    ref={sliderRef}
                    className="flex overflow-x-hidden space-x-4 py-4"
                    style={{ whiteSpace: "nowrap" }}
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
                                className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}