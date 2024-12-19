"use client"

import { useState, Fragment } from "react"
import Link from "next/link"
import { Menu, Transition, MenuItems, MenuButton, MenuItem } from '@headlessui/react'
import { ChevronDown, MenuIcon, X } from 'lucide-react'
import Image from 'next/image'
import { useSpring, animated } from '@react-spring/web'
import { useProducts } from "@/hooks/useProducts"
import ReservationIcon from '@/components/ReservationIcon'

export default function NavBar() {
    const [isOpen, setIsOpen] = useState(false)
    const { products, loading } = useProducts()

    const tours = products
        .filter(product => product.categories.some(category => category.name === "Tours"))
        .map(tour => ({
            name: tour.name,
            href: `/tours/${tour.slug}`
        }))

    const menuAnimation = useSpring({
        transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
        opacity: isOpen ? 1 : 0,
        config: {
            tension: 180,
            friction: 20,
        },
    })

    return (
        <nav className="bg-white/20 px-4 py-4 absolute top-0 left-0 right-0 z-[100]">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="text-white text-2xl font-semibold">
                    <Image src="/hotumatur-logo.svg" alt="Logo" width={100} height={100} className="md:w-[160px] md:h-auto " />
                </Link>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>

                {/* Desktop menu */}
                <div className="hidden md:flex items-center gap-10">
                    <Menu as="div" className="relative inline-block text-left">
                        <MenuButton className="inline-flex items-center text-white hover:text-white/80">
                            Tours
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
                            <MenuItems className="absolute right-0 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                                {loading ? (
                                    <div className="px-6 py-3">Loading...</div>
                                ) : (
                                    <div className="py-4">
                                        {tours.map((tour) => (
                                            <MenuItem key={tour.name}>
                                                {({ active }) => (
                                                    <Link
                                                        href={tour.href}
                                                        className={`${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'} block px-6 py-3 text-md`}
                                                    >
                                                        {tour.name}
                                                    </Link>
                                                )}
                                            </MenuItem>
                                        ))}
                                    </div>
                                )}
                            </MenuItems>
                        </Transition>
                    </Menu>

                    <Link href="#" className="text-white hover:text-white/80">
                        Rentals
                    </Link>
                    <Link href="/nosotros" className="text-white hover:text-white/80">
                        Nosotros
                    </Link>
                    <Link href="/contacto" className="text-white hover:text-white/80">
                        Contáctanos
                    </Link>
                    <ReservationIcon />
                </div>

                {/* Mobile menu panel */}

                <animated.div
                    style={menuAnimation}
                    className="absolute top-[95px] left-0 right-0 bg-[#E5B455] p-10 md:hidden z-[100] py-20">
                    <div className="flex flex-col gap-6">
                        <Link
                            href="/"
                            className="text-white hover:text-white/80 text-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            Inicio
                        </Link>

                        <div className="relative z-[200]">
                            <button
                                className="text-white hover:text-white/80 flex items-center text-xl"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                }}
                            >
                                Tours
                                <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                            </button>
                            <div className="mt-2 space-y-2 p-4">
                                {tours.map((tour) => (
                                    <Link
                                        key={tour.name}
                                        href={tour.href}
                                        className="block text-white hover:text-white/80 text-lg"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {tour.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link
                            href="/nosotros"
                            className="text-white hover:text-white/80 text-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            Nosotros
                        </Link>
                        <Link
                            href="/contactanos"
                            className="text-white hover:text-white/80 text-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            Contáctanos
                        </Link>
                    </div>
                </animated.div>
            </div>
        </nav>
    )
}

