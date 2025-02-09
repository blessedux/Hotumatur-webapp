'use client'

import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

export function SpecialTripsSection() {
    const imageRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Dynamic import of GSAP and ScrollTrigger
        const initializeGSAP = async () => {
            const gsap = (await import('gsap')).default;
            const ScrollTrigger = (await import('gsap/ScrollTrigger')).default;

            gsap.registerPlugin(ScrollTrigger);

            const image = imageRef.current;
            const card = cardRef.current;

            if (!image || !card) return;

            // Image animation
            const imageAnim = gsap.fromTo(image,
                {
                    opacity: 0,
                },
                {
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: image,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Card animation
            const cardAnim = gsap.fromTo(card,
                {
                    opacity: 0,
                    y: 100
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        end: "top 20%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Return cleanup function
            return () => {
                imageAnim.kill();
                cardAnim.kill();
                ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            };
        };

        // Initialize GSAP and store cleanup function
        let cleanup: (() => void) | undefined;
        initializeGSAP().then(cleanupFn => {
            cleanup = cleanupFn;
        });

        // Return cleanup function
        return () => {
            if (cleanup) cleanup();
        };
    }, []);

    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-muted">
            {/* Main Container */}
            <div className="container px-4 md:px-6">
                {/* Image Container */}
                <div
                    ref={imageRef}
                    className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-[-100px] rounded-lg overflow-hidden opacity-0"
                >
                    <img
                        src="https://backend.hotumatur.com/wp-content/uploads/2024/12/Hiking-Rapa-Nui-1024x395-1.webp"
                        alt="Special Trips Background"
                        className="object-cover w-full h-full"
                        style={{
                            objectPosition: "center 25%",
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>

                {/* Card Container */}
                <div
                    ref={cardRef}
                    className="relative z-10 opacity-0"
                >
                    <Card className="w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-sm shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold tracking-tight">
                                Tour a tu medida
                            </CardTitle>
                            <CardDescription>
                                Experiencias personalizadas para estudiantes y grupos corporativos
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Descubre nuestros paquetes exclusivos para viajes estudiantiles y retiros corporativos.
                                Crea recuerdos inolvidables y fortalece los lazos del equipo con experiencias de viaje
                                diseñadas especialmente para ti.
                            </p>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <Button asChild>
                                <Link href="/special-tours">Solicitar Cotización</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </section>
    );
}