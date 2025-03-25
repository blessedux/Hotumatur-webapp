'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react'

interface Reservation {
    id: string;
    productId: number
    quantity: number
    name: string
    price: number
    date: string
    image: string
}

export type ReservationContextType = {
    reservations: Reservation[];
    addReservation: (reservation: Reservation) => void;
    removeReservation: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearReservations: () => void;
    forceUpdate: () => void;
};

export const ReservationContext = createContext<ReservationContextType>({
    reservations: [],
    addReservation: () => { },
    removeReservation: () => { },
    updateQuantity: () => { },
    clearReservations: () => { },
    forceUpdate: () => { },
});

const STORAGE_KEY = 'hotumatur_reservations';

export function ReservationProvider({ children }: { children: ReactNode }) {
    // Initialize state but wait for useEffect for hydration
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [isClient, setIsClient] = useState(false);
    // Add a counter to force re-renders
    const [updateCounter, setUpdateCounter] = useState(0);

    // Force update function
    const forceUpdate = useCallback(() => {
        console.log('Force updating reservation context');
        setUpdateCounter(prev => prev + 1);
    }, []);

    // Load reservations from localStorage on client side
    useEffect(() => {
        setIsClient(true);
        try {
            const savedReservations = localStorage.getItem(STORAGE_KEY);
            console.log('Checking localStorage for reservations');
            if (savedReservations) {
                try {
                    const parsedReservations = JSON.parse(savedReservations);
                    console.log('Found reservations in storage:', parsedReservations);
                    if (Array.isArray(parsedReservations)) {
                        setReservations(parsedReservations);
                    } else {
                        console.error('Stored reservations is not an array:', parsedReservations);
                        setReservations([]);
                    }
                } catch (parseError) {
                    console.error('Error parsing reservations from storage:', parseError);
                    // Clear invalid data
                    localStorage.removeItem(STORAGE_KEY);
                    setReservations([]);
                }
            } else {
                console.log('No reservations found in storage');
            }
        } catch (error) {
            console.error('Error accessing localStorage:', error);
        }
    }, []);

    // Save reservations to localStorage whenever they change
    useEffect(() => {
        if (!isClient) return;

        try {
            console.log('Saving reservations to storage:', reservations);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
        } catch (error) {
            console.error('Error saving reservations to storage:', error);
        }
    }, [reservations, isClient, updateCounter]);

    const addReservation = useCallback((reservation: Reservation) => {
        console.log('Adding reservation:', reservation);
        setReservations(prev => {
            const newReservations = [...prev, reservation];
            return newReservations;
        });
    }, []);

    const removeReservation = useCallback((id: string) => {
        console.log('⚠️ Removing reservation with ID:', id);
        console.log('Current reservations before removal:', reservations);

        setReservations(prev => {
            // Check if the ID exists
            const reservationExists = prev.some(r => r.id === id);
            if (!reservationExists) {
                console.warn(`⚠️ Attempted to remove reservation ${id} but it doesn't exist!`);
            }

            const filtered = prev.filter(r => r.id !== id);
            console.log('Reservations after removal:', filtered);

            // Force an immediate localStorage update for reliability
            if (isClient) {
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
                    console.log('Directly updated localStorage after removal');
                } catch (error) {
                    console.error('Error directly updating localStorage:', error);
                }
            }

            return filtered;
        });

        // Force a re-render after a slight delay
        setTimeout(() => {
            forceUpdate();
        }, 50);
    }, [reservations, isClient, forceUpdate]);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        console.log(`Updating quantity for reservation ${id} to ${quantity}`);
        setReservations(prev =>
            prev.map(r =>
                r.id === id
                    ? { ...r, quantity }
                    : r
            )
        );
    }, []);

    const clearReservations = useCallback(() => {
        console.log('Clearing all reservations');
        setReservations([]);

        // Also clear localStorage directly
        if (isClient) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                console.log('Cleared reservations from localStorage');
            } catch (error) {
                console.error('Error clearing localStorage:', error);
            }
        }
    }, [isClient]);

    return (
        <ReservationContext.Provider value={{
            reservations,
            addReservation,
            removeReservation,
            updateQuantity,
            clearReservations,
            forceUpdate
        }}>
            {children}
        </ReservationContext.Provider>
    )
}

export const useReservations = () => {
    const context = useContext(ReservationContext)
    if (!context) throw new Error('useReservations must be used within a ReservationProvider')
    return context
}