import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaEnvelope, FaUser, FaBoxOpen } from 'react-icons/fa';

import './successPage.scss';

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
        if (!sessionId || hasFetched.current) return;
        hasFetched.current = true;

        const fetchDetails = async () => {
            try {
                const response = await axios.get(`/api/order-success?session_id=${sessionId}`);
                setDetails(response.data.details);
            } catch (err: any) {
                setError(t('checkout.errorFetchingDetails'));
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [sessionId, t]);

    if (loading) return <div className="success-page-loading">{t('common.loading')}...</div>;

    if (error || !details) {
        return (
            <div className="success-page-error">
                <h1>{t('common.error')}</h1>
                <p>{error || t('checkout.sessionNotFound')}</p>
                <Link to="/" className="btn-primary-custom">{t('common.backToHome')}</Link>
            </div>
        );
    }

    return (
        <div className="success-page container">
            <div className="success-card">
                <div className="success-header">
                    <FaCheckCircle className="success-icon" />
                    <h1>{t('checkout.paymentSuccessful')}</h1>
                    <p>{t('checkout.confirmationSent')} {details.email}</p>
                </div>

                <div className="details-grid">
                    {/* Added Service Title back to the top of the grid */}
                    <div className="detail-item full-width">
                        <FaBoxOpen />
                        <div>
                            <label>{t('checkout.summaryPackage')}</label>
                            <span>{details.packageName}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <FaUser />
                        <div>
                            <label>{t('form.name')}</label>
                            <span>{details.name}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <FaEnvelope />
                        <div>
                            <label>{t('form.email')}</label>
                            <span>{details.email}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <FaCalendarAlt />
                        <div>
                            <label>{t('checkout.summaryDate')}</label>
                            <span>{details.date}</span>
                        </div>
                    </div>

                    <div className="detail-item">
                        <FaClock />
                        <div>
                            <label>{t('checkout.summaryTime')}</label>
                            <span>{details.time}</span>
                        </div>
                    </div>

                    <div className="detail-item full-width">
                        <FaMapMarkerAlt />
                        <div>
                            <label>{t('checkout.addressDetails')}</label>
                            <span>{details.address}</span>
                        </div>
                    </div>
                </div>

                <div className="success-footer">
                    <p>{t('checkout.thankYouMessage')}</p>
                    <div className="actions">
                        <Link to="/" className="btn-secondary">{t('common.backToHome')}</Link>
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