import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './welcomeHero.scss';

const HERO_IMAGES = {
    desktop: {
        small: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg",
        medium: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/HTJqgrn5/No-borders120kb.jpg",
        large: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/CgLGfjx/No-borders500kb.jpg"
    },
    mobile: {
        small: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/KTHTRtm/detai-50kl.jpg",
        medium: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/RTQnmM4p/detai-120kb.jpg",
        large: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/zwGVjMt/detai-500kl.jpg"
    }
};

interface WelcomeHeroProps {
    onArrowClick?: () => void;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({ onArrowClick }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [desktopStage, setDesktopStage] = useState<'low' | 'medium' | 'high'>('low');
    const [mobileStage, setMobileStage] = useState<'low' | 'medium' | 'high'>('low');

    useEffect(() => {
        const fixHeight = () => {
            // VisualViewport is the only reliable way to get actual visible height on mobile
            const vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vvHeight * 0.01}px`);
        };

        fixHeight();
        window.visualViewport?.addEventListener('resize', fixHeight);
        window.addEventListener('resize', fixHeight);

        // Original Preloading Logic
        const dMed = new Image(); dMed.src = HERO_IMAGES.desktop.medium;
        dMed.onload = () => {
            setDesktopStage('medium');
            const dHigh = new Image(); dHigh.src = HERO_IMAGES.desktop.large;
            dHigh.onload = () => setDesktopStage('high');
        };

        const mMed = new Image(); mMed.src = HERO_IMAGES.mobile.medium;
        mMed.onload = () => {
            setMobileStage('medium');
            const mHigh = new Image(); mHigh.src = HERO_IMAGES.mobile.large;
            mHigh.onload = () => setMobileStage('high');
        };

        return () => {
            window.visualViewport?.removeEventListener('resize', fixHeight);
            window.removeEventListener('resize', fixHeight);
        };
    }, []);

  const handleScroll = () => {
        // We find the Hero itself
        const heroElement = document.querySelector('.welcome-hero-art');
        
        if (heroElement) {
            // The exact bottom of the hero is where the next section starts
            const heroBottom = heroElement.getBoundingClientRect().bottom;
            const scrollTarget = heroBottom + window.pageYOffset;

            // We subtract NOTHING here because the Hero height 
            // already accounts for the sticky navbar in SCSS.
            window.scrollTo({
                top: scrollTarget, 
                behavior: 'smooth'
            });
        } else if (onArrowClick) {
            onArrowClick();
        }
    };

    return (
        <section className="welcome-hero-art">
            <div className="art-background">
                <div className="image-wrapper desktop-img">
                    <img src={HERO_IMAGES.desktop.small} className="hero-image stage-passive" alt="" />
                    <img src={HERO_IMAGES.desktop.medium} className={`hero-image stage-med ${desktopStage !== 'low' ? 'visible' : ''}`} alt="" />
                    <img src={HERO_IMAGES.desktop.large} className={`hero-image stage-high ${desktopStage === 'high' ? 'visible' : ''}`} alt="" />
                </div>
                <div className="image-wrapper mobile-img">
                    <img src={HERO_IMAGES.mobile.small} className="hero-image stage-passive" alt="" />
                    <img src={HERO_IMAGES.mobile.medium} className={`hero-image stage-med ${mobileStage !== 'low' ? 'visible' : ''}`} alt="" />
                    <img src={HERO_IMAGES.mobile.large} className={`hero-image stage-high ${mobileStage === 'high' ? 'visible' : ''}`} alt="" />
                </div>
                <div className="art-vignette"></div>
            </div>

            <div className="hero-content">
                <header className="info-frame">
                    <h1 className="service-title">{t('home.welcomeHero.serviceTitle')}</h1>
                    <p className="brand-signature">{t('home.welcomeHero.companyName')}</p>
                    <button className="hero-btn-pill" onClick={() => navigate('/courses')}>
                        {t('home.welcomeHero.ctaButton')}
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