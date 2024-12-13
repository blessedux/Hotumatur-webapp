import { Plane, Palmtree, Car, Waves } from 'lucide-react'
import Image from 'next/image'


export default function ServicesSection() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 items-center p-6 lg:p-8 bg-white text-black">
            {/* Left Column - Services */}
            <div className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
                        Servicios Adicionales para una Experiencia Completa
                    </h2>
                    <p className="text-lg text-gray-600">
                        Todo lo que necesitas para hacer de tu experiencia en Rapa Nui divertida e inolvidable.
                    </p>
                </div>

                <div className="grid gap-4">
                    <div className="flex items-center gap-4 p-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Waves className="w-6 h-6 text-gray-600" />
                        </div>
                        <span>Arriendo de snorkel</span>
                    </div>

                    <div className="flex items-center gap-4 p-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Car className="w-6 h-6 text-gray-600" />
                        </div>
                        <span>Arriendo de cuadrimotos</span>
                    </div>

                    <div className="flex items-center gap-4 p-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Plane className="w-6 h-6 text-gray-600" />
                        </div>
                        <span>Taxi desde y hacia el aeropuerto</span>
                    </div>

                    <div className="flex items-center gap-4 p-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Palmtree className="w-6 h-6 text-gray-600" />
                        </div>
                        <span>Clases de surf</span>
                    </div>
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
                />
            </div>
        </div>
    )
}