import React from 'react';
import { useTranslation } from 'react-i18next';
import './testimonials.scss';

const Testimonials: React.FC = () => {
    const { t } = useTranslation();
    
    // Ordered by impact: Dikla (4), Devorah (3), Alona (2), Samanta (1)
    const orderedIds = [4, 3, 2, 1];

    return (
        <div className="cardPageContainer testimonial-page">
            <div className="cardContentWrapper">
                <h1 className="pageTitle">{t('testimonials.mainTitle')}</h1>
                <div className="testimonial-grid">
                    {orderedIds.map((id) => (
                        <div className="testimonial-item" key={id}>
                            <div className="item-header">
                                <div className="stars">★★★★★</div>
                                {id === 1 && (
                                    <a 
                                        href="https://www.apprentus.ch/in/painting" 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="source-link"
                                    >
                                        {t('testimonials.1.source')} ↗
                                    </a>
                                )}
                            </div>

                            <p className="quote">{t(`testimonials.${id}.text`)}</p>
                            
                            <div className="author-info">
                                <span className="dash"></span>
                                <h5 className="author">{t(`testimonials.${id}.author`)}</h5>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;