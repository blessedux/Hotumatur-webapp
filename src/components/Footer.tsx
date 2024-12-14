'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { FaWhatsapp } from 'react-icons/fa';
import { FaInstagram } from "react-icons/fa";
import { FaTripadvisor } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa";
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
                {/* Blurred background for gaps */}
                <div
                    className='absolute inset-0 bg-cover bg-center'
                    style={{
                        backgroundImage: 'url(https://vumbnail.com/1037857996.jpg)',
                        filter: 'blur(10px)',
                        transform: 'scale(1.1)',
                    }}
                />
                {/* Overlay */}
                <div className='absolute inset-0 bg-emerald-950/70 z-10' />
                {/* Vimeo Embed */}
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
                                href='https://www.google.com/maps/place/Hotumatur+Rapa+Nui/@-27.1515001,-109.4394778,17z/data=!3m1!4b1!4m6!3m5!1s0x9947fb91364cf45b:0xe03a9f249c442166!8m2!3d-27.1515002!4d-109.4346069!16s%2Fg%2F11vlw42ghx?entry=ttu&g_ep=EgoyMDI0MTIwOS4wIKXMDSoASAFQAw%3D%3D'
                                className='underline underline-offset-4 hover:text-emerald-300'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Ver en el mapa
                            </Link>
                        </p>
                    </div>

                    {/* Contact Numbers */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center w-full max-w-4xl'>
                        <Link
                            href='tel:+56962064520'
                            className='relative group bg-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/20'
                        >
                            <PhoneIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white opacity-5 group-hover:opacity-10 transition-opacity duration-300' />
                            <h3 className='text-sm tracking-wider uppercase mb-2 relative z-10'>
                                Reservaciones
                            </h3>
                            <p className='text-2xl relative z-10'>+56 9 6206 4520</p>
                        </Link>
                        <Link
                            href='https://wa.me/56962064520'
                            className='relative group bg-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/20'
                            target='_blank'
                            rel='noopener noreferrer'
                        >
                            <FaWhatsapp className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white opacity-5 group-hover:opacity-10 transition-opacity duration-300' />
                            <h3 className='text-sm tracking-wider uppercase mb-2 relative z-10'>
                                WhatsApp
                            </h3>
                            <p className='text-2xl relative z-10'>+56 9 6206 4520</p>
                        </Link>
                        <Link
                            href='mailto:info@hotumatur.com'
                            className='relative group bg-white/10 rounded-lg p-6 transition-all duration-300 hover:bg-white/20'
                        >
                            <EnvelopeIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white opacity-5 group-hover:opacity-10 transition-opacity duration-300' />
                            <h3 className='text-sm tracking-wider uppercase mb-2 relative z-10'>
                                Email
                            </h3>
                            <p className='text-lg relative z-10'>info@hotumatur.com</p>
                        </Link>
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