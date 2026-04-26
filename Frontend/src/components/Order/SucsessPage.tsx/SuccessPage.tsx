import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { 
    FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
    FaEnvelope, FaUser, FaBoxOpen, FaBirthdayCake, 
    FaPhone, FaCommentAlt 
} from 'react-icons/fa';

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
    birthdate: string;
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
        // If there's no session_id in the URL, we can't fulfill the order
        if (!sessionId) {
            setLoading(false);
            setError(t('checkout.errorMessage'));
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchDetails = async () => {
            try {
                const response = await axios.post('/api/order/fulfill', {
                    sessionId: sessionId
                });

                if (response.data.success && response.data.result) {
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

    if (loading) {
        return (
            <div className="success-page container">
                <div className="success-card text-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p style={{ marginTop: '1rem' }}>{t('common.loading')}...</p>
                </div>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="success-page container error-state">
                <div className="success-card text-center">
                    <h2 style={{ color: '#DC3545' }}>{t('checkout.errorTitle')}</h2>
                    <p>{error || t('checkout.errorMessage')}</p>
                    <Link to="/" className="btn-cta-secondary" style={{ marginTop: '1rem' }}>
                        {t('common.backToHome')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page container success-state">
            <div className="success-card">
                <div className="success-header">
                    <FaCheckCircle className="success-icon" />
                    <h1 className="success-title">{t('common.successTitle')}</h1>
                    <p className="success-message">{t('checkout.successMessage')}</p>
                </div>

                <div className="confirmation-details">
                    <h3>{t('checkout.bookingSummary')}</h3>
                    
                    <div className="details-grid">
                        <div className="detail-item">
                            <FaBoxOpen /> <strong>{t('checkout.summaryPackage')}:</strong> {details.packageName}
                        </div>
                        <div className="detail-item">
                            <FaUser /> <strong>{t('common.name')}:</strong> {details.name}
                        </div>
                        <div className="detail-item">
                            <FaEnvelope /> <strong>{t('common.email')}:</strong> {details.email}
                        </div>
                        <div className="detail-item">
                            <FaPhone /> <strong>{t('common.phone')}:</strong> {details.phone}
                        </div>
                        <div className="detail-item">
                            <FaBirthdayCake /> <strong>{t('common.birthdate')}:</strong> {details.birthdate}
                        </div>
                        <div className="detail-item">
                            <FaCalendarAlt /> <strong>{t('checkout.summaryDate')}:</strong> {details.date}
                        </div>
                        <div className="detail-item">
                            <FaClock /> <strong>{t('checkout.summaryTime')}:</strong> {details.time}
                        </div>
                        <div className="detail-item">
                            <FaMapMarkerAlt /> <strong>{t('checkout.addressDetails')}:</strong> {details.address}
                        </div>

                        {details.message && (
                            <div className="detail-item message-section">
                                <FaCommentAlt /> 
                                <div>
                                    <strong>{t('common.message')}:</strong>
                                    <p className="message-text">"{details.message}"</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="success-footer">
                    <div className="email-note">
                        <FaEnvelope style={{ marginRight: '10px' }} />
                        {t('common.emailNote')}
                    </div>
                    
                    <div className="actions">
                        <Link to="/" className="btn-secondary">
                            {t('common.backToHome')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;