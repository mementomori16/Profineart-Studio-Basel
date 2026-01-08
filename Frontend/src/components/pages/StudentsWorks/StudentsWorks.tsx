import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { studentGalleryData } from '../../../../../Backend/data/products'; 
import ViewGallery from '../View Gallery/ViewGallery';
import './studentsWorks.scss';

// --- HELPER COMPONENT FOR SILENT LOADING ---
const StudentWorkImage: React.FC<{ url: string, alt: string, onClick: () => void }> = ({ url, alt, onClick }) => {
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
                className={`student-img ${loaded ? 'loaded' : ''}`} 
            />
        </div>
    );
};

const StudentsWorks: React.FC = () => {
    const { t } = useTranslation();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [selectedImgIndex, setSelectedImgIndex] = useState(0);

    const galleryImages = studentGalleryData.map(img => ({
        url: img.highResUrl,
        title: img.caption || 'Student Work',
        date: 'ProFineArt Studio' 
    }));

    const openGallery = (index: number) => {
        setSelectedImgIndex(index);
        setIsGalleryOpen(true);
    };

    return (
        <div className="cardPageContainer students-works-page">
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t('studentsWorksPage.title')}</h1>
                </div>

                <div className="cardContentLayout">
                    <div className="column-left">
                        <div className="main-info-frame">
                            <p className="intro-text">{t('studentsWorksPage.intro')}</p>
                            
                            <div className="student-photos-grid">
                                {studentGalleryData.map((img, index) => (
                                    <div key={index} className="photo-item">
                                        <StudentWorkImage 
                                            url={img.lowResUrl} 
                                            alt={img.caption || 'Student Work'} 
                                            onClick={() => openGallery(index)}
                                        />
                                        {img.caption && <p className="imageCaption">{img.caption}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="column-right">
                        <div className="sidebar-info-frame">
                            <h3>{t('studentsWorksPage.sidebarTitle')}</h3>
                            <p>{t('studentsWorksPage.sidebarText')}</p>
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

export default StudentsWorks;