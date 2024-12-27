
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

// Google Analytics Tracking ID 
const GA_TRACKING_ID = 'G-T13Z87RDDN';

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
        url: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Hotumatur-android-chrome-512x512-1.png',
        width: 512,
        height: 512,
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
    url: 'https://backend.hotumatur.com/wp-content/uploads/2024/12/Hotumatur-android-chrome-512x512-1.png',
    imageAlt: 'Hotumatur: Agencia de turismo en Rapa Nui',
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
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta property="og:description" content={metadata.openGraph.description} />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:image" content={metadata.openGraph.images?.[0]?.url || '/default-image.png'} />
        <meta property="og:image:alt" content={metadata.openGraph.images[0].alt} />
        <meta property="og:image:width" content={metadata.openGraph.images[0].width.toString()} />
        <meta property="og:image:height" content={metadata.openGraph.images[0].height.toString()} />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta name="twitter:description" content={metadata.twitter.description} />
        <meta name="twitter:image" content={metadata.twitter?.images?.[0] || '/default-image.png'} />
        <meta name="twitter:image:alt" content={metadata.twitter.imageAlt} />
        <link rel="icon" href="/favicon.ico" />

        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
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
