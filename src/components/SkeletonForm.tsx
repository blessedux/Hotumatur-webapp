const SkeletonForm = () => {
    return (
        <div className="grid gap-4 md:grid-cols-[1fr_1.5fr_1fr_auto] items-end animate-pulse">
            <div className="space-y-2">
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-5 w-20 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="space-y-2">
                <div className="h-5 w-24 bg-gray-300 rounded"></div>
                <div className="h-10 w-full bg-gray-300 rounded"></div>
            </div>
            <div className="h-10 w-32 bg-gray-300 rounded self-end"></div>
        </div>
    );
};

export default SkeletonForm;