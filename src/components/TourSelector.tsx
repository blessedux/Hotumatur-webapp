'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, generateFlightLikeId } from '@/lib/utils';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useProducts } from '@/hooks/useProducts';
import { useReservations } from '@/context/ReservationContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import SkeletonForm from '@/components/SkeletonForm';
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { useLanguageChange } from '@/hooks/useLanguageChange';

const TourSelector = () => {
    const [date, setDate] = useState<Date>();
    const [people, setPeople] = useState("2");
    const [email, setEmail] = useState("");
    const [selectedTourId, setSelectedTourId] = useState("");
    const { products: tours, loading, error } = useProducts();
    const { addReservation } = useReservations();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation(['common', 'booking', 'tour_section']);
    // Use our custom hook to ensure re-render on language change
    const currentLanguage = useLanguageChange();

    // Filter tours when data is loaded
    useEffect(() => {
        if (tours) {
            const filtered = tours.filter((product) =>
                product.categories.some((category) => category.name === "Tours")
            );
            setIsLoading(false);
        }
    }, [tours]);

    const handleReservation = async () => {
        if (!date || !selectedTourId) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.selectDateAndTour', { ns: 'booking' }),
                variant: "destructive",
            });
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.futureDateRequired', { ns: 'booking' }),
                variant: "destructive",
            });
            return;
        }

        // Validate email
        if (!email) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.emailRequired', { ns: 'booking' }),
                variant: "destructive",
            });
            return;
        }

        const selectedTour = tours.find((tour) => tour.id.toString() === selectedTourId);

        if (!selectedTour) {
            toast({
                title: t('error', { ns: 'common' }),
                description: t('errors.tourNotFound', { ns: 'booking' }),
                variant: "destructive",
            });
            return;
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
                    tourId: selectedTour.id,
                    tourName: selectedTour.name,
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
            productId: selectedTour.id,
            quantity: parseInt(people, 10),
            name: selectedTour.name,
            price: Number(selectedTour.price) || 0,
            date: date.toISOString(),
            image: selectedTour.images[0]?.src || "/placeholder.svg",
        });

        toast({
            variant: 'success',
            title: t('success', { ns: 'booking' }),
            description: (
                <div className="space-y-2 flex flex-col">
                    <p>{t('confirmationMessage', { ns: 'booking', tour: selectedTour.name, people })}</p>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => router.push('/checkout')}
                    >
                        {t('continue', { ns: 'booking' })}
                    </Button>
                </div>
            ),
        });

        setDate(undefined);
        setSelectedTourId("");
        setPeople("2");
        setEmail("");
    };

    if (loading) {
        return <SkeletonForm />; // Keep SkeletonForm for loading state
    }

    if (error) {
        return <div>{t('error', { ns: 'common' })}: {error}</div>;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const filteredTours = tours.filter((product) =>
        product.categories.some((category) => category.name === "Tours")
    );

    const dateLocale = i18n.language === 'en' ? enUS : es;

    return (
        <div className="grid gap-4 md:grid-cols-[0.5fr_1fr_0.5fr_1fr] items-end">
            <div className="space-y-2">
                <label className="text-lg text-white/80">{t('date', { ns: 'booking' })}:</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                'w-full justify-start text-left font-normal bg-white/10 border-white/20 hover:bg-white/20',
                                !date && 'text-white/60'
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP', { locale: dateLocale }) : t('selectDate', { ns: 'booking' })}
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
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-lg text-white/80">{t('title', { ns: 'tour_section' })}:</label>
                <Select value={selectedTourId} onValueChange={setSelectedTourId}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white/80 hover:bg-white/20">
                        <SelectValue placeholder={t('selectTour', { ns: 'booking' })} />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredTours.map((tour) => (
                            <SelectItem key={tour.id} value={tour.id.toString()}>
                                {tour.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
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
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('enterEmail', { ns: 'booking' })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 hover:bg-white/20 h-[50px] w-full"
                />
            </div>

            <Button
                className="bg-hotumatur-primary text-white/80 hover:bg-hotumatur-primary/80 self-end md:col-span-4"
                onClick={handleReservation}
            >
                {t('reserve', { ns: 'booking' })}
            </Button>
        </div>
    );
};

export default TourSelector;