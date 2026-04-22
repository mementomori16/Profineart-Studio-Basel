import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CONSULTATION_PACKAGES } from '../../../../../Backend/data/products'; 
import { 
    FaLayerGroup, 
    FaGlobe, 
    FaCalendarCheck, 
    FaClock 
} from 'react-icons/fa'; 
import './onlineMentorship.scss';

const OnlineMentorship: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const lowRes = "https://res.cloudinary.com/dpayqcrg5/image/upload/v1776688345/002154-120kbadjusted_fsrfcw.jpg";
    const highRes = "https://res.cloudinary.com/dpayqcrg5/image/upload/v1776692095/002154-500kbadjusted_wlcx5m.jpg";
    
    const [currentImg, setCurrentImg] = useState(lowRes);

    useEffect(() => {
        document.body.style.backgroundColor = '#171717'; 
        const img = new Image();
        img.src = highRes;
        img.onload = () => setCurrentImg(highRes);
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    const handleBooking = (packageId: string) => {
        navigate('/order/900', { state: { preferredPackageId: packageId } });
    };

    return (
        <main className="online-mentorship-engine">
            <div className="container">
                <header className="featured-hero">
                    <div className="hero-text">
                        <span className="label">{t('mentorship.label')}</span>
                        <h1>{t('mentorship.title')}</h1>
                        <div className="progress-essay">
                            <div className="feature-item">
                                <p>{t('mentorship.description')}</p>
                            </div>

                            {/* This maps all the text sections from the JSON features array */}
                            {(t('mentorship.features', { returnObjects: true }) as any[]).map((feature) => (
                                <div className="feature-item" key={feature.id}>
                                    <h4 className="item-label">{feature.title}</h4>
                                    <p>{feature.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-media">
                        <div className="exhibition-clean-frame">
                            <div className="exhibition-progressive">
                                <img src={currentImg} alt={t('mentorship.title')} className="premium-frame loaded" />
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
                            <div className="unified-meta-line">
                                <div className="meta-item"><FaLayerGroup /> <span>{t('coursesPage.meta.level')}</span></div>
                                <div className="meta-item"><FaGlobe /> <span>{t('mentorship.onlineFormat')}</span></div>
                                <div className="meta-item"><FaCalendarCheck /> <span>{t('coursesPage.meta.date')}</span></div>
                                <div className="meta-item"><FaClock /> <span>{pkg.durationMinutes} Min</span></div>
                            </div>
                            <div className="rates-list">
                                <div className="rate-row">
                                    <span className="pkg-name">{t('mentorship.consultationFee')}</span>
                                    <span className="pkg-value">{pkg.price} CHF</span>
                                </div>
                            </div>
                            <div className="column-footer">
                                <p className="pkg-description">
                                    {pkg.durationMinutes === 20 ? t('mentorship.pkgDesc20') : t('mentorship.pkgDesc40')}
                                </p>
                                <button className="btn-book-now" onClick={() => handleBooking(pkg.id)}>
                                    {t('mentorship.cta')}
                                </button>
                            </div>
                        </article>
                    ))}
                </section>

                <footer className="policy-matrix">
                    <div className="policy-block">
                        <span className="block-label footer-white-label">{t('mentorship.academicTitle')}</span>
                        <p>{t('mentorship.academicText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label footer-white-label">{t('mentorship.businessTitle')}</span>
                        <p>{t('mentorship.businessText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label footer-white-label">{t('mentorship.portfolioTitle')}</span>
                        <p>{t('mentorship.portfolioText')}</p>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default OnlineMentorship;