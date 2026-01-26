import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './sucsessPage.scss';

// Updated to match the backend FulfillmentDetails
interface OrderFulfillmentResult {
    success: boolean;
    result?: {
        name: string;
        email: string;
        date: string;
        time: string;
        package: string;
        phone: string; 
        message: string;
        birthdate: string;
        address: string; // 1. Added address here
    };
    message?: string;
}

const SuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderFulfillmentResult['result'] | null>(null);
    
    const isFulfilledRef = useRef(false);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const sessionId = query.get('session_id');

        if (!sessionId) {
            setError(t('successPage.error.missingSession', 'Session ID is missing.'));
            setIsLoading(false);
            return;
        }
        
        if (isFulfilledRef.current) return;
        isFulfilledRef.current = true; 

        const fulfillOrder = async () => {
            try {
                const response = await axios.post<OrderFulfillmentResult>('/api/order/fulfill', { sessionId });

                if (response.data.success && response.data.result) {
                    setOrderData(response.data.result);
                    
                    localStorage.removeItem('bookingSlotSelection');
                    localStorage.removeItem('bookingCustomerDetails');
                } else {
                    setError(response.data.message || t('successPage.error.fulfillmentFailed', 'Fulfillment failed.'));
                }
            } catch (err) {
                console.error("Fulfillment error:", err);
                setError(t('successPage.error.networkError', 'A network error occurred. Please check your email.'));
            } finally {
                setIsLoading(false);
            }
        };

        fulfillOrder();
    }, [location.search, t]);

    if (isLoading) {
        return (
            <div className="success-page container">
                <div className="loading-spinner">
                    <p>{t('common.processing', 'Processing your booking...')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="success-page container error-state">
                <h2>{t('successPage.title.error', 'Something went wrong')}</h2>
                <p>{error}</p>
                <button className="btn-primary" onClick={() => navigate('/')}>
                    {t('common.backToHome', 'Back to Home')}
                </button>
            </div>
        );
    }
    
    return (
        <div className="success-page container success-state">
            <h2 className="success-title">
                🎉 {t('successPage.title.success', 'Booking Successful')} 🎉
            </h2>
            
            <p className="success-message">
                {t('successPage.message.confirmation', 'Thank you! Your payment was successful and your booking is confirmed.')}
            </p>

            {orderData && (
                <div className="confirmation-details">
                    <h3>{t('successPage.detailsTitle', 'Booking Details')}</h3>
                    <ul className="details-list">
                        <li>
                            <strong>{t('common.name', 'Name')}:</strong> {orderData.name}
                        </li>
                        <li>
                            <strong>{t('common.email', 'Email')}:</strong> {orderData.email}
                        </li>
                        {/* 2. Added Address to the display list */}
                        <li>
                            <strong>{t('common.address', 'Billing Address')}:</strong> {orderData.address}
                        </li>
                        <li>
                            <strong>{t('common.service', 'Service')}:</strong> {orderData.package}
                        </li>
                        <li>
                            <strong>{t('common.date', 'Date')}:</strong> {orderData.date} @ {orderData.time}
                        </li>
                        <li>
                            <strong>{t('common.phone', 'Phone')}:</strong> {orderData.phone}
                        </li> 
                        <li>
                            <strong>{t('common.message', 'Message')}:</strong> {orderData.message}
                        </li>
                    </ul>
                </div>
            )}

            <p className="email-note">
                {t('successPage.message.emailSent', 'A confirmation email has been sent to your inbox.')}
            </p>
            
            <div className="actions">
                <button className="btn-primary" onClick={() => navigate('/')}>
                    {t('common.backToHome', 'Back to Home')}
                </button>
            </div>
        </div>
    );
};

export default SuccessPage;