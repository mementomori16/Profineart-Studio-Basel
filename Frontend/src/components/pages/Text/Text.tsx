import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './text.scss';

const Text: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="text-component-section">
            <div className="container">
                <header className="text-header">
                    <h2 className="text-main-title">{t('textComponent.title')}</h2>
                    <h3 className="text-subtitle">{t('textComponent.subtitle')}</h3>
                </header>
                
                <div className="text-grid">
                    <div className="text-grid-item primary">
                        <p>{t('textComponent.experience')}</p>
                    </div>
                    
                    {/* Curriculum */}
                    <div className="text-grid-item">
                        <h4 className="item-title">The Curriculum</h4>
                        <p className="item-body-text">{t('textComponent.curriculum')}</p>
                    </div>

                    {/* Standards */}
                    <div className="text-grid-item">
                        <h4 className="item-title">Professional Standards</h4>
                        <div className="standards-list">
                            <p className="item-body-text">
                                <strong className="label-accent">{t('textComponent.labelBackground')}</strong> 
                                {t('textComponent.textBackground')}
                            </p>
                            <p className="item-body-text">
                                <strong className="label-accent">{t('textComponent.labelSpecialization')}</strong> 
                                {t('textComponent.textSpecialization')}
                            </p>
                        </div>
                    </div>

                    {/* Founder */}
                    <div className="text-grid-item">
                        <h4 className="item-title">{t('founder.role')}</h4>
                        <div className="standards-list">
                            <p className="item-body-text">
                                <Link to="/about" className="founder-clean-link">
                                    <strong>Ilya Medvedev <span className="arrow-symbol">→</span></strong>
                                </Link>
                                {t('founder.bio')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Text;