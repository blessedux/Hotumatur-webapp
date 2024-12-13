'use client'

import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


const tours = [
    { name: "Tour Isla de Pascua Clásico", href: "/tours/clasico" },
    { name: "Aventura en Rapa Nui", href: "/tours/aventura" },
    { name: "Descubre los Moais", href: "/tours/moais" },
    { name: "Atardecer en Ahu Tahai", href: "/tours/atardecer" },
]

export default function HeroSection() {
    const [date, setDate] = useState<Date>()

    return (
        <div className="relative h-[calc(100dvh-80px)] md:h-[calc(100dvh-132px)] w-full overflow-hidden z-[1]">
            {/* Video Background */}
            <div className="absolute top-0 left-0 w-full h-full z-[0]">
                <iframe
                    src="https://player.vimeo.com/video/1038385534?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
                    className="absolute 
                              xl:top-1/2 xl:h-[200%] xl:w-[200%] xl:[aspect-ratio:16/9]
                              top-[calc(50%-4px)] left-1/2 w-[177.77777778vh] min-w-full min-h-[calc(100%+6px)] 
                              -translate-x-1/2 -translate-y-1/2"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                />
            </div>

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
                <p className="mb-4 text-center text-md md:text-2xl text-white">
                    Ven a conocer la magia de Rapa Nui
                </p>

                <h1 className="mb-10 md:mb-16 text-center text-3xl font-bold text-white md:text-6xl">
                    Aventuras Guiadas por
                    <br />
                    Expertos Locales
                </h1>


                {/* Booking Form */}
                <div className="w-full max-w-4xl rounded-lg bg-gray-200/20 p-6 py-10 backdrop-blur-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Fecha:</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                    >
                                        {date ? date.toLocaleDateString() : "Fecha del tour"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Tour:</label>
                            <Select>
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Selecciona tu aventura" />
                                </SelectTrigger>
                                <SelectContent>
                                    {tours.map((tour) => (
                                        <SelectItem key={tour.name} value={tour.name}>
                                            {tour.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Cantidad de personas:</label>
                            <Select defaultValue="3">
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select number" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-end">
                            <Button className="w-full bg-[#1f45d4] hover:bg-[#1f45d4]/80 text-slate-200">
                                Reservar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

