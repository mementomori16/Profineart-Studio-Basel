import React from 'react';
import { useTranslation } from 'react-i18next';
import './baselServiceMap.scss';

const BaselServiceArea: React.FC = () => {
    const { t } = useTranslation();

    // We retrieve the array of locations from the JSON
    // 'returnObjects: true' allows us to map through the array
    const locations = t('serviceArea.locations', { returnObjects: true }) as Array<{
        id: string;
        title: string;
        subtitle: string;
        text: string;
    }>;

    return (
        <section className="service-area-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="service-main-title">{t('serviceArea.title')}</h2>
                </header>
                
                <div className="service-description-wrapper">
                    <p className="description-text">
                        {t('serviceArea.mainDescription')}
                    </p>
                </div>

                <div className="locations-wide-grid">
                    {Array.isArray(locations) && locations.map((location) => (
                        <article key={location.id} className="location-item">
                            <div className="location-meta">
                                <h4 className="location-title">{location.title}</h4>
                                <div className="location-subtitle">{location.subtitle}</div>
                            </div>
                            <div className="location-content">
                                <p className="location-text">
                                    {location.text}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BaselServiceArea;