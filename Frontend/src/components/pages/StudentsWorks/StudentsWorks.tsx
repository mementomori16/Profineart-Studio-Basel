import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import StudentArtwork from '../ArtworkByStudent/StudentArtwork'; 
import './studentsWorks.scss';

interface ProgressiveImageProps {
    lowRes: string;
    highRes: string;
    alt: string;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({ lowRes, highRes, alt }) => {
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
        <div className="progressive-container">
            {/* Background layer to fill empty space with color-matched blur */}
            <img src={currentSrc} aria-hidden="true" className="bg-blur-layer" />
            
            {/* Main Image - Contain ensures the full work is visible */}
            <img 
                src={currentSrc} 
                alt={alt} 
                className={`premium-frame ${isLoaded ? 'loaded' : 'loading'}`} 
            />
        </div>
    );
};

const StudentsWorks: React.FC = () => {
    const { t } = useTranslation();
    const [hours, setHours] = useState(10);
    const [heroIndex, setHeroIndex] = useState(0);

    const slides = t('studentsGallery.hero.slides', { returnObjects: true }) as any[];

    const nextSlide = () => setHeroIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setHeroIndex((prev) => (prev - 1 + slides.length) % slides.length);

    useEffect(() => {
        document.body.style.backgroundColor = '#121212'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="students-gallery-root">
            <div className="container">
                
                {/* HERO SECTION */}
                <section className="featured-hero">
                    <div className="hero-text">
                        <span className="label">{t('studentsGallery.hero.label')}</span>
                        <h2>{t('studentsGallery.hero.title')}</h2>
                        <div className="progress-essay">
                            <p>{t('studentsGallery.hero.description')}</p>
                        </div>
                    </div>

                    <div className="hero-carousel-container">
                        <div className="carousel-wrapper">
                            <ProgressiveImage 
                                lowRes={slides[heroIndex].lowRes} 
                                highRes={slides[heroIndex].highRes} 
                                alt={slides[heroIndex].title} 
                            />
                            
                            <button className="nav-btn prev" onClick={prevSlide}>&#10229;</button>
                            <button className="nav-btn next" onClick={nextSlide}>&#10230;</button>
                        </div>

                        <div className="hero-artwork-titles">
                            <span className="art-title">{slides[heroIndex].title}</span>
                            <span className="student-info">{slides[heroIndex].info}</span>
                        </div>
                    </div>
                </section>

                {/* CALCULATOR */}
                <section className="timeline-calculator">
                    <h3>{t('studentsGallery.calculator.title')}</h3>
                    <p>{t('studentsGallery.calculator.subtitle')}</p>
                    <input 
                        type="range" min="4" max="40" 
                        value={hours} 
                        onChange={(e) => setHours(parseInt(e.target.value))} 
                    />
                    <div className="hours-display">{hours} {t('studentsGallery.calculator.hoursPerWeek')}</div>
                    <div className="results-wrap">
                        <div className="res-item">
                            <span>{t('studentsGallery.calculator.foundations')}</span>
                            <strong>{Math.round(80 / hours)} Weeks</strong>
                        </div>
                        <div className="res-item">
                            <span>{t('studentsGallery.calculator.graduation')}</span>
                            <strong>{Math.round(320 / hours)} Weeks</strong>
                        </div>
                    </div>
                </section>

                {/* MENTORSHIP */}
                <section className="carousel-section-wrap">
                    <div className="carousel-sidebar">
                        <span className="label">{t('studentsGallery.mentorship.label')}</span>
                        <h3>{t('studentsGallery.mentorship.title')}</h3>
                        <div className="observation-content">
                            <p>{t('studentsGallery.mentorship.para1')}</p>
                            <p>{t('studentsGallery.mentorship.para2')}</p>
                        </div>
                    </div>
                    <div className="carousel-main">
                        <StudentArtwork />
                    </div>
                </section>

                {/* PILLARS */}
                <section className="curriculum-pillars">
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>{t('studentsGallery.pillars.one.title')}</h5>
                        <p>{t('studentsGallery.pillars.one.description')}</p>
                    </div>
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>{t('studentsGallery.pillars.two.title')}</h5>
                        <p>{t('studentsGallery.pillars.two.description')}</p>
                    </div>
                    <div className="pillar-item">
                        <div className="pillar-icon">◈</div>
                        <h5>{t('studentsGallery.pillars.three.title')}</h5>
                        <p>{t('studentsGallery.pillars.three.description')}</p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default StudentsWorks;