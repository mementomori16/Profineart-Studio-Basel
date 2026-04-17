import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CONSULTATION_PACKAGES } from '../../../../../Backend/data/products'; 
import './onlineMentorship.scss';

const OnlineMentorship: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        document.body.style.backgroundColor = '#171717'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    const handleBooking = () => {
        navigate('/order/900');
    };

    return (
        <main className="online-mentorship-engine">
            <div className="container">
                <header className="featured-hero">
                    <div className="hero-text">
                        <span className="label">{t('mentorship.label')}</span>
                        <h1>{t('mentorship.title')}</h1>
                        <div className="progress-essay">
                            <p>{t('mentorship.description')}</p>
                        </div>
                    </div>
                    <div className="hero-media">
                        <div className="exhibition-clean-frame">
                            <div className="exhibition-progressive">
                                <img 
                                    src="/assets/mentorship-hero.jpg" 
                                    alt={t('mentorship.title')} 
                                    className="premium-frame loaded" 
                                />
                            </div>
                            <div className="under-image-meta">
                                <span>{t('mentorship.heroCaption')}</span>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="pricing-matrix">
                    {CONSULTATION_PACKAGES.map((pkg) => (
                        <article key={pkg.id} className="matrix-column">
                            <div className="column-header">
                                <h3>{pkg.name}</h3>
                                <span className="meta-tag">{pkg.durationMinutes} Min</span>
                            </div>
                            <div className="rates-list">
                                <div className="rate-row">
                                    <span className="pkg-name">{t('mentorship.consultationFee')}</span>
                                    <span className="pkg-value">{pkg.price} CHF</span>
                                </div>
                            </div>
                            <div className="column-footer">
                                <p>{pkg.description}</p>
                                <button className="btn-book-now" onClick={handleBooking}>
                                    {t('mentorship.cta')}
                                </button>
                            </div>
                        </article>
                    ))}
                </section>

                <footer className="policy-matrix">
                    <div className="policy-block">
                        <span className="block-label">{t('mentorship.academicTitle')}</span>
                        <p>{t('mentorship.academicText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label">{t('mentorship.businessTitle')}</span>
                        <p>{t('mentorship.businessText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label">{t('mentorship.portfolioTitle')}</span>
                        <p>{t('mentorship.portfolioText')}</p>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default OnlineMentorship;