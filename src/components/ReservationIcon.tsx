'use client'

import { useReservations } from '@/context/ReservationContext'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { useSpring, animated } from '@react-spring/web'
import { useEffect, useState, useRef, useCallback } from 'react'
import { Card } from './ui/card'
import { PiTrashLight } from "react-icons/pi";
import { X } from 'lucide-react'
import { GiMoai } from "react-icons/gi";
import { format, parseISO } from 'date-fns'
import { es, enUS } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import { useDirectTranslation } from '@/hooks/useTranslatedText'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

// Extend HTMLButtonElement to include our custom properties
declare global {
    interface HTMLButtonElement {
        _checkoutListener?: (e: MouseEvent) => void;
        _deleteListener?: (e: MouseEvent) => void;
    }
}

export default function ReservationIcon() {
    const { reservations, removeReservation, forceUpdate } = useReservations()
    const { isCartOpen, openCart, closeCart, toggleCart } = useCart()
    const dropdownRef = useRef<HTMLDivElement>(null)
    const cartRef = useRef<HTMLDivElement>(null)
    const { t, i18n } = useTranslation(['booking', 'common'])
    const [isMobile, setIsMobile] = useState(false)
    const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
    const router = useRouter()
    const [isClient, setIsClient] = useState(false)
    const [isNavigating, setIsNavigating] = useState(false)
    // Track the source of the close operation
    const [closeSource, setCloseSource] = useState<'button' | 'outside' | null>(null)

    // Flag to track if we're currently processing a click inside the cart
    const isClickingInsideRef = useRef(false);

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

    const removeText = useDirectTranslation(
        "Remove",
        "Eliminar"
    );

    // Set isClient to true once component mounts
    useEffect(() => {
        setIsClient(true)
    }, [])

    // Debug: Log reservations whenever they change
    useEffect(() => {
        if (isClient) {
            console.log('ReservationIcon - Current reservations:', reservations);
        }
    }, [reservations, isClient]);

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

    // COMPLETELY NEW APPROACH - Handle clicks using capture phase and manual tracking
    useEffect(() => {
        if (!isClient) return;

        const handleGlobalMouseDown = (e: MouseEvent) => {
            // Only process if cart is open
            if (!isCartOpen) return;

            // Check if the click is inside the cart
            const isInsideCart = cartRef.current?.contains(e.target as Node);

            if (isInsideCart) {
                // Flag that we're clicking inside
                isClickingInsideRef.current = true;
                console.log('Mouse down INSIDE cart');
            } else {
                // Flag that we're clicking outside
                isClickingInsideRef.current = false;
                console.log('Mouse down OUTSIDE cart');
            }
        };

        const handleGlobalMouseUp = (e: MouseEvent) => {
            // Only process if cart is open
            if (!isCartOpen) return;

            // Check if the click ended inside the cart
            const isInsideCart = cartRef.current?.contains(e.target as Node);

            // If we started clicking outside and ended outside, close the cart
            if (!isClickingInsideRef.current && !isInsideCart) {
                console.log('Complete click OUTSIDE cart - closing');
                setCloseSource('outside');
                closeCart();
            } else {
                console.log('Click involved cart - not closing');
            }

            // Reset the flag
            isClickingInsideRef.current = false;
        };

        // Add global listeners using capture phase
        document.addEventListener('mousedown', handleGlobalMouseDown, true);
        document.addEventListener('mouseup', handleGlobalMouseUp, true);

        // Cleanup
        return () => {
            document.removeEventListener('mousedown', handleGlobalMouseDown, true);
            document.removeEventListener('mouseup', handleGlobalMouseUp, true);
        };
    }, [isClient, isCartOpen, closeCart]);

    // Reset close source when cart opens
    useEffect(() => {
        if (isCartOpen) {
            setCloseSource(null);
        }
    }, [isCartOpen]);

    const calculateTotal = () => {
        return reservations.reduce((total, reservation) => {
            const price = Number(reservation.price) || 0;
            const quantity = Number(reservation.quantity) || 0;
            return total + (price * quantity);
        }, 0);
    };

    // Handle the checkout navigation
    const handleCheckout = useCallback((e: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('CHECKOUT BUTTON CLICKED');

        // Prevent double-clicks/navigation
        if (isNavigating) {
            console.log('Already navigating, ignoring click');
            return;
        }

        setIsNavigating(true);
        console.log('Starting checkout process with reservations:', reservations);

        // Navigate to the checkout form page instead of direct payment processing
        setTimeout(() => {
            console.log('Navigating to checkout form page');
            // Navigate to the checkout page where users can review and enter information
            window.location.href = '/checkout/form';
        }, 100);
    }, [isNavigating, reservations]);

    // Handle removing a reservation
    const handleRemove = useCallback((id: string, e: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('DELETE BUTTON CLICKED for reservation:', id);

        try {
            // Call the removeReservation function from context
            removeReservation(id);
            console.log('Reservation removed successfully - keeping cart open');

            // Force a re-render to show updated cart but do NOT close the cart
            setTimeout(() => {
                console.log('Forcing update after reservation removal');
                forceUpdate();
                setCurrentLanguage(prev => prev); // Also force component re-render
            }, 50);
        } catch (error) {
            console.error('Error removing reservation:', error);
        }
    }, [removeReservation, forceUpdate, setCurrentLanguage]);

    // Handle closing the cart explicitly with the X button
    const handleCloseCart = useCallback((e: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        console.log('CLOSE BUTTON CLICKED');
        setCloseSource('button');
        closeCart();
    }, [closeCart]);

    if (!isClient || reservations.length === 0) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <animated.div style={iconAnimation}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleCart();
                    }}
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
                    ref={cartRef}
                >
                    <Card
                        className="p-4 shadow-lg relative"
                    >
                        {/* Debug indicator for close source */}
                        {closeSource && (
                            <div className="absolute top-0 right-0 bg-yellow-200 text-xs px-1 rounded-bl">
                                Closed by: {closeSource}
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold">{yourAdventuresText}:</h3>
                            <button
                                onClick={handleCloseCart}
                                className="text-gray-500/80 hover:text-gray-700 p-1"
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
                                    <div className="absolute right-1 top-3 z-10">
                                        {/* Delete button */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleRemove(reservation.id, e)}
                                            className="ml-4 text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded cursor-pointer"
                                            aria-label={removeText}
                                        >
                                            <PiTrashLight size={18} />
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
                            {/* Checkout button */}
                            <button
                                disabled={isNavigating}
                                className="w-full bg-hotumatur-primary text-white py-2 px-4 rounded-md cursor-pointer hover:bg-hotumatur-primary/90 font-medium"
                                onClick={handleCheckout}
                            >
                                {isNavigating ? '...' : continueToPayText}
                            </button>
                        </div>
                    </Card>
                </animated.div>
            </div>
        </div>
    )
}
