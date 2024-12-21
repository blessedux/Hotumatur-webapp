// components/FadeIn.js
import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";

const FadeIn = ({ children, delay = 0 }) => {
    const { ref, inView } = useInView({
        threshold: 0.1, // Trigger when 10% of the element is visible
        triggerOnce: true, // Only trigger once
    });

    const styles = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(20px)",
        config: { tension: 120, friction: 14 },
        delay: delay * 1000, // Delay in milliseconds
    });

    return (
        <animated.div ref={ref} style={styles}>
            {children}
        </animated.div>
    );
};

export default FadeIn;