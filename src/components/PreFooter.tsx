'use client';

import TourSelector from '@/components/TourSelector'
import { useTranslation } from 'react-i18next';
import { useDirectTranslation } from '@/hooks/useTranslatedText';


// const tours = [
//     "Tour Arqueológico",
//     "Tour de Playas",
//     "Tour de Moais",
//     "Tour de Atardecer",
//     "Tour Volcánico",
// ]

export default function BookingForm() {
    // Specify 'common' as the namespace
    const { t } = useTranslation('common');

    // Use our custom hook for direct translations
    const titleText = useDirectTranslation(
        "Plan Your Adventure",
        "Planifica Tu Aventura"
    );

    const descriptionText = useDirectTranslation(
        "Choose from our selection of tours and experiences to discover the magic of Rapa Nui",
        "Elige entre nuestra selección de tours y experiencias para descubrir la magia de Rapa Nui"
    );

    return (
        <div className="relative w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f45d4] to-[#327ef8]" />
            <div className="absolute inset-0 bg-[url('/images/pattern-flowers-2.png')] bg-repeat opacity-10" />
            <div className="relative mx-auto max-w-4xl px-4 py-32 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">{titleText}</h1>
                    <p className="text-xl text-white/90">
                        {descriptionText}
                    </p>
                </div>

                <TourSelector />

            </div>
        </div>
    )
}

