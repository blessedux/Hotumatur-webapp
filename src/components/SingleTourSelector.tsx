'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn, generateFlightLikeId } from '@/lib/utils'
import { format } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useReservations } from '@/context/ReservationContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

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
    const { t, i18n } = useTranslation()

    const dateLocale = i18n.language === 'en' ? enUS : es;

    const handleReservation = () => {
        if (!date) {
            toast({
                title: t('common.error'),
                description: t('booking.errors.selectDateAndTour'),
                variant: "destructive",
            })
            return
        }

        // Validate date is in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (date < today) {
            toast({
                title: t('common.error'),
                description: t('booking.errors.futureDateRequired'),
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
            title: t('booking.success'),
            description: (
                <div className="space-y-2 flex flex-col">
                    <p>{t('booking.confirmationMessage', { tour: tourName, people })}</p>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => router.push('/checkout')}
                    >
                        {t('booking.continue')}
                    </Button>
                </div>
            )
        })

        // Reset form
        setDate(undefined)
        setPeople("2")
    }

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
            <div className="space-y-2">
                <label className="text-lg text-white/80">{t('booking.date')}:</label>
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
                            {date ? format(date, "PPP", { locale: dateLocale }) : t('booking.selectDate')}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={dateLocale}
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
                <label className="text-lg text-white/80">{t('booking.people')}:</label>
                <Select value={people} onValueChange={setPeople}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <SelectValue placeholder={t('booking.selectPeople')} />
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
                {t('booking.reserve')}
            </Button>
        </div>
    )
}