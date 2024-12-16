import React from "react";
import { cn } from "@/lib/utils"; // Ensure you have a utility to handle class merging.

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
    const variants = {
        default: "bg-gray-200 text-gray-800",
        secondary: "bg-gray-800 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
        danger: "bg-red-500 text-white",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}