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

    // Original testimonial locations
    const ccLocationText = useDirectTranslation(
        "Miami Beach, FL",
        "Miami Beach, FL"
    );

    const olgaLocationText = useDirectTranslation(
        "Miami Beach, FL",
        "Miami Beach, FL"
    );

    const sergioLocationText = useDirectTranslation(
        "Santiago, Chile",
        "Santiago, Chile"
    );

    const fenonoLocationText = useDirectTranslation(
        "Santiago, Chile",
        "Santiago, Chile"
    );

    const cisternistaLocationText = useDirectTranslation(
        "Veniano, Italy",
        "Veniano, Italia"
    );

    const marioLocationText = useDirectTranslation(
        "Santiago, Chile",
        "Santiago, Chile"
    );

    // Original testimonial texts
    const ccText = useDirectTranslation(
        "Fantastic tour! Enzo was amazing tour guide: knowledgeable, kind, and excellent English. AC van and the time spent at each site was timed perfectly! Highly recommend this tour of the South Easter Island.",
        "¡Tour fantástico! Enzo fue un guía turístico increíble: conocedor, amable y con excelente inglés. La camioneta con aire acondicionado y el tiempo dedicado a cada sitio fue perfectamente cronometrado. Recomiendo encarecidamente este tour por el sur de Isla de Pascua."
    );

    const olgaText = useDirectTranslation(
        "Amazing tour guide, very knowledgeable, pleasant, attentive. He answered every single question in full detail. Me and my wife were very happy with our guide!",
        "Guía turístico increíble, muy conocedor, agradable y atento. Respondió a cada pregunta con todo detalle. ¡Mi esposa y yo estuvimos muy contentos con nuestro guía!"
    );

    const sergioText = useDirectTranslation(
        "I went with my partner and we received an excellent welcome from Hotumatur and Hotel Tupa. They showed us the most impressive places on the island, always in a close and personal manner, making you appreciate the place in a way that stays with you forever in your memory. I recommend them 100%.",
        "Fui con mi pareja y recibimos una excelente acogida por parte de Hotumatur y Hotel Tupa. Nos mostraron los lugares más impresionantes de la isla, siempre de manera cercana y personal, haciendo que aprecies el lugar de una manera que permanece para siempre en tu memoria. Los recomiendo 100%."
    );

    const fenonoText = useDirectTranslation(
        "Pretty friendly, excellent service!! From the very first day they have helped me a lot, we went there with any plan set, thanks to them we took advantage of the whole stay, knowing new places of the island every single day. Also, after the tours we have with them great moments and share good meals.",
        "¡Muy amables, excelente servicio! Desde el primer día me han ayudado mucho, fuimos sin ningún plan establecido, gracias a ellos aprovechamos toda la estadía, conociendo nuevos lugares de la isla cada día. Además, después de los tours tuvimos con ellos grandes momentos y compartimos buenas comidas."
    );

    const cisternistaText = useDirectTranslation(
        "Excellent tour with Hotumatur! Our guide was very knowledgeable and passionate about the island's history and culture. We visited all the main sites and learned so much. Highly recommended!",
        "¡Excelente tour con Hotumatur! Nuestro guía era muy conocedor y apasionado por la historia y cultura de la isla. Visitamos todos los sitios principales y aprendimos muchísimo. ¡Muy recomendable!"
    );

    const marioText = useDirectTranslation(
        "We had an amazing experience with Hotumatur. The guides were friendly, professional, and very knowledgeable about the island's history and culture. The tours were well-organized and we got to see all the main attractions. Highly recommended!",
        "Tuvimos una experiencia increíble con Hotumatur. Los guías fueron amables, profesionales y muy conocedores de la historia y cultura de la isla. Los tours estuvieron bien organizados y pudimos ver todas las principales atracciones. ¡Muy recomendable!"
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