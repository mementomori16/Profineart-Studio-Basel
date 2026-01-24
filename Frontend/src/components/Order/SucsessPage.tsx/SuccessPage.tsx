// src/pages/SuccessPage/SuccessPage.tsx - FULL VERSION WITH LOGIC FIX

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './sucsessPage.scss';

// Define the expected structure of the fulfilled order data
interface OrderFulfillmentResult {
    success: boolean;
    message: string;
    // Note: Changed from bookingDetails to 'result' to match your backend's return key
    result?: {
        name: string;
        email: string;
        date: string;
        time: string;
        package: string;
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
    const [orderData, setOrderData] = useState<OrderFulfillmentResult['result'] | null>(null);
    
    // Track if fulfillment has been called (fixes React Strict Mode double-call)
    const isFulfilledRef = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        if (!sessionId) {
            setError(t('successPage.error.missingSession'));
            setIsLoading(false);
            return;
        }
        
        // IDEMPOTENCY FIX: Only proceed if we haven't fulfilled yet
        if (isFulfilledRef.current) {
            return; 
        }

        isFulfilledRef.current = true; 

        const fulfillOrder = async () => {
            try {
                // Call the backend endpoint to fulfill the order
                const response = await axios.post<OrderFulfillmentResult>('/api/order/fulfill', { sessionId });

                // CRITICAL FIX: Checking for 'result' instead of 'bookingDetails'
                if (response.data.success && response.data.result) {
                    setOrderData(response.data.result);
                    
                    // Cleanup local storage upon successful booking
                    localStorage.removeItem('bookingSlotSelection');
                    localStorage.removeItem('bookingCustomerDetails');
                } else {
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