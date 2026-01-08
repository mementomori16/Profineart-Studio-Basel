import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { products as productData } from '../../../../Backend/data/products'; 
import { Product } from '../../../../Backend/types/Product'; 
import './customCarousel.scss'; 

// Fetching courses from the backend data
const products: Product[] = [...(productData.courses || [])];

const New: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const totalProducts = products.length;
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide functionality (5 seconds)
    useEffect(() => {
        if (totalProducts === 0) return;
        const intervalId = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalProducts);
        }, 5000); 
        return () => clearInterval(intervalId);
    }, [totalProducts]);

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalProducts);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + totalProducts) % totalProducts);

    const currentProduct = products[currentIndex]; 

    // Safety check if product doesn't exist
    if (!currentProduct) return null;

    return (
        <section className="new-hero-wrapper">
            {/* The Master Frame: Wraps both text and carousel */}
            <div className="master-component-frame container"> 
                
                {/* Left side: Title, Description, and CTA Button */}
                <div className="text-section">
                    <h1 className="main-title">
                        <span className="highlight">
                            {t('carousel.globalTitlePrimary')}
                        </span>
                        <span className="secondary-title">
                            {t('carousel.globalTitleSecondary')}
                        </span>
                    </h1>
                    
                    <p className="description-text">
                        {t('carousel.globalDescription')}
                    </p>
                    
                    <button 
                        className="explore-button" 
                        onClick={() => navigate(`/card/${currentProduct.id}`)}
                    >
                        {t('carousel.learnMoreButton')} →
                    </button>
                </div>

                {/* Right side: Carousel Visuals (Card + Navigation) */}
                <div className="carousel-visuals">
                    <div className="controls-row">
                        {/* Previous Arrow */}
                        <button className="nav-arrow" onClick={prevSlide}>‹</button>
                        
                        {/* The Individual Product Card */}
                        <div className="card-container">
                            <div className="serviceItem" onClick={() => navigate(`/card/${currentProduct.id}`)}>
                                {currentProduct.badge && (
                                    <div className="badge">
                                        {t(`products.${currentProduct.id}.badge`)}
                                    </div>
                                )}
                                
                                <div className="image-wrapper">
                                    <img 
                                        src={currentProduct.image.lowResUrl} 
                                        alt={t(`products.${currentProduct.id}.title`)} 
                                    />
                                </div>
                                
                                <h3 className="title">
                                    {t(`products.${currentProduct.id}.title`)}
                                </h3>
                                
                                {/* Framed Description inside the card */}
                                <p className="subtitle">
                                    {t(`products.${currentProduct.id}.briefDescription`)}
                                </p>
                                
                                <button className="viewButton">
                                    {t('coursesPage.viewButton')}
                                </button>
                            </div>
                        </div>

                        {/* Next Arrow */}
                        <button className="nav-arrow" onClick={nextSlide}>›</button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="dots">
                        {products.map((_, index) => (
                            <div 
                                key={index} 
                                className={`dot ${index === currentIndex ? 'active' : ''}`} 
                                onClick={() => setCurrentIndex(index)} 
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default New;