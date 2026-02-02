import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { artistProfile } from '../../../../../Backend/data/products'; 
import './about.scss';

const About: React.FC = () => {
    const { t } = useTranslation();
    
    // Separate state for each carousel
    const [topIdx, setTopIdx] = useState(0);
    const [bottomIdx, setBottomIdx] = useState(0);

    const topImages = artistProfile.slice(0, 2);
    const bottomImages = artistProfile.slice(2, 4);

    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    // Handlers for Top Carousel
    const topNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTopIdx((prev) => (prev + 1) % topImages.length);
    };
    const topPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTopIdx((prev) => (prev === 0 ? topImages.length - 1 : prev - 1));
    };

    // Handlers for Bottom Carousel
    const bottomNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setBottomIdx((prev) => (prev + 1) % bottomImages.length);
    };
    const bottomPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setBottomIdx((prev) => (prev === 0 ? bottomImages.length - 1 : prev - 1));
    };

    return (
        <section className="about-v2026-root">
            <div className="container">
                <header className="about-header">
                    <h2 className="about-main-title">{t('aboutPage.title')}</h2>
                </header>

                <div className="about-grid">
                    <div className="text-column">
                        <p className="lead-text">{t('aboutPage.intro')}</p>
                        <div className="features-stack">
                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.mobileTitle')}</h4>
                                <p className="item-body">{t('aboutPage.mobileText')}</p>
                            </div>
                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.backgroundTitle')}</h4>
                                <p className="item-body">{t('aboutPage.backgroundText')}</p>
                            </div>
                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.methodologyTitle')}</h4>
                                <p className="item-body">{t('aboutPage.methodologyText')}</p>
                            </div>
                        </div>
                    </div>

                    <aside className="sidebar-column">
                        {/* TOP CAROUSEL */}
                        <div className="image-box">
                            {topImages[topIdx] && (
                                <img src={topImages[topIdx].lowResUrl} alt="Process Top" />
                            )}
                            <div className="arrows-container">
                                <button type="button" onClick={topPrev}>←</button>
                                <button type="button" onClick={topNext}>→</button>
                            </div>
                        </div>

                        {/* BOTTOM CAROUSEL */}
                        <div className="image-box second-carousel">
                            {bottomImages[bottomIdx] && (
                                <img src={bottomImages[bottomIdx].lowResUrl} alt="Process Bottom" />
                            )}
                            <div className="arrows-container">
                                <button type="button" onClick={bottomPrev}>←</button>
                                <button type="button" onClick={bottomNext}>→</button>
                            </div>
                        </div>

                        <a href="https://artfacts.net/artist/ilya-medvedev-1981-ch" target="_blank" rel="noopener noreferrer" className="artfacts-link">
                            <span>ARTFACTS PROFILE</span>
                            <span className="arrow">↗</span>
                        </a>
                    </aside>
                </div>
            </div>
        </section>
    );
};

export default About;
