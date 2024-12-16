'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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
};

export const ReservationContext = createContext<ReservationContextType>({
    reservations: [],
    addReservation: () => { },
    removeReservation: () => { },
    updateQuantity: () => { },
    clearReservations: () => { },
});

export function ReservationProvider({ children }: { children: ReactNode }) {
    const [reservations, setReservations] = useState<Reservation[]>([])

    const addReservation = (reservation: Reservation) => {
        setReservations(prev => [...prev, reservation])
    }

    const removeReservation = (id: string) => {
        setReservations(prev => prev.filter(r => r.id !== id))
    }

    const clearReservations = () => {
        setReservations([]);
    };

    return (
        <ReservationContext.Provider value={{
            reservations,
            addReservation,
            removeReservation,
            updateQuantity: () => { },
            clearReservations
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