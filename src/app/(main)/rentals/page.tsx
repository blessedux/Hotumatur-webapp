"use client";

import React from "react";
import Image from "next/image";
import RentalsHero from "@/components/RentalsHero";
import NewsletterSection from "@/components/NewsletterSection";

interface Rental {
    id: number;
    title: string;
    description: string;
    image: string;
    whatsappText: string;
}

const rentals: Rental[] = [
    {
        id: 1,
        title: "Aventura de Snorkel",
        description: "Descubre la belleza submarina con nuestras excursiones guiadas de snorkel.",
        image: "/images/snorkel-rental.webp",
        whatsappText: "Hola, estoy interesado en la Aventura de Snorkel. ¿Me pueden dar más detalles?",
    },
    {
        id: 2,
        title: "Alquiler de Autos",
        description: "Explora la isla a tu propio ritmo con nuestras confiables opciones de alquiler de autos.",
        image: "/images/SS-4.webp",
        whatsappText: "Hola, me gustaría alquilar un auto. ¿Me pueden dar más detalles?",
    },
    {
        id: 3,
        title: "Paseo en Cuatrimoto",
        description: "Siente la adrenalina con un emocionante paseo en cuatrimoto.",
        image: "/images/ATV-rental.webp",
        whatsappText: "Hola, estoy interesado en reservar un Paseo en Cuatrimoto. ¿Me pueden dar más detalles?",
    },
    {
        id: 4,
        title: "Cabalgata",
        description: "Disfruta de vistas increíbles a caballo con nuestros recorridos guiados.",
        image: "/images/Cabalgata-rental.webp",
        whatsappText: "Hola, estoy interesado en la Cabalgata. ¿Me pueden dar más detalles?",
    },
    {
        id: 5,
        title: "Paseo en bote",
        description: "Relájate y contempla los paisajes con nuestros serenos paseos en barco.",
        image: "/images/Motu-Tours.webp",
        whatsappText: "Hola, me gustaría reservar un Paseo en Barco. ¿Me pueden dar más detalles?",
    },
];

const RentalsPage: React.FC = () => {
    const openWhatsApp = (text: string): void => {
        const phoneNumber = "+56998897762";
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <RentalsHero />

            <div className="p-4 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-12 mt-40">Nuestras Experiencias</h1>

                {/* Grid Layout for Rentals */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
                        >
                            {/* Image */}
                            <div className="relative w-full h-[250px]">
                                <Image
                                    src={rental.image}
                                    alt={rental.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="p-6 text-center">
                                <h2 className="text-xl font-semibold">{rental.title}</h2>
                                <p className="text-gray-600 mb-4">{rental.description}</p>
                                <button
                                    onClick={() => openWhatsApp(rental.whatsappText)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600 transition-all"
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Newsletter Section */}
            <NewsletterSection />
        </div>
    );
};

export default RentalsPage;