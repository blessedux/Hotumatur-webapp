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
    const { t } = useTranslation()

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
            location: t('testimonials.reviews.cc.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/C.C-profile.webp",
            rating: 5,
            text: t('testimonials.reviews.cc.text'),
            date: "May 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/S3091BKchrisc",
        },
        {
            name: "Olga S",
            location: t('testimonials.reviews.olga.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/OlgaS_profile.webp",
            rating: 5,
            text: t('testimonials.reviews.olga.text'),
            date: "May 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/D3506MZolgas",
        },
        {
            name: "Sergio Ignacio A",
            location: t('testimonials.reviews.sergio.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/default-avatar-2020-44.webp",
            rating: 5,
            text: t('testimonials.reviews.sergio.text'),
            date: "May 2023",
            tripAdvisorLink: "https://www.tripadvisor.com/Profile/sergioignacioa",
        },
        {
            name: "Feñoño",
            location: t('testimonials.reviews.fenono.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/fenono-avatar.webp",
            rating: 5,
            text: t('testimonials.reviews.fenono.text'),
            date: "Oct 2023",
            tripAdvisorLink: "https://www.tripadvisor.com/ShowUserReviews-g316040-d26626022-r920889084-Hotumatur_RapaNui-Easter_Island.html",
        },
        {
            name: "Cisternista",
            location: t('testimonials.reviews.cisternista.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/cisternista.webp",
            rating: 5,
            text: t('testimonials.reviews.cisternista.text'),
            date: "December 11, 2024",
            tripAdvisorLink: "https://www.tripadvisor.com/AttractionProductReview-g1049073-d26766354-Full_Day_Tour_in_Rapa_Nui-Hanga_Roa_Easter_Island.html",
        },
        {
            name: "Mario B",
            location: t('testimonials.reviews.mario.location'),
            image: "https://backend.hotumatur.com/wp-content/uploads/2024/12/mario-b.webp",
            rating: 5,
            text: t('testimonials.reviews.mario.text'),
            date: "December 4, 2024",
        },
    ]

    return (
        <div className="bg-primary-900 px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl space-y-12">
                <FadeIn>
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-black">
                            {t('testimonials.title')}
                        </h2>
                        <p className="text-2xl md:text-4xl font-bold font-satisfy text-black">
                            {t('testimonials.subtitle')}
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
                        <span className="sr-only">{t('testimonials.prev')}</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm"
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">{t('testimonials.next')}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}