import React from 'react';
import { useTranslation } from 'react-i18next';
import './AuthorityBar.scss';

const AuthorityBar: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="authority-bar">
            <div className="container">
                <div className="auth-wrapper">
                    {/* The Anchor: This explains what the info is about */}
                    <div className="auth-intro">
                        <h3 className="intro-title">Professional Standards</h3>
                        <p className="intro-subtitle">By Ilya Medvedev</p>
                    </div>

                    <div className="auth-grid">
                        <div className="auth-item">
                            <span className="auth-label">{t('founder.academicLabel')}</span>
                            <span className="auth-value">{t('founder.academicValue')}</span>
                        </div>
                        
                        <div className="auth-item">
                            <span className="auth-label">{t('founder.expertiseLabel')}</span>
                            <span className="auth-value">{t('founder.expertiseValue')}</span>
                        </div>
                        
                        <div className="auth-item">
                            <span className="auth-label">Experience</span>
                            <span className="auth-value">Professional practice spanning over 1,000 works</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthorityBar;