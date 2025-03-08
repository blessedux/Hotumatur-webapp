import { Suspense } from 'react';
import TourContent from './TourContent';

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = params;

    return (
        <Suspense fallback={
            <div className="min-h-screen pt-[120px] flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        }>
            <TourContent slug={slug} />
        </Suspense>
    );
} 