'use client';

import { useEffect, useState } from 'react';
import { useTransition, animated } from '@react-spring/web';

const Preloader = () => {
    const [isVisible, setIsVisible] = useState(true);

    const transitions = useTransition(isVisible, {
        from: { opacity: 1 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 500 },
        onRest: () => setIsVisible(false),
    });

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(false), 1500); // Preloader duration
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {transitions((style, item) =>
                item && (
                    <animated.div
                        style={style}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-white/50 backdrop-blur-lg"
                    >



                    </animated.div>
                )
            )}
        </>
    );
};

export default Preloader;