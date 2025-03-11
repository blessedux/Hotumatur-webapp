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
import { useCart } from '@/context/CartContext'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'

interface SingleTourSelectorProps {
    tourId: number;
    tourName: string;
    tourPrice: number;
    tourImage: string;
}

export default function SingleTourSelector({ tourId, tourName, tourPrice, tourImage }: SingleTourSelectorProps) {
    const [date, setDate] = useState<Date>()
    const [people, setPeople] = useState("2")
    const [email, setEmail] = useState("")
    const { addReservation } = useReservations()
    const { openCart } = useCart()
    const { toast } = useToast()
    const router = useRouter()
    const { t, i18n } = useTranslation(['booking', 'common'])

    const dateLocale = i18n.language === 'en' ? enUS : es;

    const handleReservation = async () => {
        if (!date) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.selectDateAndTour', { ns: 'booking' }),
                variant: "destructive",
            })
            return
        }

        // Validate date is in the future
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (date < today) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.futureDateRequired', { ns: 'booking' }),
                variant: "destructive",
            })
            return
        }

        // Validate email
        if (!email) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.emailRequired', { ns: 'booking' }),
                variant: "destructive",
            })
            return
        }

        // Save lead first
        try {
            const leadResponse = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    tourId,
                    tourName,
                    date: date.toISOString(),
                    people: parseInt(people)
                })
            });

            if (!leadResponse.ok) {
                console.error('Failed to save lead');
            }
        } catch (error) {
            console.error('Error saving lead:', error);
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

        // Open the cart automatically
        openCart()

        toast({
            title: t('success', { ns: 'booking' }),
            description: (
                <div className="space-y-2 flex flex-col">
                    <p>{t('confirmationMessage', { ns: 'booking', tour: tourName, people })}</p>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => router.push('/checkout')}
                    >
                        {t('continue', { ns: 'booking' })}
                    </Button>
                </div>
            )
        })

        // Reset form
        setDate(undefined)
        setPeople("2")
        setEmail("")
    }

    return (
        <div className="grid gap-4 md:grid-cols-[0.5fr_0.5fr_1fr] items-end">
            <div className="space-y-2">
                <label className="text-lg text-white/80">{t('date', { ns: 'booking' })}:</label>
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
                            {date ? format(date, "PPP", { locale: dateLocale }) : t('selectDate', { ns: 'booking' })}
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
                <label className="text-lg text-white/80">{t('people', { ns: 'booking' })}:</label>
                <Select value={people} onValueChange={setPeople}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                        <SelectValue placeholder={t('selectPeople', { ns: 'booking' })} />
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

            <div className="space-y-2">
                <label className="text-lg text-white/80">{t('email', { ns: 'booking' })}:</label>
                <div className="relative ">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('enterEmail', { ns: 'booking' })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 h-[50px] w-full"
                    />
                </div>
            </div>

            <Button
                className="bg-hotumatur-primary text-white/80 hover:bg-hotumatur-primary/80 self-end md:col-span-3"
                onClick={handleReservation}
            >
                {t('reserve', { ns: 'booking' })}
            </Button>
        </div>
    )
}