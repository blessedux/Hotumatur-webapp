"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDown, MenuIcon, X } from "lucide-react";
import Image from "next/image";
import { useSpring, animated } from "@react-spring/web";
import ReservationIcon from "@/components/ReservationIcon";
import { GiMoai } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useDirectTranslation } from '@/hooks/useTranslatedText';

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const isWhiteBackground = pathname !== "/"; // True for non-homepages
    const { t } = useTranslation(['common', 'booking']);
    const { toggleCart } = useCart();

    // Use our custom hook for direct translations
    const homeText = useDirectTranslation(
        "Home",
        "Inicio"
    );

    const toursText = useDirectTranslation(
        "Tours",
        "Tours"
    );

    const activitiesText = useDirectTranslation(
        "Activities",
        "Actividades"
    );

    const rentalsText = useDirectTranslation(
        "Rentals",
        "Arriendos"
    );

    const aboutText = useDirectTranslation(
        "About Us",
        "Nosotros"
    );

    const contactText = useDirectTranslation(
        "Contact",
        "Contacto"
    );

    const viewReservationsText = useDirectTranslation(
        "View Reservations",
        "Ver Reservas"
    );

    // Tours menu items with direct translations
    const toursMenuItems = [
        {
            nameEn: "Group Tours",
            nameEs: "Tours Grupales",
            href: "/tours-grupales"
        },
        {
            nameEn: "Private Tours",
            nameEs: "Tours Privados",
            href: "/tours-privados"
        },
        {
            nameEn: "Special Tours",
            nameEs: "Tours Especiales",
            href: "/tours-especiales"
        },
    ];

    // Get translated tour names based on current language
    const getToursMenu = () => {
        return toursMenuItems.map(item => ({
            name: useDirectTranslation(item.nameEn, item.nameEs),
            href: item.href
        }));
    };

    const toursMenu = getToursMenu();

    const menuAnimation = useSpring({
        transform: isOpen ? "translateX(0%)" : "translateX(100%)",
        opacity: isOpen ? 1 : 0,
        config: { tension: 180, friction: 20 },
    });

    return (
        <nav
            className={`px-4 py-4 fixed top-0 left-0 right-0 z-[100] transition-colors duration-300 backdrop-blur-xl ${isWhiteBackground ? "bg-white/60 shadow-md" : "bg-black/40 backdrop-filter"
                }`}
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
            }}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="text-2xl font-semibold">
                        <Image
                            src="/hotumatur-logo.svg"
                            alt="Logo"
                            width={100}
                            height={100}
                            className="md:w-[160px] md:h-auto"
                        />
                    </Link>
                    {/* Mobile Reservation Icon - Next to Logo */}
                    <div className="md:hidden">
                        <ReservationIcon />
                    </div>
                </div>

                {/* Mobile menu button */}
                <button
                    className={`md:hidden ${isWhiteBackground ? "text-black" : "text-white"}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Menu as="div" className="relative">
                        <MenuButton
                            className={`${isWhiteBackground ? "text-black hover:text-gray-700" : "text-white hover:text-white/80"} 
                            flex items-center border-2 border-current rounded-full px-4 py-1.5 transition-all duration-300 hover:border-blue-500 hover:text-blue-500`}
                        >
                            <span>{toursText}</span>
                            <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                        </MenuButton>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <MenuItems className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-4">
                                    {toursMenu.map((tour) => (
                                        <MenuItem key={tour.name}>
                                            {({ active }) => (
                                                <Link
                                                    href={tour.href}
                                                    className={`block px-6 py-3 text-md ${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                                                        }`}
                                                >
                                                    {tour.name}
                                                </Link>
                                            )}
                                        </MenuItem>
                                    ))}
                                </div>
                            </MenuItems>
                        </Transition>
                    </Menu>
                    <Link href="/actividades" className={`${isWhiteBackground ? "text-black hover:text-gray-700" : "text-white hover:text-white/80"}`}>
                        {activitiesText}
                    </Link>
                    <Link href="/rentals" className={`${isWhiteBackground ? "text-black hover:text-gray-700" : "text-white hover:text-white/80"}`}>
                        {rentalsText}
                    </Link>
                    <Link href="/nosotros" className={`${isWhiteBackground ? "text-black hover:text-gray-700" : "text-white hover:text-white/80"}`}>
                        {aboutText}
                    </Link>
                    <Link href="/contacto" className={`${isWhiteBackground ? "text-black hover:text-gray-700" : "text-white hover:text-white/80"}`}>
                        {contactText}
                    </Link>
                    <ReservationIcon />
                </div>

                {/* Mobile menu panel */}
                <animated.div
                    style={menuAnimation}
                    className="absolute top-[95px] left-0 right-0 bg-white/30 backdrop-blur-md rounded-lg p-6 shadow-lg p-10 md:hidden z-[100] py-20"
                >
                    <div className="flex flex-col gap-6">
                        <Link
                            href="/"
                            className={`${isWhiteBackground ? "text-black" : "text-white"} text-xl`}
                            onClick={() => setIsOpen(false)}
                        >
                            {homeText}
                        </Link>

                        <div className="relative z-[200]">
                            <button
                                className={`${isWhiteBackground ? "text-black" : "text-white"} flex items-center text-xl`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            >
                                {toursText}
                                <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                            </button>
                            <div className="mt-2 space-y-2 p-4">
                                {toursMenu.map((tour) => (
                                    <Link
                                        key={tour.name}
                                        href={tour.href}
                                        className={`block text-lg ${isWhiteBackground ? "text-black" : "text-white"}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {tour.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link href="/actividades" className={`${isWhiteBackground ? "text-black" : "text-white"} text-lg`} onClick={() => setIsOpen(false)}>
                            {activitiesText}
                        </Link>
                        <Link href="/rentals" className={`${isWhiteBackground ? "text-black" : "text-white"} text-lg`} onClick={() => setIsOpen(false)}>
                            {rentalsText}
                        </Link>
                        <Link href="/nosotros" className={`${isWhiteBackground ? "text-black" : "text-white"} text-lg`} onClick={() => setIsOpen(false)}>
                            {aboutText}
                        </Link>
                        <Link href="/contacto" className={`${isWhiteBackground ? "text-black" : "text-white"} text-lg`} onClick={() => setIsOpen(false)}>
                            {contactText}
                        </Link>

                        {/* Mobile Reservation Link in Menu */}
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <button
                                className={`${isWhiteBackground ? "text-black" : "text-white"} text-lg flex items-center gap-2`}
                                onClick={() => {
                                    toggleCart();
                                    setIsOpen(false);
                                }}
                            >
                                <span>{viewReservationsText}</span>
                                <GiMoai className="w-6 h-6 transform scale-x-[-1] text-gray-800/90" />
                            </button>
                        </div>
                    </div>
                </animated.div>
            </div>
        </nav>
    );
}