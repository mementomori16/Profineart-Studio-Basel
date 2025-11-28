// src/pages/SuccessPage/SuccessPage.tsx

import React, { useEffect, useState, useRef } from 'react'; // 🔥 ADDED useRef
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './sucsessPage.scss'; // Assuming you have a style file

// Define the expected structure of the fulfilled order data
interface OrderFulfillmentResult {
    success: boolean;
    message: string;
    bookingDetails?: {
        name: string;
        email: string;
        date: string;
        time: string;
        package: string;
        // 🔥 ADDED phone and message to the expected return type
        phone: string; 
        message: string;
    };
}

const SuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderFulfillmentResult['bookingDetails'] | null>(null);
    
    // 🔥 NEW: Ref to track if fulfillment has been called (fixes React Strict Mode double-call)
    const isFulfilledRef = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        if (!sessionId) {
            setError(t('successPage.error.missingSession'));
            setIsLoading(false);
            return;
        }
        
        // 🔥 CRITICAL IDEMPOTENCY FIX: Only proceed if the session ID is present AND we haven't fulfilled yet
        if (isFulfilledRef.current) {
            return; // Skip execution if already called
        }

        isFulfilledRef.current = true; // Set lock immediately

        const fulfillOrder = async () => {
            try {
                // Call the new backend endpoint to fulfill the order
                const response = await axios.post<OrderFulfillmentResult>('/api/order/fulfill', { sessionId });

                if (response.data.success && response.data.bookingDetails) {
                    setOrderData(response.data.bookingDetails);
                    // Cleanup: Clear local storage keys upon successful booking
                    localStorage.removeItem('bookingSlotSelection');
                    localStorage.removeItem('bookingCustomerDetails');
                } else {
                    // Handle server-side failure messages
                    setError(response.data.message || t('successPage.error.fulfillmentFailed'));
                }
            } catch (err) {
                console.error("Order fulfillment API error:", err);
                setError(t('successPage.error.networkError'));
            } finally {
                setIsLoading(false);
            }
        };

        fulfillOrder();
    }, [location.search, t, navigate]);

    if (isLoading) {
        return (
            <div className="success-page container">
                <p>{t('common.processing')}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="success-page container error-state">
                <h2>{t('successPage.title.error')}</h2>
                <p>{error}</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    {t('common.backToHome')}
                </button>
            </div>
        );
    }
    
    // Successful Confirmation View
    return (
        <div className="success-page container success-state">
            <h2 className="success-title">🎉 {t('successPage.title.success')} 🎉</h2>
            <p className="success-message">
                {t('successPage.message.confirmation')}
            </p>

            {orderData && (
                <div className="confirmation-details">
                    <h3>{t('successPage.detailsTitle')}</h3>
                    <ul>
                        <li><strong>{t('common.name')}:</strong> {orderData.name}</li>
                        <li><strong>{t('common.email')}:</strong> {orderData.email}</li>
                        <li><strong>{t('common.service')}:</strong> {orderData.package}</li>
                        <li><strong>{t('common.date')}:</strong> {orderData.date} @ {orderData.time}</li>
                        {/* You can optionally show phone/message here if you want: */}
                        <li><strong>{t('common.phone')}:</strong> {orderData.phone}</li> 
                        <li><strong>{t('common.message')}:</strong> {orderData.message}</li>
                    </ul>
                </div>
            )}

            <p className="email-note">{t('successPage.message.emailSent')}</p>
            
            <button className="btn-primary" onClick={() => navigate('/')}>
                {t('common.backToHome')}
            </button>
        </div>
    );
};

export default SuccessPage;