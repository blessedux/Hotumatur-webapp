'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
// } from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

const tours = [
    "Tour Arqueológico",
    "Tour de Playas",
    "Tour de Moais",
    "Tour de Atardecer",
    "Tour Volcánico",
]

export default function BookingForm() {
    const [date, setDate] = useState<Date>()
    // const [open, setOpen] = useState(false)
    const [people, setPeople] = useState("3")

    return (
        <div className="relative w-full bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-[#1f45d4] to-[#327ef8]" />
            <div className="absolute inset-0 bg-[url('/images/pattern-flowers-2.png')] bg-repeat opacity-10" />
            <div className="relative mx-auto max-w-4xl px-4 py-32 text-white">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold mb-4">Reserva tu Aventura</h1>
                    <p className="text-xl text-white/90">
                        Vive momentos inolvidables en Rapa Nui, con experiencias diseñadas a tu medida
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_1fr_auto] items-end">
                    <div className="space-y-2">
                        <label className="text-lg">Fecha :</label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-white/10 border-white/20 hover:bg-white/20",
                                        !date && "text-white/60"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP", { locale: es }) : "Fecha del tour"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    locale={es}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg">Tour:</label>
                        <Select>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white/60 hover:bg-white/20">
                                <SelectValue placeholder="Selecciona tu aventura" />
                            </SelectTrigger>
                            <SelectContent>
                                {tours.map((tour) => (
                                    <SelectItem key={tour} value={tour.toLowerCase()}>
                                        {tour}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-lg">Number of people :</label>
                        <Select value={people} onValueChange={setPeople}>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20">
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

                    <Button className="bg-white text-teal-800 hover:bg-white/90 self-end">
                        Reservar
                    </Button>
                </div>

            </div>
        </div>
    )
}

