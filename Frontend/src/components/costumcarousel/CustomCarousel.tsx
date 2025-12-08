import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Assuming productData follows the structure: { services: Product[], courses: Product[] }
import { products as productData } from '../../../../Backend/data/products'; 
import { Product } from '../../../../Backend/types/Product'; 
import './customCarousel.scss'; 

// --- MODIFIED CODE: Initializing products array with courses only ---
// This now correctly expects Product.image to be of type ProductImage
const products: Product[] = [
    ...(productData.courses || []), // Fetching only products from 'courses'
];
// -------------------------------------------------------------------

const New: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const totalProducts = products.length;

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-change logic
    useEffect(() => {
        if (totalProducts === 0) return;
        
        const intervalId = setInterval(() => {
            setCurrentIndex(prevIndex => (prevIndex + 1) % totalProducts);
        }, 4000); // Change card every 4 seconds

        return () => clearInterval(intervalId);
    }, [totalProducts]);

    const currentProduct = products[currentIndex] || products[0]; 

    const highlightedText = t('carousel.globalTitlePrimary');
    const secondaryText = t('carousel.globalTitleSecondary');

    const globalDescription = t('carousel.globalDescription');
    const learnMoreButtonText = t('carousel.learnMoreButton');
    const viewButtonText = t('servicesPage.viewButton');
    
    const handleCtaClick = (id: number) => {
        navigate(`/card/${id}`);
    };

    if (totalProducts === 0) {
        // Fallback for when no products (courses) are available
        return <div className="new-component-layout container">{t('loading')}...</div>;
    }
    
    return (
        <div className="new-component-layout container">
            
            <div className="content-layout"> 
                
                <div className="text-section">
                    <h1 className="main-title">
                        <span className="highlight">{highlightedText}</span>
                        <br className="mobile-break"/> 
                        <span className="secondary-title">{secondaryText}</span>
                    </h1>
                    <p className="description-text">
                        {globalDescription}
                    </p>
                    <button
                        className="explore-button"
                        onClick={() => handleCtaClick(currentProduct.id)}
                    >
                        {learnMoreButtonText} <span className="arrow">→</span>
                    </button>
                </div>

                <div className="media-section carousel-visuals">
                    <div 
                        className="card-link-wrapper"
                        title={`View details for ${t(`products.${currentProduct.id}.title`)}`}
                    >
                        <div 
                            className="service-card"
                            onClick={() => handleCtaClick(currentProduct.id)}
                        >
                            <img
                                // FIX: Accessing the lowResUrl property to resolve 
                                // "Type 'ProductImage' is not assignable to type 'string'" error
                                src={currentProduct.image.lowResUrl} 
                                alt={t(`products.${currentProduct.id}.title`)}
                                className="card-image" 
                            />
                            
                            <h3 className="card-title">
                                {t(`products.${currentProduct.id}.title`)}
                            </h3>
                            
                            <button 
                                className="view-button" 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    handleCtaClick(currentProduct.id); 
                                }}
                            >
                                {viewButtonText}
                            </button>
                        </div>
                    </div>

                    {/* Bullets for navigation */}
                    <div className="dots">
                        {products.map((product, index) => (
                            <div
                                key={product.id} 
                                className={`dot ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                                aria-label={`Go to slide ${index + 1}: ${t(`products.${product.id}.title`)}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;