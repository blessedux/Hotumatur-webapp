'use client';

import { useEffect, useState } from 'react';
import NavBar from "@/components/NavBar";
import dynamic from 'next/dynamic';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useTransition, animated } from '@react-spring/web';
import Preloader from '@/components/Preloader';

const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div>Loading...</div>,
});


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isPreloading, setIsPreloading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.pathname === '/') {
            // Show preloader only on homepage
            const timer = setTimeout(() => setIsPreloading(false), 1500);
            return () => clearTimeout(timer);
        } else {
            setIsPreloading(false);
        }
    }, []);

    // React Spring transitions for page content
    const transitions = useTransition(!isPreloading, {
        from: { opacity: 0, transform: 'scale(0.95)', filter: 'blur(10px)' },
        enter: { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
        leave: { opacity: 0, transform: 'scale(1.05)', filter: 'blur(10px)' },
        config: { duration: 500 }, // Duration of the animation
    });

    return (
        <>
            {/* Render preloader if `isPreloading` is true */}
            {isPreloading ? (
                <Preloader />
            ) : (
                <>
                    <div className="relative z-50">
                        <NavBar />
                    </div>

                    {/* Page transitions */}
                    <div className="relative">
                        {transitions((style, item) =>
                            item ? (
                                <animated.div key="content" style={style} className="min-h-screen">
                                    {children}
                                </animated.div>
                            ) : null
                        )}
                    </div>

                    <WhatsAppButton />
                    <Footer />
                </>
            )}
        </>
    );
}