'use client'

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TourSelector from "@/components/TourSelector";
import FadeIn from "./FadeIn";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
    const heroRef = useRef<HTMLDivElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        const hero = heroRef.current;

        if (hero) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: hero,
                    start: "top top",
                    end: "300px", // Adjust this if needed
                    scrub: true,
                },
            });

            // Default animation for desktop
            tl.to(hero, {
                y: 30,
                borderRadius: "3%",
                padding: "5%",
                duration: 1,
                ease: "power1.out",
            });

            // Media query for mobile
            ScrollTrigger.matchMedia({
                "(max-width: 768px)": function () {
                    gsap.to(hero, {
                        borderRadius: "5%", // Adjust border-radius for mobile
                        duration: 1,
                        ease: "power1.out",
                        scrollTrigger: {
                            trigger: hero,
                            start: "top top",
                            end: "300px",
                            scrub: true,
                        },
                    });
                },
            });
        }
    }, []);

    return (
        <div
            ref={heroRef}
            className="relative h-screen w-full overflow-hidden z-[1]"
        >
            {/* Placeholder Image (Initially Visible) */}
            {!videoLoaded && (
                <div
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://backend.hotumatur.com/wp-content/uploads/2025/01/Hero_Placeholder.webp')" }}
                />
            )}
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-[0]">
                <iframe
                    src="https://player.vimeo.com/video/1041863140?background=1&dnt=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                    className="absolute 
        xl:top-1/2 xl:h-[200%] xl:w-[200%] xl:[aspect-ratio:16/9]
        top-[calc(50%-4px)] left-1/2 w-[177.77777778vh] min-w-full min-h-[calc(100%+6px)] 
        -translate-x-1/2 -translate-y-1/2"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <p className="mb-4 text-center text-xl md:text-2xl font-satisfy text-white">
                    Ven a conocer la magia de Rapa Nui
                </p>
                <FadeIn>
                    <h1 className="mb-10 md:mb-16 text-center text-3xl font-bold text-white md:text-6xl">
                        Aventuras Guiadas por
                        <br />
                        Expertos Locales
                    </h1>
                </FadeIn>
                <div className="w-full max-w-4xl rounded-lg bg-gray-200/20 p-6 py-10 backdrop-blur-sm">
                    <TourSelector />
                </div>

            </div>
        </div>
    );
}