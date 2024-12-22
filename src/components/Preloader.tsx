'use client';

import { useEffect, useState } from 'react';
import { useTransition, animated } from '@react-spring/web';

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = 'auto'; // Restore scroll (if disabled)
        }, 1500);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'auto';
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-lg"
            style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
            {/* Add your preloader content here */}
        </div>
    );
};

export default Preloader;