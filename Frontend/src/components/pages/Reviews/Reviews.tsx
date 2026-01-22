import React from 'react';
import { useTranslation } from 'react-i18next';
import './reviews.scss';

const Reviews: React.FC = () => {
    const { t } = useTranslation();
    
    // Ordered from most impressive/detailed to shorter/focused
    const orderedKeys = ['4', '3', '1', '2'];

    return (
        <section className="reviews-section">
            <div className="container">
                <header className="section-header">
                    <h2 className="reviews-main-title">{t('testimonials.mainTitle')}</h2>
                </header>
                
                <div className="reviews-list">
                    {orderedKeys.map((key) => {
                        const source = t(`testimonials.${key}.source`);
                        const isApprentus = source?.includes('Apprentus');

                        return (
                            <article key={key} className="review-item">
                                <div className="review-meta">
                                    <div className="author-group">
                                        <h4 className="review-author">{t(`testimonials.${key}.author`)}</h4>
                                        <div className="review-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className="star">★</span>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {source && source !== `testimonials.${key}.source` && (
                                        <div className="source-info">
                                            {isApprentus ? (
                                                <a href="https://www.apprentus.ch/in/painting" target="_blank" rel="noopener noreferrer" className="source-link">
                                                    {source}
                                                </a>
                                            ) : (
                                                <span className="source-text">{source}</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="review-content">
                                    <p className="review-text">{t(`testimonials.${key}.text`)}</p>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Reviews;