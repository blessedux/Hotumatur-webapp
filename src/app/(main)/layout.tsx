'use client'
import NavBar from "@/components/NavBar";
import dynamic from 'next/dynamic'
import WhatsAppButton from '@/components/WhatsAppButton';


const Footer = dynamic(() => import('@/components/Footer'), {
    loading: () => <div>Loading...</div>,
});

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <div className="relative z-50">
                <NavBar />
            </div>
            {children}
            <WhatsAppButton />
            <Footer />
        </>
    )
}