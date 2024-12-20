'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, generateFlightLikeId } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useReservations } from '@/context/ReservationContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SingleTourSelectorProps {
    tourId: number;
    tourName: string;
    tourPrice: number;
    tourImage: string;
}

export default function SingleTourSelector({ tourId, tourName, tourPrice, tourImage }: SingleTourSelectorProps) {
    const [date, setDate] = useState<Date>()
    const [people, setPeople] = useState("2")
    const { addReservation } = useReservations()
    const { toast } = useToast()
    const router = useRouter()

    const handleReservation = () => {
        if (!date) {
            toast({
                title: "Error",
                description: "Por favor selecciona una fecha para el tour",
                variant: "destructive",
            })
            return
        }

        // Validar que la fecha sea posterior a hoy
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (date < today) {
            toast({
                title: "Error",
                description: "La fecha seleccionada debe ser posterior a hoy",
                variant: "destructive",
            })
            return
        }

        const reservationId = generateFlightLikeId();

        addReservation({
            id: reservationId,
            productId: tourId,
            quantity: parseInt(people),
            name: tourName,
            price: tourPrice,
            date: date.toISOString(),
            image: tourImage
        })

        toast({
            title: "¡Reserva exitosa!",
            description: (
                <div className="space-y-2 flex flex-col">
                    <p>{`Has reservado ${tourName} para ${people} personas`}</p>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => router.push('/checkout')}
                    >
                        Continuar la compra
                    </Button>
                </div>
            )
        })

        // Resetear el formulario
        setDate(undefined)
        setPeople("2")
    }

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
            <div className="space-y-2">
                <label className="text-lg text-white/80">Fecha:</label>
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
                            disabled={(date) => {
                                const today = new Date()
                                today.setHours(0, 0, 0, 0)
                                return date < today
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-lg text-white/80">Personas:</label>
                <Select value={people} onValueChange={setPeople}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <SelectValue placeholder="Número de personas" />
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

            <Button
                className="bg-hotumatur-primary text-white/80 hover:bg-hotumatur-primary/80 self-end"
                onClick={handleReservation}
            >
                Reservar
            </Button>
        </div>
    )
}