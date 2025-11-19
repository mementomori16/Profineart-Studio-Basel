// src/components/common/DateSelector/DateSelector.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import base styles for datepicker
import { Product } from '../../components/types/Product';
import { FaCalendarAlt, FaShoppingCart } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import './dateSelector.scss'; // Import your custom SCSS

interface DateSelectorProps {
    product: Product;
}

// 🚨 Replace with your actual Stripe Publishable Key
const stripePromise = loadStripe('pk_test_51...YOUR_PUBLISHABLE_KEY...Ym'); 

// 🚨 IMPORTANT: Replace with your actual backend URL (e.g., http://localhost:3000)
const BACKEND_URL = 'http://localhost:3001'; 

const DateSelector: React.FC<DateSelectorProps> = ({ product }) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const availableDates: Date[] = [ // 🚨 TODO: Replace with dynamic data from your backend
        new Date(2025, 11, 1),
        new Date(2025, 11, 3),
        new Date(2025, 11, 5),
    ];
    
    const filterAvailableDates = (date: Date) => {
        // Simple filter logic: check if date is in the availableDates array (day/month/year match)
        return availableDates.some(
            (availableDate) => 
                availableDate.getDate() === date.getDate() &&
                availableDate.getMonth() === date.getMonth() &&
                availableDate.getFullYear() === date.getFullYear()
        );
    };

    const handleCheckout = async () => {
        if (!selectedDate) {
            alert(t('checkout.selectDateError') || 'Please select an available date for the course.');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Call your Node.js backend to create the Stripe Checkout Session
            const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: product.stripePriceId,
                    courseId: product.id,
                    selectedDate: selectedDate.toISOString().split('T')[0], // YYYY-MM-DD
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session on the server.');
            }

            const session = await response.json();
            
            // 2. Redirect the user to Stripe Checkout
            const stripe = await stripePromise;
            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });
                
                if (result.error) {
                    alert(result.error.message);
                }
            }

        } catch (error) {
            console.error('Checkout Error:', error);
            alert(t('checkout.generalError') || 'An error occurred during checkout. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="date-selector-container">
            <h4><FaCalendarAlt /> {t('checkout.pickDateTitle') || '1. Pick Your Course Date'}</h4>
            
            <DatePicker
                selected={selectedDate}
                onChange={(date: Date | null) => setSelectedDate(date)}
                dateFormat="dd MMMM yyyy"
                minDate={new Date()}
                filterDate={filterAvailableDates}
                placeholderText={t('checkout.selectDatePlaceholder') || 'Select a date from the calendar'}
                className="date-input"
                isClearable={true}
            />

            <button
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={!selectedDate || isProcessing}
            >
                {isProcessing ? (
                    t('checkout.processing') || 'Processing...'
                ) : (
                    <>
                        <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                        {t('checkout.buyNow') || 'Buy Now'} for ${product.price.toFixed(2)}
                    </>
                )}
            </button>
            
            {/* Displaying price clearly */}
            <p className="text-center" style={{marginTop: '0.5rem', color: '#888'}}>
                {t('checkout.feeNote') || 'Fees applied at checkout.'}
            </p>
        </div>
    );
};

export default DateSelector;