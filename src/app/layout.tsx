
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReservationProvider } from '@/context/ReservationContext'
import { Toaster } from "@/components/ui/toaster"
import 'flag-icons/css/flag-icons.min.css'
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hotumatur: Rapa Nui',
  description: 'Agencia de turismo en Rapa Nui',
  openGraph: {
    title: 'Hotumatur Agencia de Turismo',
    description: 'Vive la magia de Isla de Pascua con Hotumatur, los embajadores oficiales de Rapa Nui. Ofrecemos experiencias culturales auténticas, alquiler de vehículos y aventuras inolvidables que te conectan con el corazón de esta isla legendaria. Descubre la historia, la cultura y la impresionante belleza de Rapa Nui junto a nuestros expertos guías locales',
    url: 'https://hotumatur.com',
    siteName: 'Hotumatur Rapa Nui',
    images: [
      {
        url: '/images/Hotumatur-android-chrome-512x512.png',
        width: 800,
        height: 600,
        alt: 'Hotumatur: Agencia de turismo en Rapa Nui',
      },
    ],
    locale: 'es_CL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotumatur: agencia de turismo',
    description: 'Vive la magia de Isla de Pascua con Hotumatur, los embajadores oficiales de Rapa Nui. Ofrecemos experiencias culturales auténticas, alquiler de vehículos y aventuras inolvidables que te conectan con el corazón de esta isla legendaria. Descubre la historia, la cultura y la impresionante belleza de Rapa Nui junto a nuestros expertos guías locales',
    images: ['/images/Hotumatur-android-chrome-512x512.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <ReservationProvider>
          <div className="relative z-0">
            {children}
          </div>
          <Toaster />
        </ReservationProvider>
      </body>
    </html>
  );
}
