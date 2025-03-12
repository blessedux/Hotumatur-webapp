'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { FaTripadvisor } from "react-icons/fa"
import FadeIn from './FadeIn'
import { useTranslation } from 'react-i18next'
import { useDirectTranslation } from '@/hooks/useTranslatedText'

interface TestimonialProps {
    name: string;
    location: string;
    image: string;
    rating: number;
    text: string;
    date: string;
    tripAdvisorLink?: string;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? "fill-primary text-primary" : "fill-muted text-muted"
                        }`}
                />
            ))}
        </div>
    )
}

function TestimonialCard({ name, location, image, rating, text, date, tripAdvisorLink }: TestimonialProps) {
    return (
        <Card className="bg-primary/10 border-none h-full flex flex-col relative">
            <CardHeader className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={image} alt={name} />
                        <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-sm text-muted-foreground">{location}</p>
                    </div>
                </div>
                <StarRating rating={rating} />
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-base">{text}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">{date}</p>
            </CardFooter>
            {tripAdvisorLink && (
                <a
                    href={tripAdvisorLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4"
                >
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2 px-4 py-2 text-sm"
                    >
                        <FaTripadvisor className="w-4 h-4" />
                        TripAdvisor
                    </Button>
                </a>
            )}
        </Card>
    )
}

export default function Testimonials() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [AutoPlay()])
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
    const { t } = useTranslation('common')

    // Use our custom hook for direct translations
    const titleText = useDirectTranslation(
        "What Our Clients Say",
        "Lo Que Dicen Nuestros Clientes"
    );

    const subtitleText = useDirectTranslation(
        "Unforgettable Experiences in Rapa Nui",
        "Experiencias Inolvidables en Rapa Nui"
    );

    const prevText = useDirectTranslation(
        "Previous",
        "Anterior"
    );

    const nextText = useDirectTranslation(
        "Next",
        "Siguiente"
    );

    // Testimonial locations
    const ccLocationText = useDirectTranslation(
        "United States",
        "Estados Unidos"
    );

    const olgaLocationText = useDirectTranslation(
        "United States",
        "Estados Unidos"
    );

    const sergioLocationText = useDirectTranslation(
        "Chile",
        "Chile"
    );

    const fenonoLocationText = useDirectTranslation(
        "Chile",
        "Chile"
    );

    const cisternistaLocationText = useDirectTranslation(
        "Chile",
        "Chile"
    );

    const marioLocationText = useDirectTranslation(
        "Chile",
        "Chile"
    );

    // Testimonial texts
    const ccText = useDirectTranslation(
        "We had a wonderful time with Hotumatur. Our guide was knowledgeable and passionate about the island's history and culture. Highly recommended!",
        "Tuvimos un tiempo maravilloso con Hotumatur. Nuestro guía era conocedor y apasionado por la historia y cultura de la isla. ¡Muy recomendable!"
    );

    const olgaText = useDirectTranslation(
        "The tour was amazing! We learned so much about the Moai and the ancient Rapa Nui civilization. The guides were friendly and professional.",
        "¡El tour fue increíble! Aprendimos mucho sobre los Moai y la antigua civilización Rapa Nui. Los guías fueron amables y profesionales."
    );

    const sergioText = useDirectTranslation(
        "An unforgettable experience exploring Easter Island with Hotumatur. The sunset tour was particularly magical.",
        "Una experiencia inolvidable explorando Isla de Pascua con Hotumatur. El tour del atardecer fue particularmente mágico."
    );

    const fenonoText = useDirectTranslation(
        "The best way to discover Rapa Nui! Our guide shared fascinating stories and took us to places we wouldn't have found on our own.",
        "¡La mejor manera de descubrir Rapa Nui! Nuestro guía compartió historias fascinantes y nos llevó a lugares que no habríamos encontrado por nuestra cuenta."
    );

    const cisternistaText = useDirectTranslation(
        "Excellent service from start to finish. The team at Hotumatur made our trip to Easter Island truly special.",
        "Excelente servicio de principio a fin. El equipo de Hotumatur hizo que nuestro viaje a Isla de Pascua fuera realmente especial."
    );

    const marioText = useDirectTranslation(
        "We booked several tours with Hotumatur and each one exceeded our expectations. Their knowledge of the island is impressive.",
        "Reservamos varios tours con Hotumatur y cada uno superó nuestras expectativas. Su conocimiento de la isla es impresionante."
    );

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

    const onSelect = useCallback(() => {
        if (!emblaApi) return
        setPrevBtnEnabled(emblaApi.canScrollPrev())
        setNextBtnEnabled(emblaApi.canScrollNext())
    }, [emblaApi])

    useEffect(() => {
        if (!emblaApi) return
        onSelect()
        emblaApi.on('select', onSelect)
    }, [emblaApi, onSelect])

    const testimonials = [
        {
            name: "C.C.",
            location: ccLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/C.C-profile.webp",
            rating: 5,
            text: ccText,
            date: "May 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/S3091BKchrisc",
        },
        {
            name: "Olga S",
            location: olgaLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/OlgaS_profile.webp",
            rating: 5,
            text: olgaText,
            date: "May 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/D3506MZolgas",
        },
        {
            name: "Sergio Ignacio A",
            location: sergioLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/default-avatar-2020-44.webp",
            rating: 5,
            text: sergioText,
            date: "May 2023",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/sergioignacioa",
        },
        {
            name: "Feñoño",
            location: fenonoLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/fenono-avatar.webp",
            rating: 5,
            text: fenonoText,
            date: "Oct 2023",
            tripAdvisorLink: "https://www.tripadvisor.com/ShowUserReviews-g316040-d26626022-r920889084-Hotumatur_RapaNui-Easter_Island.html",
        },
        {
            name: "Cisternista",
            location: cisternistaLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/cisternista.webp",
            rating: 5,
            text: cisternistaText,
            date: "December 11, 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/AttractionProductReview-g1049073-d26766354-Full_Day_Tour_in_Rapa_Nui-Hanga_Roa_Easter_Island.html",
        },
        {
            name: "Mario B",
            location: marioLocationText,
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/mario-b.webp",
            rating: 5,
            text: marioText,
            date: "December 4, 2024",
        },
    ]

    return (
        <div className="bg-primary-900 px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl space-y-12">
                <FadeIn>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-black">
                            {titleText}
                        </h2>
                        <p className="text-2xl md:text-4xl font-bold font-satisfy text-black">
                            {subtitleText}
                        </p>
                    </div>
                </FadeIn>
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="flex-[0_0_100%] min-w-0 pl-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                                    <TestimonialCard {...testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm"
                        onClick={scrollPrev}
                        disabled={!prevBtnEnabled}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">{prevText}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm"
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">{nextText}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}