import React from 'react';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../../Backend/data/products';
import LogoSrc from '../../assets/images/icons/Frame 49.svg'; 
import './FlyerGenerator.scss';

export const FlyerGenerator: React.FC = () => {
    const { t } = useTranslation();
    
    const featuredCourses = courses.filter(c => [800, 801, 804, 806].includes(c.id)); 
    const mainShowcaseImage = courses.find(c => c.id === 803);

    return (
        <div className="flyer-root">
            {/* The button is wrapped in a class that will be hidden during print */}
            <div className="admin-bar admin-hide-print">
                <button onClick={() => window.print()}>PRINT / SAVE PDF</button>
            </div>

            <article className="flyer-paper">
                <header className="flyer-header">
                    <div className="header-left">
                        <img src={LogoSrc} alt="Logo" className="logo-img" />
                        <span className="domain-text">PROFINEART.CH</span>
                    </div>
                    <div className="header-qr">
                        <div className="qr-desc"><br/>BOOKING & PAYMENTS</div>
                        <img 
                            src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://profineart.ch/&bgcolor=ffffff&color=000000&qzone=1" 
                            alt="QR" 
                        />
                    </div>
                </header>

                <section className="hero-section">
                    <h1 className="main-title">Fine Art Contemporary Painting Courses</h1>
                    <div className="swiss-bridge">
                        <span className="location">BASEL STADT & LANDSCHAFT</span>
                        <span className="separator">|</span>
                        <span className="lang">PRIVATE MENTORSHIP IN ENGLISH</span>
                    </div>
                    
                    <p className="hero-desc">
                        A private educational project providing specialized mentorship that combines historical tradition with contemporary standards. The mentor travels directly to your personal studio.
                    </p>
                    
                    {mainShowcaseImage && (
                        <div className="showcase-frame">
                            <img src={mainShowcaseImage.image.highResUrl} alt="Art Showcase" className="rounded-img" />
                        </div>
                    )}
                </section>

                <section className="info-grid">
                    <div className="info-block">
                        <h4>FOUNDER & INSTRUCTOR</h4>
                        <p><strong>Ilya Medvedev (MFA)</strong> – Artist and educator with a practice spanning 1,000+ professional Artworks. Focus on material chemistry, historical accuracy, and the transition from classical underpainting to modern textures.</p>
                    </div>
                    <div className="info-block">
                        <h4>STUDENT LEVELS</h4>
                        <p>Suitable for all skill levels. Introductory courses for beginners with structured guidance; advanced courses focus on observational drawing and independent mastery.</p>
                    </div>
                </section>

                <section className="courses-section">
                    <h3>PROFESSIONAL PAINTING COURSES</h3>
                    <div className="course-grid">
                        {featuredCourses.slice(0, 4).map(c => (
                            <div key={c.id} className="course-item">
                                <img src={c.image.highResUrl} alt="" className="rounded-img" />
                                <span>{t(`products.${c.id}.title`).replace(/<[^>]*>/g, '')}</span>
                            </div>
                        ))}
                    </div>
                    <p className="more-courses">...visit the site for more Courses</p>
                </section>

                <section className="how-it-works">
                    <h3>HOW IT WORKS</h3>
                    <div className="steps-container">
                        <div className="step-box">
                            <span className="num">1</span>
                            <h5>Choose Course</h5>
                            <p>Pick your preferred subject from the catalog.</p>
                        </div>
                        <span className="arrow">→</span>
                        <div className="step-box">
                            <span className="num">2</span>
                            <h5>Book & Pay</h5>
                            <p>Select format, date, and your studio address.</p>
                        </div>
                        <span className="arrow">→</span>
                        <div className="step-box">
                            <span className="num">3</span>
                            <h5>Contact</h5>
                            <p>Instructor advises on session preparation.</p>
                        </div>
                        <span className="arrow">→</span>
                        <div className="step-box">
                            <span className="num">4</span>
                            <h5>Studio Session</h5>
                            <p>Instructor travels to you at the booked time.</p>
                        </div>
                    </div>
                </section>

                <footer className="flyer-footer">
                    <div className="footer-line">
                        <strong className="email-text">info@profineart.ch</strong>
                    </div>
                    
                </footer>
            </article>
        </div>
    );
};