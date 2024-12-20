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

    useEffect(() => {
        setHasMounted(true);

        if (typeof window === "undefined") return;

        let titleIndex = 0;
        let subtextIndex = 0;
        let titleInterval: NodeJS.Timeout;
        let subtextInterval: NodeJS.Timeout;

        const typeTitle = () => {
            if (titleIndex < title.length) {
                setDisplayedTitle((prev) => prev + title[titleIndex]);
                titleIndex++;
            } else {
                clearInterval(titleInterval);
                startSubtextTyping();
            }
        };

        const typeSubtext = () => {
            if (subtextIndex < subtext.length) {
                setDisplayedSubtext((prev) => prev + subtext[subtextIndex]);
                subtextIndex++;
            } else {
                clearInterval(subtextInterval);
            }
        };

        const startSubtextTyping = () => {
            setTimeout(() => {
                subtextInterval = setInterval(typeSubtext, 50);
            }, 500);
        };

        titleInterval = setInterval(typeTitle, 100);

        return () => {
            clearInterval(titleInterval);
            if (subtextInterval) {
                clearInterval(subtextInterval);
            }
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