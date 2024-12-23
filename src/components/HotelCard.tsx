'use client'
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/nosotros/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";

export default function HotelCard() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const images = [
        "https://backend.hotumatur.com/wp-content/uploads/2024/12/tupa-hotel.webp",
        "https://backend.hotumatur.com/wp-content/uploads/2024/12/Foto_Portada-2-scaled-pzqr5y7mox8qskdcpnycpfepe8s6ygso1obixng6io.webp",
        "https://backend.hotumatur.com/wp-content/uploads/2024/12/PC090024-scaled-pzqqzsdpw0t2olbkp02eczdx7b5khwc0j6cxocl3b4.webp",
    ];

    // Auto-gallery logic
    useEffect(() => {
        startInterval();
        return () => stopInterval(); // Cleanup on unmount
    }, [images.length]);

    const startInterval = () => {
        intervalRef.current = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
    };

    const stopInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    return (
        <Card className="overflow-hidden max-w-4xl mx-auto bg-[#2D2D2D] text-white rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                {/* Left Section: Image Gallery */}
                <div
                    className="relative w-full md:w-[400px] h-[300px] rounded-lg overflow-hidden"
                    onMouseEnter={stopInterval}
                    onMouseLeave={startInterval}
                >
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={image}
                            alt={`Hotel Image ${index + 1}`}
                            fill
                            className={`object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"
                                }`}
                            priority={index === 0}
                        />
                    ))}
                </div>

                {/* Right Section: Content */}
                <CardContent className="flex-1 flex flex-col justify-center space-y-4">
                    {/* Badge */}
                    <Badge className="w-fit bg-[#00AA6C] text-white rounded-sm">HOTEL</Badge>

                    {/* Title */}
                    <h3 className="text-2xl font-bold hover:underline cursor-pointer">
                        Tupa Hotel
                    </h3>

                    {/* Star Ratings and Reviews */}
                    <div className="flex items-center gap-2">
                        {/* Stars */}
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-[#00AA6C] text-[#00AA6C]" />
                            ))}
                            <Star className="w-5 h-5 text-[#00AA6C] stroke-[#00AA6C] fill-transparent" />
                        </div>
                        {/* Review Count */}
                        <span className="text-lg font-medium text-gray-300">249</span>
                    </div>

                    {/* Location and Additional Information */}
                    <div className="space-y-2">
                        <p className="text-lg font-semibold">Hanga Roa, Chile</p>
                        <p className="text-gray-400">249 reseñas y opiniones en TripAdvisor</p>
                    </div>

                    {/* Call to Action */}
                    <div>
                        <Button
                            asChild
                            className="bg-[#00AA6C] hover:bg-[#008653] text-white rounded-md"
                        >
                            <Link
                                href="https://www.tripadvisor.co/Hotel_Review-g1049073-d1603483-Reviews-Tupa_Hotel-Hanga_Roa_Easter_Island.html"
                                target="_blank"
                            >
                                Visita en TripAdvisor
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}