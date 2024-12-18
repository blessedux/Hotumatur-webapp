"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
    title: string;
    subtext: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ title, subtext }) => {
    const [displayedTitle, setDisplayedTitle] = useState("");
    const [displayedSubtext, setDisplayedSubtext] = useState("");
    const [hasMounted, setHasMounted] = useState(false);

    // Run only on the client side
    useEffect(() => {
        setHasMounted(true);

        if (typeof window === "undefined") return; // Prevent running on the server

        let titleIndex = 0;
        let subtextIndex = 0;

        // Typewriter for title
        const typeTitle = () => {
            if (titleIndex < title.length) {
                setDisplayedTitle((prev) => prev + title[titleIndex]);
                titleIndex++;
            } else {
                clearInterval(titleInterval);
                startSubtextTyping();
            }
        };

        // Typewriter for subtext
        const typeSubtext = () => {
            if (subtextIndex < subtext.length) {
                setDisplayedSubtext((prev) => prev + subtext[subtextIndex]);
                subtextIndex++;
            } else {
                clearInterval(subtextInterval);
            }
        };

        // Start subtext typing after title
        const startSubtextTyping = () => {
            setTimeout(() => {
                subtextInterval = setInterval(typeSubtext, 50);
            }, 500);
        };

        let titleInterval = setInterval(typeTitle, 100);
        let subtextInterval: NodeJS.Timer;

        return () => {
            clearInterval(titleInterval);
            clearInterval(subtextInterval);
        };
    }, [title, subtext]);

    if (!hasMounted) return null;

    return (
        <>
            <h2 className="text-2xl font-semibold mb-4">{displayedTitle}</h2>
            <p className="text-zinc-300">{displayedSubtext}</p>
        </>
    );
};

export default TypewriterText;