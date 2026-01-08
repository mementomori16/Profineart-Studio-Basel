import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { artistProfile } from '../../../../../Backend/data/products'; 
import ViewGallery from '../View Gallery/ViewGallery';
import './about.scss';

// --- HELPER COMPONENT FOR SILENT LOADING ---
const DetailImage: React.FC<{ url: string, alt: string, onClick?: () => void }> = ({ url, alt, onClick }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => setLoaded(true);
    }, [url]);

    return (
        <div className="image-zoom-trigger" onClick={onClick}>
            <img 
                src={url} 
                alt={alt} 
                className={`artist-img ${loaded ? 'loaded' : ''}`} 
            />
        </div>
    );
};

const About: React.FC = () => {
    const { t } = useTranslation();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    const galleryImages = artistProfile.map(img => ({
        url: img.highResUrl,
        title: img.caption || 'Ilya Medvedev',
        date: 'ProFineArt Studio Basel' 
    }));

    const openGallery = (index: number) => {
        setSelectedImgIndex(index);
        setIsGalleryOpen(true);
    };

    return (
        <div className="cardPageContainer about-page">
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t('aboutPage.title')}</h1>
                </div>

                <div className="cardContentLayout">
                    <div className="column-left">
                        <div className="main-info-frame">
                            <p className="intro-text">{t('aboutPage.intro')}</p>
                            
                            <div className="section-block">
                                <h3>{t('aboutPage.mobileTitle')}</h3>
                                <p>{t('aboutPage.mobileText')}</p>
                                
                                <h3>{t('aboutPage.backgroundTitle')}</h3>
                                <p>{t('aboutPage.backgroundText')}</p>
                                
                                <h3>{t('aboutPage.methodologyTitle')}</h3>
                                <p>{t('aboutPage.methodologyText')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="column-right">
                        <div className="artist-sidebar-frame">
                            <div className="artist-photos-list">
                                {artistProfile.map((img, index) => (
                                    <div key={index} className="photo-item">
                                        <DetailImage 
                                            url={img.lowResUrl} 
                                            alt={img.caption || 'Artist Photo'} 
                                            onClick={() => openGallery(index)} 
                                        />
                                        {img.caption && <p className="imageCaption">{img.caption}</p>}
                                    </div>
                                ))}
                            </div>

                            <div className="sidebar-divider"></div>

                            <a 
                                href="https://artfacts.net/artist/ilya-medvedev-1981-ch" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="artfacts-link-neutral"
                            >
                                {t('aboutPage.artFactsLink')} ↗
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {isGalleryOpen && (
                <ViewGallery 
                    images={galleryImages}
                    currentImageId={selectedImgIndex}
                    onClose={() => setIsGalleryOpen(false)}
                />
            )}
        </div>
    );
};

export default About;