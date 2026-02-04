import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PRODUCT_PACKAGES } from '../../../../../Backend/data/products'; 
import './pricing.scss';

const Pricing: React.FC = () => {
    const { t } = useTranslation();
    
    const sessionGroups = [
        { type: '2 Sessions', duration: '90 min', key: 'option2' },
        { type: '1.5 Sessions', duration: '70 min', key: 'option15' },
        { type: '1 Session', duration: '45 min', key: 'option1' }
    ];

    useEffect(() => {
        document.body.style.backgroundColor = '#171717'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <main className="pricing-senior-engine">
            <div className="container">
                {/* Header Section */}
                <header className="compact-hero">
                    <div className="hero-content">
                        <span className="eyebrow">{t('howItWorksPage.sidebarTitle')}</span>
                        <h1 className="main-title">{t('howItWorksPage.title')}</h1>
                        <p className="description-lead">{t('howItWorksPage.intro')}</p>
                    </div>
                </header>

                {/* Pricing Cards */}
                <section className="pricing-matrix">
                    {sessionGroups.map((group) => (
                        <article key={group.type} className="matrix-column">
                            <div className="column-header">
                                <h3>{group.type}</h3>
                                <span className="meta-tag">{group.duration}</span>
                            </div>
                            <div className="rates-list">
                                {PRODUCT_PACKAGES
                                    .filter(p => p.sessionType === group.type)
                                    .map(pkg => (
                                        <div key={pkg.id} className="rate-row">
                                            <span className="pkg-name">{pkg.name}</span>
                                            <span className="pkg-value">{pkg.price} CHF</span>
                                        </div>
                                    ))}
                            </div>
                            <div className="column-footer">
                                <p>{t(`howItWorksPage.${group.key}FullDesc`)}</p>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Important Bottom Info */}
                <section className="details-grid">
                    <div className="content-shard">
                        <span className="label">{t('howItWorksPage.levelsTitle')}</span>
                        <p className="important-text">{t('howItWorksPage.levelsText')}</p>
                    </div>
                    <div className="content-shard">
                        <span className="label">{t('howItWorksPage.formatExpectationsTitle')}</span>
                        <p className="important-text">{t('howItWorksPage.formatExpectationsText')}</p>
                    </div>
                </section>

                {/* Booking Bridge */}
                <Link to="/courses" className="bridge-link">
                    <div className="text-stack">
                        <span className="top-line">{t('howItWorksPage.coursesLinkTitle')}</span>
                        <span className="sub-line">{t('howItWorksPage.coursesLinkSub')}</span>
                    </div>
                    <div className="icon-wrap">
                        <span className="arrow-svg">→</span>
                    </div>
                </Link>

                {/* Policy Matrix */}
                <footer className="policy-matrix">
                    <div className="policy-block">
                        <span className="block-label">{t('howItWorksPage.bookingTitle')}</span>
                        <p>{t('howItWorksPage.bookingText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label">{t('howItWorksPage.refundTitle')}</span>
                        <p>{t('howItWorksPage.refundText')}</p>
                    </div>
                    <div className="policy-block">
                        <span className="block-label">{t('howItWorksPage.locationTitle')}</span>
                        <p>{t('howItWorksPage.locationText')}</p>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default Pricing;
