import React from 'react';
import { useTranslation } from 'react-i18next';
import './Founder.scss';

const Founder: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="founder-section">
            <div className="container">
                <div className="founder-layout">
                    {/* Image Column */}
                    <div className="founder-image-container">
                        <img 
                            src="/images/ilya-medvedev.jpg" 
                            alt="Ilya Medvedev — Founder & Artist" 
                            className="founder-image"
                        />
                    </div>

                    {/* Content Column */}
                    <div className="founder-content">
                        <div className="founder-header">
                            <h2 className="founder-name">Ilya Medvedev</h2>
                            <h3 className="founder-title">Founder & Artist</h3>
                        </div>

                        <div className="founder-bio">
                            <p className="primary-text">
                                A contemporary fine artist and certified educator with a professional practice spanning over 1,000 works. 
                                Experience includes international gallery exhibitions, art fair collaborations, and restoration projects.
                            </p>
                            <p className="secondary-text">
                                Founder of the original fine art academy in 2011, from which ProFineArt Studio Basel was born.
                            </p>
                        </div>

                        <div className="founder-grid">
                            <div className="grid-item">
                                <h4 className="item-label">Academic</h4>
                                <p>B.Ed.FA & MFA studies (Bezalel Academy)</p>
                            </div>

                            <div className="grid-item">
                                <h4 className="item-label">Expertise</h4>
                                <p>Byzantine Iconography, material chemistry, and high-precision freehand technique</p>
                            </div>

                            <div className="grid-item full-width">
                                <h4 className="item-label">Career Practice</h4>
                                <p>
                                    Extensive history as a school founder and studio lead in Berlin, Tel Aviv, and Basel. 
                                    Professional commissions include portraiture, landscape, illustration, and specialized tattoo design.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Founder;