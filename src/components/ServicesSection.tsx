'use client';

import { Waves } from 'lucide-react'
import Image from 'next/image'


import { FaMotorcycle } from "react-icons/fa6";
import { BsBicycle } from "react-icons/bs";
import { MdOutlineDirectionsCar } from "react-icons/md";
import FadeIn from './FadeIn';
import { useTranslation } from 'react-i18next';



export default function ServicesSection() {
    // Specify 'common' as the namespace
    const { t } = useTranslation('common');

    // For debugging
    console.log('Services title translation key:', 'services_section.title');
    console.log('Services title translation value:', t('services_section.title'));
    console.log('Services description translation key:', 'services_section.description');
    console.log('Services description translation value:', t('services_section.description'));

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-8 bg-white text-black max-w-6xl mx-auto">
            {/* Left Column - Services */}
            <div className="space-y-6">
                <FadeIn>
                    <div className="space-y-4">

                        <h2 className="text-3xl lg:text-4xl font-bold font-satisfy leading-tight">
                            {t('services_section.title')}
                        </h2>

                        <p className="text-lg text-gray-600">
                            {t('services_section.description')}
                        </p>
                    </div>
                </FadeIn>

                <div className="grid">

                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <MdOutlineDirectionsCar className="w-6 h-6 text-gray-600" />
                            </div>

                            <span>{t('services_section.rentals.car')}</span>

                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <FaMotorcycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{t('services_section.rentals.atv')}</span>
                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <BsBicycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{t('services_section.rentals.bike')}</span>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <Waves className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>{t('services_section.rentals.snorkel')}</span>
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