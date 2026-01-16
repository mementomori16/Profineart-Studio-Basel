import React from 'react';
import { useTranslation } from 'react-i18next';
import './Text.scss';

const Text: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="text-component-section">
            <div className="container">
                <div className="text-layout">
                    <div className="text-header">
                        <h2 className="text-main-title">{t('textComponent.title')}</h2>
                        <h3 className="text-subtitle">{t('textComponent.subtitle')}</h3>
                    </div>
                    
                    <div className="text-grid">
                        <div className="text-grid-item primary">
                            <p>{t('textComponent.experience')}</p>
                        </div>
                        
                        <div className="text-grid-item">
                            <h4 className="item-title">The Curriculum</h4>
                            <p>{t('textComponent.curriculum')}</p>
                        </div>

                        <div className="text-grid-item">
                            <h4 className="item-title">Professional Standards</h4>
                            <div className="standards-list">
                                <p><strong>{t('textComponent.labelBackground')}</strong> {t('textComponent.textBackground')}</p>
                                <p><strong>{t('textComponent.labelSpecialization')}</strong> {t('textComponent.textSpecialization')}</p>
                                <p><strong>{t('textComponent.labelCommunication')}</strong> {t('textComponent.textCommunication')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Text;