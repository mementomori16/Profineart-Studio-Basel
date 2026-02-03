import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PRODUCT_PACKAGES } from '../../../../../Backend/data/products'; 
import './pricing.scss';

const Pricing: React.FC = () => {
    const { t } = useTranslation();
    
    const sessionGroups = [
        { type: '2 Sessions', duration: '90 minutes' },
        { type: '1.5 Sessions', duration: '70 minutes' },
        { type: '1 Session', duration: '45 minutes' }
    ];

    return (
        <div className="cardPageContainer pricing-how-it-works">
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t('howItWorksPage.title')}</h1>
                </div>

                <div className="cardContentLayout">
                    <div className="column-left">
                        <div className="main-info-frame">
                            <p className="intro-text">{t('howItWorksPage.intro')}</p>

                            {/* NEW: Student Levels */}
                            <div className="section-block">
                                <h3>{t('howItWorksPage.levelsTitle')}</h3>
                                <p>{t('howItWorksPage.levelsText')}</p>
                            </div>

                            {/* NEW: Learning Format & Responsibility */}
                            <div className="section-block">
                                <h3>{t('howItWorksPage.formatExpectationsTitle')}</h3>
                                <p>{t('howItWorksPage.formatExpectationsText')}</p>
                            </div>

                            <div className="section-block">
                                <h3>{t('howItWorksPage.option2Title')}</h3>
                                <p>{t('howItWorksPage.option2FullDesc')}</p>
                                
                                <h3>{t('howItWorksPage.option15Title')}</h3>
                                <p>{t('howItWorksPage.option15FullDesc')}</p>
                                
                                <h3>{t('howItWorksPage.option1Title')}</h3>
                                <p>{t('howItWorksPage.option1FullDesc')}</p>
                            </div>

                            <Link to="/courses" className="course-link-box">
                                <div className="link-text-content">
                                    <span className="link-title">{t('howItWorksPage.coursesLinkTitle')}</span>
                                    <span className="link-desc">{t('howItWorksPage.coursesLinkSub')}</span>
                                </div>
                                <span className="arrow-icon">→</span>
                            </Link>

                            <div className="section-block">
                                <h3>{t('howItWorksPage.locationTitle')}</h3>
                                <p>{t('howItWorksPage.locationText')}</p>
                                
                                <h3>{t('howItWorksPage.bookingTitle')}</h3>
                                <p>{t('howItWorksPage.bookingText')}</p>
                                
                                <h3>{t('howItWorksPage.refundTitle')}</h3>
                                <p>{t('howItWorksPage.refundText')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="column-right">
                        <div className="price-sidebar-frame">
                            <h2 className="sidebar-title">{t('howItWorksPage.sidebarTitle')}</h2>
                            {sessionGroups.map((group) => (
                                <div key={group.type} className="price-group">
                                    <h4 className="group-label">{group.type}</h4>
                                    <span className="duration-sublabel">{group.duration}</span>
                                    {PRODUCT_PACKAGES
                                        .filter(p => p.sessionType === group.type)
                                        .map(pkg => (
                                            <div key={pkg.id} className="price-row">
                                                <span>{pkg.name}</span>
                                                <span className="pkg-price">{pkg.price} CHF</span>
                                            </div>
                                        ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
