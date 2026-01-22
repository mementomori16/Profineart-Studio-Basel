import React from 'react';
import { useTranslation } from 'react-i18next';
import './BaselServiceMap.scss'; // Use a dedicated name for this component

const BaselServiceArea: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="service-area-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="service-main-title">{t('serviceArea.title', 'Service Area')}</h2>
                </header>
                
                <div className="service-description-wrapper">
                    <p className="description-text">
                        A mobile educational project providing high-level fine art education within your own environment. 
                        The learning process is fully integrated into your personal creative setting through direct travel to your studio space.
                    </p>
                </div>

                <div className="locations-wide-grid">
                    {/* Switzerland Section */}
                    <article className="location-item">
                        <div className="location-meta">
                            <h4 className="location-title">Switzerland</h4>
                            <div className="location-subtitle">CH — Basel & Region</div>
                        </div>
                        <div className="location-content">
                            <p className="location-text">
                                Full mobile service within Basel-Stadt, Basel-Landschaft, and a 21km operational radius.
                            </p>
                        </div>
                    </article>

                    {/* Germany / France Section */}
                    <article className="location-item">
                        <div className="location-meta">
                            <h4 className="location-title">Germany / France</h4>
                            <div className="location-subtitle">DE / FR — Border Regions</div>
                        </div>
                        <div className="location-content">
                            <p className="location-text">
                                Coverage across regional border towns and the immediate Alsace and Southern Baden areas.
                            </p>
                        </div>
                    </article>

                    {/* Global / Special Request Section */}
                    <article className="location-item">
                        <div className="location-meta">
                            <h4 className="location-title">International</h4>
                            <div className="location-subtitle">Global — Special Request</div>
                        </div>
                        <div className="location-content">
                            <p className="location-text">
                                Available for travel to major Swiss hubs, European cultural centers, and international metropolitan areas for specialized projects.
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default BaselServiceArea;