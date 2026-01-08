import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './welcomeHero.scss';

const HERO_IMAGES = {
    desktop: {
        small: "https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg",
        medium: "https://i.ibb.co/HTJqgrn5/No-borders120kb.jpg",
        large: "https://i.ibb.co/CgLGfjx/No-borders500kb.jpg"
    },
    mobile: {
        small: "https://i.ibb.co/tjTJ8wv/photoshoped-new-2025-Royal-Gore-Oil-on-canvas-111-x-200-cm-2008-50kb.jpg",
        medium: "https://i.ibb.co/C5nyCr4D/photoshoped-new-2025-Royal-Gore-Oil-on-canvas-111-x-200-cm-2008-Ilya-Medvedev120kb.jpg",
        large: "https://i.ibb.co/ZzzzjMHT/photoshoped-new-2025-Royal-Gore-Oil-on-canvas-111-x-200-cm-2008-500kb.jpg"
    }
};

const WelcomeHero: React.FC = () => {
    const { t } = useTranslation();
    const [desktopStage, setDesktopStage] = useState<'low' | 'medium' | 'high'>('low');
    const [mobileStage, setMobileStage] = useState<'low' | 'medium' | 'high'>('low');

    useEffect(() => {
        const dMed = new Image();
        dMed.src = HERO_IMAGES.desktop.medium;
        dMed.onload = () => {
            setDesktopStage('medium');
            const dHigh = new Image();
            dHigh.src = HERO_IMAGES.desktop.large;
            dHigh.onload = () => setDesktopStage('high');
        };

        const mMed = new Image();
        mMed.src = HERO_IMAGES.mobile.medium;
        mMed.onload = () => {
            setMobileStage('medium');
            const mHigh = new Image();
            mHigh.src = HERO_IMAGES.mobile.large;
            mHigh.onload = () => setMobileStage('high');
        };
    }, []);

    const handleScroll = () => {
        const coursesSection = document.querySelector('.courses-section');
        coursesSection?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="welcome-hero-art">
            <div className="art-background">
                <div className="image-wrapper desktop-img">
                    <img src={HERO_IMAGES.desktop.small} className="hero-image stage-passive" alt="" />
                    <img 
                        src={HERO_IMAGES.desktop.medium} 
                        className={`hero-image stage-med ${desktopStage !== 'low' ? 'visible' : ''}`} 
                        alt="" 
                    />
                    <img 
                        src={HERO_IMAGES.desktop.large} 
                        className={`hero-image stage-high ${desktopStage === 'high' ? 'visible' : ''}`} 
                        alt="" 
                    />
                </div>

                <div className="image-wrapper mobile-img">
                    <img src={HERO_IMAGES.mobile.small} className="hero-image stage-passive" alt="" />
                    <img 
                        src={HERO_IMAGES.mobile.medium} 
                        className={`hero-image stage-med ${mobileStage !== 'low' ? 'visible' : ''}`} 
                        alt="" 
                    />
                    <img 
                        src={HERO_IMAGES.mobile.large} 
                        className={`hero-image stage-high ${mobileStage === 'high' ? 'visible' : ''}`} 
                        alt="" 
                    />
                </div>
                <div className="art-vignette"></div>
            </div>

            <div className="hero-content">
                <header className="info-frame">
                    <h1 className="service-title">{t('welcomeHero.serviceTitle')}</h1>
                    <p className="brand-signature">{t('welcomeHero.companyName')}</p>
                    <button className="hero-btn-pill" onClick={handleScroll}>
                        {t('welcomeHero.ctaButton')}
                    </button>
                </header>
            </div>

            <button className="scroll-arrow" onClick={handleScroll} aria-label="Scroll Down">
                <span className="arrow-down"></span>
            </button>
        </section>
    );
};

export default WelcomeHero;