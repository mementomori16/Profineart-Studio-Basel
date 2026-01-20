import React from 'react';
import { useTranslation } from 'react-i18next';
import './Founder.scss';

const Founder: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="founder-editorial-section">
            <div className="container">
                <div className="editorial-layout">
                    {/* Editorial Content Side */}
                    <div className="editorial-main">
                        <header className="editorial-header">
                            <h2 className="editorial-title">{t('founder.role')}</h2>
                            <div className="editorial-divider"></div>
                        </header>
                        
                        <div className="editorial-bio">
                            <p>{t('founder.bio')}</p>
                            <span className="founder-signature">— {t('founder.name')}</span>
                        </div>

                        <div className="editorial-credentials">
                            <div className="cred-item">
                                <h4>{t('founder.expertiseLabel')}</h4>
                                <p>{t('founder.expertiseValue')}</p>
                            </div>
                            <div className="cred-item">
                                <h4>{t('founder.academicLabel')}</h4>
                                <p>{t('founder.academicValue')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Side - Styled like a gallery piece */}
                    <div className="editorial-visual">
                        <div className="image-frame">
                            <img 
                                src="https://i.ibb.co/NnY8mcHR/20210815-155250120kb.jpg" 
                                alt="Studio Practice" 
                                className="studio-img"
                            />
                            <div className="image-overlay"></div>
                        </div>
                        <p className="career-snippet">{t('founder.careerValue')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Founder;