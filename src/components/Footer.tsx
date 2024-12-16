'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaWhatsapp, FaInstagram, FaTripadvisor, FaTiktok, } from 'react-icons/fa';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function Footer() {
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const videoScale = windowWidth < 768 ? '250%' : '150%';

    return (
        <footer className='relative text-white overflow-hidden min-h-[600px] w-full'>
            {/* Video Background */}
            <div className='absolute inset-0 z-0 w-full h-full'>
                <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{
                        backgroundImage: 'url(https://vumbnail.com/1037857996.jpg)',
                        filter: 'blur(10px)',
                        transform: 'scale(1.1)',
                    }}
                />
                <div className='absolute inset-0 bg-emerald-950/70 z-10' />
                <div className='absolute inset-0 overflow-hidden'>
                    <iframe
                        src='https://player.vimeo.com/video/1037857996?autoplay=1&muted=1&loop=1&background=1'
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: videoScale,
                            height: videoScale,
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'cover',
                        }}
                        frameBorder='0'
                        allow='autoplay; fullscreen; picture-in-picture'
                        allowFullScreen
                        title='Footer Background Video'
                    ></iframe>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className='relative z-20 w-full px-4 py-8'>
                <div className='flex flex-col items-center space-y-12 max-w-7xl mx-auto'>
                    {/* Location */}
                    <div className='text-center'>
                        <p className='text-sm tracking-wider uppercase'>
                            Ubicados en Hanga Roa, Rapa Nui{' '}
                            <Link
                                href='https://www.google.com/maps/place/Hotumatur+Rapa+Nui/'
                                className='underline underline-offset-4 hover:text-emerald-300'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Ver en el mapa
                            </Link>
                        </p>
                    </div>

                    {/* Social Media */}
                    <div className='flex space-x-6'>
                        <Link
                            href='https://www.tripadvisor.cl/Attraction_Review-g316040-d26626022-Reviews-Hotumatur_RapaNui-Easter_Island.html'
                            className='hover:text-emerald-300 transition-colors'
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label='TripAdvisor'
                        >
                            <FaTripadvisor className='w-9 h-9' />
                        </Link>
                        <Link
                            href='https://www.instagram.com/hotumatur/'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-emerald-300 transition-colors'
                            aria-label='Instagram'
                        >
                            <FaInstagram className='w-8 h-8' />
                        </Link>
                        <Link
                            href='https://www.tiktok.com/@hotumatur.rapanui'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-emerald-300 transition-colors'
                            aria-label='TikTok'
                        >
                            <FaTiktok className='w-8 h-8' />
                        </Link>
                        <Link
                            href='https://wa.me/56962064520'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-emerald-300 transition-colors'
                            aria-label='WhatsApp'
                        >
                            <FaWhatsapp className='w-8 h-8' />
                        </Link>
                        <Link
                            href='/Contacto'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='hover:text-emerald-300 transition-colors'
                            aria-label='Email'
                        >
                            <EnvelopeIcon className='w-8 h-8' />
                        </Link>
                    </div>

                    {/* Logos Section */}
                    <div className='flex items-center justify-center gap-12 mt-12 flex-wrap'>
                        <Link href='#'>
                            <Image
                                width={300}
                                height={300}
                                src='/hotumatur-logo.svg'
                                alt='Hotumatur Logo'
                                className='h-[140px] w-auto brightness-0 invert'
                            />
                        </Link>
                        <Link
                            href='https://serviciosturisticos.sernatur.cl/58068-hotumatur-rapanui'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <Image
                                width={300}
                                height={300}
                                src='/images/selloR2x-300x300-1.webp'
                                alt='Sello Sernatur Chile'
                                className='h-[100px] w-auto'
                            />
                        </Link>
                        <Image
                            width={595}
                            height={131}
                            src='/images/logo-chilecompra-original.webp'
                            alt='Logo Chilecompra'
                            className='h-[45px] w-auto'
                        />
                    </div>

                    {/* Navigation */}
                    <nav className='flex flex-wrap justify-center gap-8'>
                        <Link
                            href='/contacto'
                            className='text-sm uppercase tracking-wider hover:text-emerald-300 transition-colors'
                        >
                            Contacto
                        </Link>
                        <Link
                            href='/nosotros'
                            className='text-sm uppercase tracking-wider hover:text-emerald-300 transition-colors'
                        >
                            Nosotros
                        </Link>
                        <Link
                            href='/tours'
                            className='text-sm uppercase tracking-wider hover:text-emerald-300 transition-colors'
                        >
                            Tours
                        </Link>
                        <Link
                            href='/privacidad'
                            className='text-sm uppercase tracking-wider hover:text-emerald-300 transition-colors'
                        >
                            Política de Privacidad
                        </Link>
                    </nav>

                    {/* Copyright */}
                    <div className='text-sm mt-8 mb-2'>
                        <p>
                            &copy; {new Date().getFullYear()} Hotumatur. Todos los derechos
                            reservados.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}