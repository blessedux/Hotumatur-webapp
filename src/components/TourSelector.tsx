'use client';

import { useState } from 'react';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn, generateFlightLikeId } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useProducts } from '@/hooks/useProducts';
import { useReservations } from '@/context/ReservationContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const TourSelector = () => {
    const [date, setDate] = useState<Date>();
    const [people, setPeople] = useState('2');
    const [selectedTourId, setSelectedTourId] = useState('');
    const { products: tours = [], loading, error } = useProducts(); // Ensure tours is always an array
    const { addReservation } = useReservations();
    const { toast } = useToast();
    const router = useRouter();

    const handleReservation = () => {
        if (!date || !selectedTourId) {
            toast({
                title: 'Error',
                description: 'Por favor selecciona una fecha y un tour',
                variant: 'destructive',
            });
            return;
        }

        // Validate that the selected date is not in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            toast({
                title: 'Error',
                description: 'La fecha seleccionada debe ser posterior a hoy',
                variant: 'destructive',
            });
            return;
        }

        const selectedTour = tours.find((tour) => tour.id.toString() === selectedTourId);

        if (!selectedTour) {
            toast({
                title: 'Error',
                description: 'Tour no encontrado',
                variant: 'destructive',
            });
            return;
        }

        const reservationId = generateFlightLikeId();

        addReservation({
            id: reservationId,
            productId: selectedTour.id,
            quantity: parseInt(people, 10),
            name: selectedTour.name,
            price: Number(selectedTour.price) || 0,
            date: date.toISOString(),
            image: selectedTour.images?.[0]?.src || '/placeholder.svg',
        });

        toast({
            variant: 'success',
            title: '¡Reserva exitosa!',
            description: (
                <div className="space-y-2 flex flex-col">
                    <p>{`Has reservado ${selectedTour.name} para ${people} personas`}</p>
                    <Button
                        variant="default"
                        size="default"
                        onClick={() => router.push('/checkout')}
                    >
                        Continuar la compra
                    </Button>
                </div>
            ),
        });

        // Reset form
        setDate(undefined);
        setSelectedTourId('');
        setPeople('2');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Filter tours for categories related to "Tours"
    const filteredTours = Array.isArray(tours)
        ? tours.filter((product) =>
            product.categories.some((category) => category.name === 'Tours')
        )
        : [];

    return (
        <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_1fr_auto] items-end">
            <div className="space-y-2">
                <label className="text-lg text-white/80">Fecha:</label>
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
                            {date ? format(date, 'PPP', { locale: es }) : 'Fecha del tour'}
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
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today;
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <label className="text-lg text-white/80">Tour:</label>
                <Select value={selectedTourId} onValueChange={setSelectedTourId}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white [&>span]:text-white/80 hover:bg-white/20">
                        <SelectValue placeholder="Selecciona tu aventura" />
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
    );
};

export default TourSelector;