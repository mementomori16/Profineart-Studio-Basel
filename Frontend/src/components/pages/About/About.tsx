import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './about.scss';

const ProgressiveImage: React.FC<{ lowRes: string; highRes: string; alt: string }> = ({ lowRes, highRes, alt }) => {
    const [currentSrc, setCurrentSrc] = useState(lowRes);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setCurrentSrc(lowRes);
        setIsLoaded(false);
        const img = new Image();
        img.src = highRes;
        img.onload = () => {
            setCurrentSrc(highRes);
            setIsLoaded(true);
        };
    }, [lowRes, highRes]);

    return (
        <div className="carousel-progressive">
            <img 
                src={currentSrc} 
                alt={alt} 
                className={`premium-frame ${isLoaded ? 'loaded' : 'loading'}`} 
            />
        </div>
    );
};

const About: React.FC = () => {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);
    
    // Fallback for slides to prevent mapping errors
    const slides = t('aboutPage.slides', { returnObjects: true }) as any[] || [];

    const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        document.body.style.backgroundColor = '#171717'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="about-v2026-root">
            <div className="container">
                <section className="featured-hero">
                    <div className="hero-text">
                        {/* REPLACED HARDCODED TEXT HERE */}
                        <span className="label">{t('aboutPage.sectionLabel')}</span>
                        <h2>{t('aboutPage.title')}</h2>

                        <div className="progress-essay">
                            <div className="feature-item">
                                <p>{t('aboutPage.intro')}</p>
                            </div>

                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.mobileTitle')}</h4>
                                <p>{t('aboutPage.mobileText')}</p>
                            </div>

                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.backgroundTitle')}</h4>
                                <p style={{ whiteSpace: 'pre-line' }}>{t('aboutPage.backgroundText')}</p>
                            </div>

                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.methodologyTitle')}</h4>
                                <p style={{ whiteSpace: 'pre-line' }}>{t('aboutPage.methodologyText')}</p>
                            </div>

                            <div className="feature-item">
                                <h4 className="item-label">{t('aboutPage.studentLevelsTitle')}</h4>
                                <p>{t('aboutPage.studentLevelsText')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="hero-media">
                        <div className="hero-carousel-container">
                            <div className="carousel-wrapper">
                                {slides.length > 0 && (
                                    <ProgressiveImage 
                                        lowRes={slides[index]?.lowRes} 
                                        highRes={slides[index]?.highRes} 
                                        alt={slides[index]?.caption} 
                                    />
                                )}
                                <button className="nav-btn prev" onClick={prevSlide} aria-label="Previous image">&#8249;</button>
                                <button className="nav-btn next" onClick={nextSlide} aria-label="Next image">&#8250;</button>
                            </div>
                            <div className="hero-artwork-titles">
                                <span className="art-title">{slides[index]?.caption}</span>
                                <a 
                                    href="https://artfacts.net/artist/ilya-medvedev-1981-ch" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="artfacts-link-box"
                                >
                                    {t('aboutPage.artFactsLink')} ↗
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
