import { Waves } from 'lucide-react'
import Image from 'next/image'

import { FaMotorcycle } from "react-icons/fa6";
import { BsBicycle } from "react-icons/bs";
import { MdOutlineDirectionsCar } from "react-icons/md";
import FadeIn from './FadeIn';



export default function ServicesSection() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-8 bg-white text-black max-w-6xl mx-auto">
            {/* Left Column - Services */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                        Servicios Adicionales para una Experiencia Completa
                    </h2>
                    <p className="text-lg text-gray-600">
                        Vive tu expericia en Isla de Pascua a tu propio ritmo. Disfruta de la aventura y la libertad de moverte por la isla.
                    </p>
                </div>

                <div className="grid">

                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <MdOutlineDirectionsCar className="w-6 h-6 text-gray-600" />
                            </div>

                            <span>Arriendo de autos</span>

                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <FaMotorcycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>Arriendo de cuatrimotos</span>
                        </div>
                    </FadeIn>
                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <BsBicycle className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>Arriendo de bicicletas</span>
                        </div>
                    </FadeIn>

                    <FadeIn>
                        <div className="flex items-center gap-4 p-2">
                            <div className="p-2 rounded-lg">
                                <Waves className="w-6 h-6 text-gray-600" />
                            </div>
                            <span>Arriendo de snorkel</span>
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