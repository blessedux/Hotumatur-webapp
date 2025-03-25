'use client';

import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar";
import LanguageToggle from '@/components/LanguageToggle';
import { useTransition, animated } from '@react-spring/web';
import React from 'react';
import { Toaster } from "@/components/ui/toaster";

export default function CheckoutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // React Spring transitions for page content
    const transitions = useTransition(isClient, {
        from: { opacity: 0, transform: 'translateY(-10px)' },
        enter: { opacity: 1, transform: 'translateY(0px)' },
        leave: { opacity: 0, transform: 'translateY(10px)' },
        config: { duration: 300 }, // Duration of the animation
    });

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="relative z-50">
                    <NavBar />
                </div>

                <main className="flex-grow relative">
                    {transitions((style, item) =>
                        item ? (
                            <animated.div key="content" style={style}>
                                {children}
                            </animated.div>
                        ) : (
                            <div className="min-h-[60vh]"></div> // Placeholder while client-side rendering
                        )
                    )}
                </main>

                {/* Footer intentionally removed for checkout flow */}
            </div>

            {/* Only essential UI elements kept */}
            <LanguageToggle />
            <Toaster />
            {/* WhatsApp button intentionally removed for checkout flow */}
        </>
    );
} 