'use client'

import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useState } from "react"
import { useProducts } from "@/hooks/useProducts"

const TourSelector = () => {
    const [date, setDate] = useState<Date>()
    const [people, setPeople] = useState("2")
    const { products, loading, error } = useProducts()

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return (
            <div>Error: {error}</div>
        )
    }

    const tours = products.filter(product =>
        product.categories.some(category => category.name === "Tours")
    );

    return (
        <div>
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
                                <SelectItem key={tour.id} value={tour.name.toLowerCase()}>
                                    {tour.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <label className="text-lg">Cantidad de personas :</label>
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
    )
}

export default TourSelector