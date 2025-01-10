'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageGalleryProps {
    images: string[]
}

export function ImageGallery({ images }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, [images.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
    }, [images.length])

    useEffect(() => {
        const intervalId = setInterval(nextSlide, 5000) // Change slide every 5 seconds
        return () => clearInterval(intervalId)
    }, [nextSlide])

    return (
        <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((src, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <div className="aspect-video relative overflow-hidden">
                            <Image
                                src={src}
                                alt={`Gallery image ${index + 1}`}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 text-gray-800 hover:bg-opacity-75 transition-all"
                onClick={prevSlide}
                aria-label="Previous image"
            >
                <ChevronLeft size={20} />
            </button>
            <button
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 text-gray-800 hover:bg-opacity-75 transition-all"
                onClick={nextSlide}
                aria-label="Next image"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    )
}

