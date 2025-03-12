'use client'

import { useReservations } from '@/context/ReservationContext'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useSpring, animated } from '@react-spring/web'
import { useEffect, useState, useRef } from 'react'
import { Card } from './ui/card'
import { PiTrashLight } from "react-icons/pi";
import { X } from 'lucide-react'
import { GiMoai } from "react-icons/gi";
import { format, parseISO } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useDirectTranslation } from '@/hooks/useTranslatedText'

export default function ReservationIcon() {
    const { reservations, removeReservation } = useReservations()
    const { isCartOpen, openCart, closeCart, toggleCart } = useCart()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const { t, i18n } = useTranslation(['booking', 'common'])
    const [isMobile, setIsMobile] = useState(false)
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

    // Use our custom hook for direct translations
    const reservationsText = useDirectTranslation(
        "Reservations",
        "Reservas"
    );

    const yourAdventuresText = useDirectTranslation(
        "Your Adventures",
        "Tus Aventuras"
    );

    const closeText = useDirectTranslation(
        "Close",
        "Cerrar"
    );

    const forText = useDirectTranslation(
        "for",
        "para"
    );

    const personText = useDirectTranslation(
        "person",
        "persona"
    );

    const peopleText = useDirectTranslation(
        "people",
        "personas"
    );

    const dateText = useDirectTranslation(
        "Date",
        "Fecha"
    );

    const totalToPayText = useDirectTranslation(
        "Total to pay",
        "Total a pagar"
    );

    const continueToPayText = useDirectTranslation(
        "Continue to payment",
        "Continuar al pago"
    );

    // Get the appropriate date locale based on language
    const dateLocale = i18n.language === 'en' ? enUS : es;

    // Date format pattern based on language
    const dateFormatPattern = i18n.language === 'en' ? "MMMM d, yyyy" : "d 'de' MMMM, yyyy";

    // Force re-render when language changes
    useEffect(() => {
        if (currentLanguage !== i18n.language) {
            setCurrentLanguage(i18n.language)
        }
    }, [i18n.language, currentLanguage])

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    // Animación para el ícono
    const iconAnimation = useSpring({
        opacity: reservations.length > 0 ? 1 : 0,
        transform: reservations.length > 0 ? 'scale(1)' : 'scale(0.8)',
        config: { tension: 300, friction: 20 }
    })

    // Animación para el dropdown
    const dropdownAnimation = useSpring({
        opacity: isCartOpen ? 1 : 0,
        transform: isCartOpen ? 'translateY(0)' : 'translateY(-20px)',
        config: { tension: 300, friction: 20 }
    })

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeCart()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [closeCart])

    const calculateTotal = () => {
        return reservations.reduce((total, reservation) => {
            const price = Number(reservation.price) || 0;
            const quantity = Number(reservation.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    return reservations.length > 0 ? (
        <div className="relative" ref={dropdownRef}>
            <animated.div style={iconAnimation}>
                <button
                    onClick={() => toggleCart()}
                    className="relative inline-flex items-center text-white text-black/80"
                    aria-label={reservationsText}
                >
                    <span className="hidden md:inline-block mr-1">{reservationsText}</span>
                    <GiMoai className="w-8 h-8 transform scale-x-[-1] text-gray-800/90" />
                    {reservations.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            {reservations.length}
                        </span>
                    )}
                </button>
            </animated.div>

            {/* Dropdown */}
            <div className="relative">
                <animated.div
                    style={{
                        ...dropdownAnimation,
                        position: isMobile ? 'fixed' : 'absolute',
                        left: isMobile ? '50%' : 'auto',
                        right: isMobile ? 'auto' : 0,
                        transform: isMobile ? 'translateX(-50%)' : 'none',
                        width: isMobile ? '90vw' : '24rem',
                        maxWidth: '400px',
                        marginTop: '0.5rem',
                        zIndex: 50
                    }}
                    className={isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}
                >
                    <Card className="p-4 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">{yourAdventuresText}:</h3>
                            <button
                                onClick={closeCart}
                                className="text-gray-500/80 hover:text-gray-700"
                                aria-label={closeText}
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
                                                    {forText} {reservation.quantity} {reservation.quantity === 1 ? personText : peopleText}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {dateText}: {format(parseISO(reservation.date), dateFormatPattern, { locale: dateLocale })}
                                                </p>
                                            </div>
                                            <p className="text-sm font-medium">
                                                ${((Number(reservation.price) || 0) * reservation.quantity).toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-CL')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="absolute right-1 top-3">
                                        <button
                                            onClick={() => removeReservation(reservation.id)}
                                            className="ml-4 text-red-500/80 hover:text-red-600"
                                            aria-label={t('removeReservation', { ns: 'booking' })}
                                        >
                                            <PiTrashLight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <span className="font-semibold">{totalToPayText}:</span>
                                <span className="font-bold text-lg">
                                    ${calculateTotal().toLocaleString(i18n.language === 'en' ? 'en-US' : 'es-CL')}
                                </span>
                            </div>
                            <Link
                                href="/checkout"
                                className="w-full bg-hotumatur-primary text-white py-2 px-4 rounded-md text-center block hover:bg-hotumatur-primary/90"
                                onClick={closeCart}
                            >
                                {continueToPayText}
                            </Link>
                        </div>
                    </Card>
                </animated.div>
            </div>
        </div>
    ) : null
}