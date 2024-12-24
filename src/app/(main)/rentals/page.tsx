'use client';

import React from 'react';
import Image from 'next/image'; // Import the Next.js Image component
import RentalsHero from '@/components/RentalsHero';
import NewsletterSection from '@/components/NewsletterSection';

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
        title: 'Aventura de Snorkel',
        description: 'Descubre la belleza submarina con nuestras excursiones guiadas de snorkel.',
        image: '/images/snorkel-rental.webp',
        whatsappText: 'Hola, estoy interesado en la Aventura de Snorkel. ¿Me pueden dar más detalles?',
    },
    {
        id: 2,
        title: 'Alquiler de Autos',
        description: 'Explora la isla a tu propio ritmo con nuestras confiables opciones de alquiler de autos.',
        image: '/images/SS-4.webp',
        whatsappText: 'Hola, me gustaría alquilar un auto. ¿Me pueden dar más detalles?',
    },
    {
        id: 3,
        title: 'Paseo en Cuatrimoto',
        description: 'Siente la adrenalina con un emocionante paseo en cuatrimoto.',
        image: '/images/ATV-rental.webp',
        whatsappText: 'Hola, estoy interesado en reservar un Paseo en Cuatrimoto. ¿Me pueden dar más detalles?',
    },
    {
        id: 4,
        title: 'Cabalgata',
        description: 'Disfruta de vistas increíbles a caballo con nuestros recorridos guiados.',
        image: '/images/Cabalgata-rental.webp',
        whatsappText: 'Hola, estoy interesado en la Cabalgata. ¿Me pueden dar más detalles?',
    },
    {
        id: 5,
        title: 'Paseo en bote',
        description: 'Relájate y contempla los paisajes con nuestros serenos paseos en barco.',
        image: '/images/Motu-Tours.webp',
        whatsappText: 'Hola, me gustaría reservar un Paseo en Barco. ¿Me pueden dar más detalles?',
    },
];

const RentalsPage: React.FC = () => {
    const openWhatsApp = (text: string): void => {
        const phoneNumber = '+56962064520'; // Replace with your WhatsApp phone number
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank');
    };
    return (

        <div className="min-h-screen">

            <RentalsHero />
            <div className="p-4 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6 mt-40">Nuestras Experiencias</h1>
                <div className="space-y-8">
                    {rentals.map((rental) => (
                        <div
                            key={rental.id}
                            className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden h-[30vh] md:h-[35vh] lg:h-[40vh]" // Adjust height here
                        >
                            {/* Image */}
                            <div className="flex-shrink-0 h-full w-[40%] md:w-[35%] lg:w-[30%] relative">
                                <Image
                                    src={rental.image}
                                    alt={rental.title}
                                    fill // Automatically adjusts width and height
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6">
                                <h2 className="text-xl font-semibold">{rental.title}</h2>
                                <p className="text-gray-600 mb-4">{rental.description}</p>
                                <button
                                    onClick={() => openWhatsApp(rental.whatsappText)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-green-600"
                                >
                                    Reservar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <NewsletterSection />
        </div>

    );
};

export default RentalsPage;