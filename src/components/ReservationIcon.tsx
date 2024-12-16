'use client'

import { useReservations } from '@/context/ReservationContext'
import Link from 'next/link'
import { useTransition, animated, useSpring } from '@react-spring/web'
import { useEffect, useState, useRef } from 'react'
import { Card } from './ui/card'
import { PiTrashLight } from "react-icons/pi";
import { X } from 'lucide-react'
import { GiMoai } from "react-icons/gi";


export default function ReservationIcon() {
    const { reservations, removeReservation } = useReservations()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Animación para el ícono
    const transition = useTransition(reservations.length > 0, {
        from: { opacity: 0, transform: 'scale(0.8)' },
        enter: { opacity: 1, transform: 'scale(1)' },
        leave: { opacity: 0, transform: 'scale(0.8)' },
        config: { tension: 300, friction: 20 }
    })

    // Animación para el dropdown
    const dropdownAnimation = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(-20px)',
        config: { tension: 300, friction: 20 }
    })

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const calculateTotal = () => {
        return reservations.reduce((total, reservation) => {
            const price = Number(reservation.price) || 0;
            const quantity = Number(reservation.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    return transition((style, show) =>
        show ? (
            <div className="relative" ref={dropdownRef}>
                <animated.div style={style}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="relative inline-flex  items-center text-white hover:text-white/80"
                        aria-label={`Ver ${reservations.length} reservas`}
                    >
                        Reservas
                        <GiMoai className="w-8 h-8 transform scale-x-[-1]" />
                        {reservations.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {reservations.length}
                            </span>
                        )}
                    </button>
                </animated.div>

                {/* Dropdown */}
                <animated.div
                    style={dropdownAnimation}
                    className={`absolute right-0 mt-2 w-96 z-50 ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                >
                    <Card className="p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">Tus aventuras:</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500/80 hover:text-gray-700"
                            >

                                <X size={16} />
                            </button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-auto">
                            {reservations.map((reservation) => (
                                <div
                                    key={reservation.id}
                                    className="relative flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{reservation.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-500">
                                                    para {reservation.quantity} {reservation.quantity === 1 ? 'persona' : 'personas'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    fecha:{reservation.date}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium">
                                                ${((Number(reservation.price) || 0) * reservation.quantity).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute right-1 top-3">
                                        <button
                                            onClick={() => removeReservation(reservation.id)}
                                            className="ml-4 text-red-500/80 hover:text-red-600"
                                        >
                                            <PiTrashLight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">Total a pagar:</span>
                                <span className="font-bold text-lg">
                                    ${calculateTotal().toLocaleString('es-CL')}
                                </span>
                            </div>
                            <Link
                                href="/checkout"
                                className="w-full bg-hotumatur-primary text-white py-2 px-4 rounded-md text-center block hover:bg-hotumatur-primary/90"
                                onClick={() => setIsOpen(false)}
                            >
                                Continuar la compra
                            </Link>
                        </div>
                    </Card>
                </animated.div>
            </div>
        ) : null
    )
}