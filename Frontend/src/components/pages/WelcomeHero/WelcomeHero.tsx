import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './welcomeHero.scss';

/**
 * CLOUDINARY OPTIMIZATION:
 * Added 'w_XXXX' parameters to the URLs. 
 * Even on high-end phones, an image wider than 1080px is physically 
 * impossible to display. Capping the resolution ensures the 'onload' 
 * events fire quickly, making the design feel snappier.
 */
const HERO_IMAGES = {
    desktop: {
        small: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_400/https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg",
        medium: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_1200/https://i.ibb.co/HTJqgrn5/No-borders120kb.jpg",
        large: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_1920/https://i.ibb.co/CgLGfjx/No-borders500kb.jpg"
    },
    mobile: {
        small: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_300/https://i.ibb.co/KTHTRtm/detai-50kl.jpg",
        medium: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_600/https://i.ibb.co/RTQnmM4p/detai-120kb.jpg",
        large: "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto,w_1080/https://i.ibb.co/zwGVjMt/detai-500kl.jpg"
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
            const vvHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
            document.documentElement.style.setProperty('--vh', `${vvHeight * 0.01}px`);
        };
        fixHeight();
        window.visualViewport?.addEventListener('resize', fixHeight);
        window.addEventListener('resize', fixHeight);

        const preload = (type: 'desktop' | 'mobile') => {
            const med = new Image();
            med.src = HERO_IMAGES[type].medium;
            med.onload = () => {
                type === 'desktop' ? setDesktopStage('medium') : setMobileStage('medium');
                const high = new Image();
                high.src = HERO_IMAGES[type].large;
                high.onload = () => type === 'desktop' ? setDesktopStage('high') : setMobileStage('high');
            };
        };

        // Triggering the cinematic sequence exactly as before
        preload('desktop');
        preload('mobile');

        return () => {
            window.visualViewport?.removeEventListener('resize', fixHeight);
            window.removeEventListener('resize', fixHeight);
        };
    }, []);

    const handleScroll = () => {
        const heroElement = document.querySelector('.welcome-hero-art');
        if (heroElement) {
            const heroBottom = heroElement.getBoundingClientRect().bottom;
            const scrollTarget = heroBottom + window.pageYOffset;
            const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const isMobile = window.innerWidth <= 768;
            const offset = isMobile ? (3.5 * rootFontSize) : 0; 

            window.scrollTo({
                top: scrollTarget - offset,
                behavior: 'smooth'
            });
        } else if (onArrowClick) {
            onArrowClick();
        }
    };

    return (
        <section className="welcome-hero-art">
            <div className="art-background">
                {/* DESKTOP VIEWPORT LAYERS */}
                <div className="image-wrapper desktop-img">
                    <img 
                        src={HERO_IMAGES.desktop.small} 
                        className="hero-image stage-passive" 
                        alt="" 
                        fetchPriority="high" // Boosts initial discovery in the browser
                    />
                    <img 
                        src={HERO_IMAGES.desktop.medium} 
                        className={`hero-image stage-med ${desktopStage !== 'low' ? 'visible' : ''}`} 
                        alt="" 
                    />
                    <img 
                        src={HERO_IMAGES.desktop.large} 
                        className={`hero-image stage-high ${desktopStage === 'high' ? 'visible' : ''}`} 
                        alt="Fine Art Studio Basel" 
                    />
                </div>

                {/* MOBILE VIEWPORT LAYERS */}
                <div className="image-wrapper mobile-img">
                    <img 
                        src={HERO_IMAGES.mobile.small} 
                        className="hero-image stage-passive" 
                        alt="" 
                        fetchPriority="high" 
                    />
                    <img 
                        src={HERO_IMAGES.mobile.medium} 
                        className={`hero-image stage-med ${mobileStage !== 'low' ? 'visible' : ''}`} 
                        alt="" 
                    />
                    <img 
                        src={HERO_IMAGES.mobile.large} 
                        className={`hero-image stage-high ${mobileStage === 'high' ? 'visible' : ''}`} 
                        alt="Fine Art Studio Basel Mobile" 
                    />
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