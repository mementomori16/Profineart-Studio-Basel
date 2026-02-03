import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './studentsWorks.scss';

const ProgressiveImage: React.FC<{ lowRes: string; highRes: string; alt: string; isExhibition?: boolean }> = ({ lowRes, highRes, alt, isExhibition }) => {
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
        <div className={isExhibition ? "exhibition-progressive" : "carousel-progressive"}>
            <img 
                src={currentSrc} 
                alt={alt} 
                className={`premium-frame ${isLoaded ? 'loaded' : 'loading'}`} 
            />
        </div>
    );
};

const GalleryCarousel: React.FC<{ slides: any[] }> = ({ slides }) => {
    const [index, setIndex] = useState(0);
    const nextSlide = () => setIndex((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setIndex((prev) => (prev - 1 + slides.length) % slides.length);

    if (!slides || slides.length === 0) return null;

    return (
        <div className="hero-carousel-container">
            <div className="carousel-wrapper">
                <ProgressiveImage 
                    lowRes={slides[index].lowRes} 
                    highRes={slides[index].highRes} 
                    alt={slides[index].title} 
                />
                <button className="nav-btn prev" onClick={prevSlide}>&#8249;</button>
                <button className="nav-btn next" onClick={nextSlide}>&#8250;</button>
            </div>
            <div className="hero-artwork-titles">
                <span className="art-title">{slides[index].title}</span>
                <span className="student-info">{slides[index].info}</span>
            </div>
        </div>
    );
};

const StudentsWorks: React.FC = () => {
    const { t } = useTranslation();
    const [hours, setHours] = useState(10);
    const heroSlides = t('studentsGallery.hero.slides', { returnObjects: true }) as any[];
    const bottomSlides = t('studentsGallery.bottomCarousel.slides', { returnObjects: true }) as any[];

    useEffect(() => {
        document.body.style.backgroundColor = '#121212'; 
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    return (
        <div className="students-gallery-root">
            <div className="container">
                <section className="featured-hero">
                    <div className="hero-text">
                        <span className="label">{t('studentsGallery.hero.label')}</span>
                        <h2>{t('studentsGallery.hero.title')}</h2>
                        <div className="progress-essay"><p>{t('studentsGallery.hero.description')}</p></div>
                    </div>
                    <div className="hero-media"><GalleryCarousel slides={heroSlides} /></div>
                </section>

                <section className="timeline-calculator">
                    <h3>{t('studentsGallery.calculator.title')}</h3>
                    <p>{t('studentsGallery.calculator.subtitle')}</p>
                    <input type="range" min="4" max="40" value={hours} onChange={(e) => setHours(parseInt(e.target.value))} />
                    <div className="hours-display">{hours} {t('studentsGallery.calculator.hoursPerWeek')}</div>
                    <div className="results-wrap">
                        <div className="res-item"><span>{t('studentsGallery.calculator.foundations')}</span><br/><strong>{Math.round(80 / hours)} Weeks</strong></div>
                        <div className="res-item"><span>{t('studentsGallery.calculator.graduation')}</span><br/><strong>{Math.round(320 / hours)} Weeks</strong></div>
                    </div>
                </section>

                <section className="featured-hero">
                    <div className="hero-text">
                        <span className="label">{t('studentsGallery.mentorship.label')}</span>
                        <h3>{t('studentsGallery.mentorship.title')}</h3>
                        <div className="progress-essay">
                            <p>{t('studentsGallery.mentorship.para1')}</p>
                            <p>{t('studentsGallery.mentorship.para2')}</p>
                        </div>
                    </div>
                    <div className="hero-media"><GalleryCarousel slides={bottomSlides} /></div>
                </section>

                <section className="featured-hero exhibition-final-section">
                    <div className="hero-text">
                        <span className="label">{t('studentsGallery.exhibition.label')}</span>
                        <h3>{t('studentsGallery.exhibition.title')}</h3>
                        <div className="progress-essay"><p>{t('studentsGallery.exhibition.description')}</p></div>
                    </div>
                    <div className="hero-media">
                        <div className="exhibition-clean-frame">
                            <ProgressiveImage 
                                lowRes={t('studentsGallery.exhibition.lowRes')} 
                                highRes={t('studentsGallery.exhibition.highRes')} 
                                alt={t('studentsGallery.exhibition.title')}
                                isExhibition={true}
                            />
                            <div className="under-image-meta"><span>{t('studentsGallery.exhibition.caption')}</span></div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentsWorks;