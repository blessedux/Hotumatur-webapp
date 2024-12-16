export const toastVariants = {
    base: "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 shadow-lg transition-all",
    variants: {
        default: "bg-white border-gray-200",
        success: "bg-white border-l-4 text-green-900 p-6",
        error: "bg-white border-l-4 text-red-900 p-6",
        warning: "bg-white border-l-4 text-amber-900 p-6",
        info: "bg-white border-l-4 text-blue-900 p-6",
    },
    title: {
        default: "text-gray-900 text-lg font-medium",
        success: "text-hotumatur-primary text-lg font-medium",
        error: "text-red-600 text-lg font-medium",
        warning: "text-amber-600 text-lg font-medium",
        info: "text-blue-600 text-lg font-medium",
    },
    description: {
        default: "text-gray-600",
        success: "text-green-700",
        error: "text-red-700",
        warning: "text-amber-700",
        info: "text-blue-700",
    },
    animation: "data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=open]:slide-in-from-top-full data-[state=closed]:slide-out-to-right-full"
} as const;