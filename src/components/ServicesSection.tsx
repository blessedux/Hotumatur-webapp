'use client';

import { Waves } from 'lucide-react'
import Image from 'next/image'


import { FaMotorcycle } from "react-icons/fa6";
import { BsBicycle } from "react-icons/bs";
import { MdOutlineDirectionsCar } from "react-icons/md";
import FadeIn from './FadeIn';
import { useDirectTranslation } from '@/hooks/useTranslatedText';



export default function ServicesSection() {
    // Use our custom hook for direct translations
    const titleText = useDirectTranslation(
        "Our Services",
        "Nuestros Servicios"
    );

    const descriptionText = useDirectTranslation(
        "We offer a variety of services to make your stay in Rapa Nui unforgettable. From guided tours to equipment rentals, we have everything you need.",
        "Ofrecemos una variedad de servicios para hacer tu estadía en Rapa Nui inolvidable. Desde tours guiados hasta alquiler de equipos, tenemos todo lo que necesitas."
    );

    const carRentalText = useDirectTranslation(
        "Car Rental",
        "Alquiler de Autos"
    );

    const atvRentalText = useDirectTranslation(
        "ATV Rental",
        "Alquiler de Cuatrimotos"
    );

    const bikeRentalText = useDirectTranslation(
        "Bike Rental",
        "Alquiler de Bicicletas"
    );

    const snorkelRentalText = useDirectTranslation(
        "Snorkel Equipment",
        "Equipo de Snorkel"
    );

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-8 bg-white text-black max-w-6xl mx-auto">
            {/* Left Column - Services */}
            <div className="space-y-6">
                <FadeIn>
                    <div className="space-y-4">
                        <h2 className="text-3xl lg:text-4xl font-bold font-satisfy leading-tight">
                            {titleText}
                        </h2>

                        <p className="text-lg text-gray-600">
                            {descriptionText}
                        </p>
                    </div>
                </FadeIn>

                <div className="grid">
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <MdOutlineDirectionsCar className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{carRentalText}</span>
                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <FaMotorcycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{atvRentalText}</span>
                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <BsBicycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{bikeRentalText}</span>
                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <Waves className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{snorkelRentalText}</span>
                        </div>
                    </FadeIn>
                </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative aspect-square lg:aspect-auto">
                <Image
                    src="/images/couple-snorkeling.webp"
                    alt="Couple snorkeling"
                    className="rounded-lg object-cover w-full h-full"
                    width={600}
                    height={600}
                    loading="lazy"
                />
            </div>
        </div>
    )
}