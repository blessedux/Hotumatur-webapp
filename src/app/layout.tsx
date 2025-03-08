'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ReservationProvider } from '@/context/ReservationContext'
import { CartProvider } from '@/context/CartContext'
import { Toaster } from "@/components/ui/toaster"
import 'flag-icons/css/flag-icons.min.css'
import { PageTransition } from '@/components/ui/page-transition'
import { useEffect } from "react";
import '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { TranslationProvider } from '@/providers/TranslationProvider';
import Head from 'next/head';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!i18n.isInitialized) {
      i18n.init();
    }
  }, [i18n]);

  return (
    <html lang={i18n.language}>
      <Head>
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}>
        <TranslationProvider>
          <LanguageProvider>
            <ReservationProvider>
              <CartProvider>
                <PageTransition>
                  <div className="relative z-0">
                    {children}
                  </div>
                </PageTransition>
                <Toaster />
              </CartProvider>
            </ReservationProvider>
          </LanguageProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
