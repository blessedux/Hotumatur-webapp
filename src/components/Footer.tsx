import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaTripadvisor, FaTiktok, } from 'react-icons/fa';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className='relative text-white overflow-hidden min-h-[600px] w-full'>
            {/* Video Background */}
            <div className='absolute inset-0 z-0 w-full h-full'>
                <div className='absolute inset-0 bg-emerald-950/70 z-10' />
                <iframe
                    src='https://player.vimeo.com/video/1037857996?autoplay=1&muted=1&loop=1&background=1'
                    className="absolute 
                              xl:top-1/2 xl:h-[200%] xl:w-[200%] xl:[aspect-ratio:16/9]
                              top-[calc(50%-4px)] left-1/2 w-[177.77777778vh] min-w-full min-h-[calc(100%+6px)] 
                              -translate-x-1/2 -translate-y-1/2"
                    frameBorder='0'
                    allow='autoplay; fullscreen; picture-in-picture'
                    allowFullScreen
                    title='Footer Background Video'
                />
            </div>

            {/* Main Footer Content */}
            <div className='relative z-20 w-full px-4 py-8 flex flex-col min-h-[600px]'>
                <div className='flex-grow flex flex-col items-center space-y-12 max-w-7xl mx-auto'>
                    {/* Location */}
                    <div className='text-center'>
                        <p className='text-sm tracking-wider uppercase'>
                            Ubicados en Taniera Teave, Rapa Nui{' '}
                            <Link
                                href='https://www.google.com/maps/place/Tupa+Hotel/@-27.1515662,-109.4370361,17z/data=!4m9!3m8!1s0x9947fba94090a167:0xfd3431160668fffd!5m2!4m1!1i2!8m2!3d-27.1515662!4d-109.4344612!16s%2Fg%2F1v6p5hyc?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D'
                                className='underline underline-offset-4 hover:text-emerald-300'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Ver en el mapa
                            </Link>
                        </p>
                        <p className='text-sm tracking-wider uppercase'>
                            Sucursal en Santiago, Chile {' '}
                            <Link
                                href='https://www.google.com/maps/place/Alonso+de+C%C3%B3rdova+2600,+7630440+Vitacura,+Regi%C3%B3n+Metropolitana/@-33.4016931,-70.601458,17z/data=!3m1!4b1!4m6!3m5!1s0x9662cf3636629089:0x8f498ebdd6e4cecf!8m2!3d-33.4016932!4d-70.5965871!16s%2Fg%2F11dftyq91l?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D'
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
                            href='/contacto'
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
                </div>

                {/* Copyright - Moved to bottom */}
                <div className='text-sm text-center mt-8 pt-8 border-t border-white/10'>
                    <p>&copy; {new Date().getFullYear()} Hotumatur. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}