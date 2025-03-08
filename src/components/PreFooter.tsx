'use client';

import TourSelector from '@/components/TourSelector'
import { useTranslation } from 'react-i18next';


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

    // For debugging
    console.log('PreFooter title translation key:', 'pre_footer.title');
    console.log('PreFooter title translation value:', t('pre_footer.title'));
    console.log('PreFooter description translation key:', 'pre_footer.description');
    console.log('PreFooter description translation value:', t('pre_footer.description'));

    return (
        <div className="relative w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f45d4] to-[#327ef8]" />
            <div className="absolute inset-0 bg-[url('/images/pattern-flowers-2.png')] bg-repeat opacity-10" />
            <div className="relative mx-auto max-w-4xl px-4 py-32 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">{t('pre_footer.title')}</h1>
                    <p className="text-xl text-white/90">
                        {t('pre_footer.description')}
                    </p>
                </div>

                <TourSelector />

            </div>
        </div>
    )
}

