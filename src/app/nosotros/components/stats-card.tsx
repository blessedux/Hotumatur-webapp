'use client'
import React, { useState, useEffect, useRef } from "react";

interface StatsCardProps {
    number: number; // Change type to number for animation
    label: string;
    icon: React.ReactNode;
}

export function StatsCard({ number, label, icon }: StatsCardProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [animatedNumber, setAnimatedNumber] = useState(0);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            },
            { threshold: 0.1 } // Adjust threshold if needed
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isVisible) {
            const duration = 2000; // Animation duration in ms
            const start = 0;
            const end = number;
            const stepTime = Math.abs(Math.floor(duration / end));
            let current = start;

            const timer = setInterval(() => {
                current += 1;
                if (current >= end) {
                    clearInterval(timer);
                    current = end;
                }
                setAnimatedNumber(current);
            }, stepTime);

            return () => clearInterval(timer);
        } else {
            setAnimatedNumber(0); // Reset to 0 when out of view
        }
    }, [isVisible, number]);

    return (
        <div ref={elementRef} className="flex flex-col items-center space-y-2 p-4">
            {/* Icon */}
            <div className="rounded-full bg-primary/10 p-2 text-primary text-3xl">
                {icon}
            </div>
            {/* Number */}
            <h3 className="text-2xl font-bold">{animatedNumber}</h3>
            {/* Label */}
            <p className="text-sm text-muted-foreground text-center">{label}</p>
        </div>
    );
}