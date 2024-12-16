import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioGroupVariants = cva("flex flex-col space-y-2");

const radioItemVariants = cva(
    "relative flex items-center justify-center w-5 h-5 border-2 rounded-full border-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    {
        variants: {
            checked: {
                true: "border-primary bg-primary",
                false: "border-input",
            },
        },
        defaultVariants: {
            checked: false,
        },
    }
);

export const RadioGroup = React.forwardRef<
    React.ElementRef<"div">,
    React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof radioGroupVariants>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn(radioGroupVariants(), className)} {...props} />
));
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef<
    React.ElementRef<"input">,
    React.ComponentPropsWithoutRef<"input"> &
    VariantProps<typeof radioItemVariants>
>(({ className, checked, ...props }, ref) => (
    <label className="inline-flex items-center space-x-2">
        <input
            type="radio"
            ref={ref}
            checked={checked}
            className="sr-only peer"
            {...props}
        />
        <span
            className={cn(radioItemVariants({ checked }), className)}
            aria-hidden="true"
        >
            <span className="w-2.5 h-2.5 bg-primary rounded-full" />
        </span>
    </label>
));
RadioGroupItem.displayName = "RadioGroupItem";