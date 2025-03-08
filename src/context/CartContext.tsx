'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type CartContextType = {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
};

export const CartContext = createContext<CartContextType>({
    isCartOpen: false,
    openCart: () => { },
    closeCart: () => { },
    toggleCart: () => { },
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false)

    const openCart = () => {
        setIsCartOpen(true)
    }

    const closeCart = () => {
        setIsCartOpen(false)
    }

    const toggleCart = () => {
        setIsCartOpen(prev => !prev)
    }

    return (
        <CartContext.Provider value={{
            isCartOpen,
            openCart,
            closeCart,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart must be used within a CartProvider')
    return context
} 