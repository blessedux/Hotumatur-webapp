'use client'

import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoPlay from 'embla-carousel-autoplay'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface TestimonialProps {
    name: string
    location: string
    image: string
    rating: number
    text: string
    date: string
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

function TestimonialCard({ name, location, image, rating, text, date }: TestimonialProps) {
    return (
        <Card className="bg-primary/10 border-none h-full flex flex-col">
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
            <CardFooter>
                <p className="text-sm text-muted-foreground">{date}</p>
            </CardFooter>
        </Card>
    )
}

export default function Testimonials() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [AutoPlay()])
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

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
            name: "Josh",
            location: "Miami Beach, FL",
            image: "/placeholder.svg?height=64&width=64",
            rating: 5,
            text: "Amazing stay! The place was spotless, and the host was super friendly. Perfect location—close to everything but still quiet and relaxing. Will definitely come back!",
            date: "February 16, 2023",
        },
        {
            name: "Josh",
            location: "Miami Beach, FL",
            image: "/placeholder.svg?height=64&width=64",
            rating: 5,
            text: "Loved it! The home was cozy and had everything we needed. The view from the balcony was breathtaking, and check-in was a breeze. Highly recommend!",
            date: "February 16, 2023",
        },
        {
            name: "Josh",
            location: "Miami Beach, FL",
            image: "/placeholder.svg?height=64&width=64",
            rating: 5,
            text: "Fantastic experience! The property exceeded our expectations—clean, comfortable, and well-equipped. The host went above and beyond to make us feel welcome. Five stars!",
            date: "February 16, 2023",
        },
        {
            name: "Emma",
            location: "New York, NY",
            image: "/placeholder.svg?height=64&width=64",
            rating: 5,
            text: "Absolutely wonderful! The attention to detail in this property is outstanding. From the moment we arrived, we felt at home. The local recommendations provided by the host were spot on. Can't wait to return!",
            date: "March 22, 2023",
        },
        {
            name: "Carlos",
            location: "Los Angeles, CA",
            image: "/placeholder.svg?height=64&width=64",
            rating: 5,
            text: "An unforgettable stay! The property's unique charm and modern amenities created the perfect balance. The host's responsiveness and the seamless check-in process made our vacation stress-free from start to finish.",
            date: "April 5, 2023",
        },
    ]

    return (
        <div className="bg-primary-900 px-4 py-16 md:py-24">
            <div className="mx-auto max-w-6xl space-y-12">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold text-black">
                        Experiencias Reales:
                    </h2>
                    <p className="text-2xl md:text-4xl font-bold text-black">
                        Opiniones de Nuestros Clientes
                    </p>
                </div>
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={scrollPrev}
                        disabled={!prevBtnEnabled}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Previous slide</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
                        onClick={scrollNext}
                        disabled={!nextBtnEnabled}
                    >
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Next slide</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}