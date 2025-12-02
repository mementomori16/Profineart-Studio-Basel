import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Product } from '../../../../Backend/types/Product'; // Adjust path

export type CartItem = Product;

interface CartContextType {
    cart: CartItem[];
    addItemToCart: (product: Product) => void;
    removeItemFromCart: (productId: number) => void;
    clearCart: () => void;
    isProductInCart: (productId: number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'eCommercePaintingCart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        try {
            return storedCart ? JSON.parse(storedCart) : [];
        } catch {
            console.error("Failed to parse cart from Local Storage.");
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, [cart]);

    const isProductInCart = (productId: number) => cart.some(item => item.id === productId);

    const addItemToCart = (product: Product) => {
        setCart(prevCart => {
            if (prevCart.some(item => item.id === product.id)) return prevCart;
            return [...prevCart, product];
        });
    };

    const removeItemFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart, isProductInCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
};
