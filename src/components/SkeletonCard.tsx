const SkeletonCard = () => {
    return (
        <div className="animate-pulse space-y-4 rounded-lg border p-4 shadow-md">
            <div className="h-40 w-full rounded bg-gray-300"></div>
            <div className="h-6 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
        </div>
    );
};

export default SkeletonCard;