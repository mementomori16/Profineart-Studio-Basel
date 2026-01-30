import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEnvelope, FaUser, FaBoxOpen } from 'react-icons/fa';

import './sucsessPage.scss';

interface BookingDetails {
    name: string;
    email: string;
    date: string;
    time: string;
    packageName: string;
    phone: string;
    address: string; 
    message: string;
}

const SuccessPage: React.FC = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<BookingDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        // Prevents double-fetching in React Strict Mode
        if (!sessionId || hasFetched.current) return;
        hasFetched.current = true;

        const fetchDetails = async () => {
            try {
                // FIXED: Changed from .get to .post and used the correct route
                // This matches your index.ts router.post("/order/fulfill", ...)
                const response = await axios.post('/api/order/fulfill', {
                    sessionId: sessionId
                });

                // FIXED: Your backend returns 'result', so we map it here
                if (response.data.success) {
                    setDetails(response.data.result);
                } else {
                    setError(t('checkout.errorMessage'));
                }
            } catch (err: any) {
                console.error("Fulfillment Fetch Error:", err);
                setError(t('checkout.errorMessage'));
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [sessionId, t]);

    if (loading) return <div className="success-page-loading">{t('common.loading')}...</div>;

    // Error State
    if (error || !details) {
        return (
            <div className="success-page container error-state">
                <h2>{t('checkout.errorTitle')}</h2>
                <p>{error || t('checkout.errorMessage')}</p>
                <Link to="/" className="btn-primary-custom">{t('common.backToHome')}</Link>
            </div>
        );
    }

    // Success State - Using the exact keys from your JSON
    return (
        <div className="success-page container success-state">
            <div className="success-card">
                <div className="success-header">
                    <FaCheckCircle className="success-icon" style={{ color: '#4CAF50', fontSize: '3rem' }} />
                    <h1 className="success-title">{t('common.successTitle')}</h1>
                    <p className="success-message">{t('checkout.successMessage')}</p>
                </div>

                <div className="confirmation-details">
                    <h3>{t('checkout.bookingSummary')}</h3>
                    
                    <div className="details-grid" style={{ textAlign: 'left', listStyle: 'none', padding: '0' }}>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaBoxOpen /> <strong>{t('checkout.summaryPackage')}:</strong> {details.packageName}
                        </div>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaUser /> <strong>{t('common.name')}:</strong> {details.name}
                        </div>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaEnvelope /> <strong>{t('common.email')}:</strong> {details.email}
                        </div>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaCalendarAlt /> <strong>{t('checkout.summaryDate')}:</strong> {details.date}
                        </div>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaClock /> <strong>{t('checkout.summaryTime')}:</strong> {details.time}
                        </div>
                        <div className="detail-item" style={{ marginBottom: '10px' }}>
                            <FaMapMarkerAlt /> <strong>{t('checkout.addressDetails')}:</strong> {details.address}
                        </div>
                    </div>
                </div>

                <div className="success-footer">
                    <p className="email-note">{t('common.emailNote')}</p>
                    <div className="actions">
                        <Link to="/" className="btn-secondary" style={{ marginRight: '10px' }}>
                            {t('common.backToHome')}
                        </Link>
                        <button onClick={() => window.print()} className="btn-primary-custom">
                            {t('checkout.printReceipt')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;