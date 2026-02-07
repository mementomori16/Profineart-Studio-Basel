import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Removed Helmet import to fix build crash
import CardContainer from '../CardContainer/CardContainer'; 
import InfoContainer from '../InfoContainer/InfoContainer';
import SimilarProducts from '../../../SimilarProducts/SimilarProducts';
import { products } from '../../../../../../Backend/data/products';
import ViewGallery from '../../View Gallery/ViewGallery'; 
import { Product } from '../../../../../../Backend/types/Product'; 

import './cardPage.scss';

const CardPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    
    const allProducts: Product[] = [...products.courses]; 
    const product = allProducts.find((p) => p.id === Number(id));

    // --- SEO & BACKGROUND EFFECT ---
    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        
        if (product) {
            const title = `${t(`products.${product.id}.title`)} | Profineart Studio Basel`;
            const description = t(`products.${product.id}.briefDescription`);
            const url = `https://profineart.ch/card/${product.id}`;
            const imageUrl = product.image.highResUrl;

            // Update Standard Meta Tags
            document.title = title;
            document.querySelector('meta[name="description"]')?.setAttribute('content', description);
            
            // Update Open Graph (Social Media)
            document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
            document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
            document.querySelector('meta[property="og:image"]')?.setAttribute('content', imageUrl);
            document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
            
            // Update Canonical Link
            let canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                canonical.setAttribute('href', url);
            }
        }

        return () => { 
            document.body.style.backgroundColor = ''; 
            // Reset title when leaving page if desired
            document.title = "Profineart Studio Basel";
        };
    }, [product, t]);

    const [galleryData, setGalleryData] = useState<{images: any[], startIndex: number} | null>(null);

    const { mainGalleryImages, detailsGalleryImages } = useMemo(() => {
        if (!product) return { mainGalleryImages: [], detailsGalleryImages: [] };
        const mapImg = (img: any) => ({
            url: img.highResUrl, 
            lowResUrl: img.lowResUrl, 
            title: product.title, 
            date: product.date || '',
            caption: img.caption
        });
        return {
            mainGalleryImages: [mapImg(product.image), ...product.thumbnails.map(mapImg)],
            detailsGalleryImages: product.detailsImages?.map(mapImg) || []
        };
    }, [product]);

    if (!product) return <p>{t('cardPage.productNotFound')}</p>;

    const openDetailsGallery = (index: number) => {
        setGalleryData({ images: detailsGalleryImages, startIndex: index });
    };

    return (
        <div className="cardPageContainer">
            {/* Helmet component removed to prevent React 19 / Vite build crash */}
            
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t(`products.${product.id}.title`)}</h1>
                </div>

                <div className="cardContentLayout">
                    <div className="column-left">
                        <InfoContainer 
                            product={product} 
                            isTextOnly={true}
                            onOpenGallery={openDetailsGallery}
                        />
                    </div>

                    <div className="column-right">
                        <CardContainer 
                            product={product} 
                            onOpenGallery={(index: number) => setGalleryData({ images: mainGalleryImages, startIndex: index })}
                        />
                        <InfoContainer 
                            product={product} 
                            isTextOnly={false}
                            onOpenGallery={openDetailsGallery}
                        />
                    </div>
                </div>

                <div className="backNavigationSection">
                    <Link to="/courses" className="backToCourses">
                        <span className="arrow">←</span>
                        {t('cardPage.backToCourses')}
                    </Link>
                </div>
            </div>

            {galleryData && (
                <ViewGallery
                    images={galleryData.images}
                    currentImageId={galleryData.startIndex}
                    onClose={() => setGalleryData(null)}
                />
            )}

            <div className="similarProductsContainer">
                <SimilarProducts currentProductId={product.id} />
            </div>
        </div>
    );
};

export default CardPage;

/*
import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardContainer from '../CardContainer/CardContainer'; 
import InfoContainer from '../InfoContainer/InfoContainer';
import SimilarProducts from '../../../SimilarProducts/SimilarProducts';
import { products } from '../../../../../../Backend/data/products';
import ViewGallery from '../../View Gallery/ViewGallery'; 
import { Product } from '../../../../../../Backend/types/Product'; 

import './cardPage.scss';

const CardPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    
    const allProducts: Product[] = [...products.courses]; 
    const product = allProducts.find((p) => p.id === Number(id));

    const [galleryData, setGalleryData] = useState<{images: any[], startIndex: number} | null>(null);

    const { mainGalleryImages, detailsGalleryImages } = useMemo(() => {
        if (!product) return { mainGalleryImages: [], detailsGalleryImages: [] };
        const mapImg = (img: any) => ({
            url: img.highResUrl, 
            lowResUrl: img.lowResUrl, 
            title: product.title, 
            date: product.date || '',
            caption: img.caption
        });
        return {
            mainGalleryImages: [mapImg(product.image), ...product.thumbnails.map(mapImg)],
            detailsGalleryImages: product.detailsImages?.map(mapImg) || []
        };
    }, [product]);

    if (!product) return <p>{t('cardPage.productNotFound')}</p>;

    const openDetailsGallery = (index: number) => {
        setGalleryData({ images: detailsGalleryImages, startIndex: index });
    };

    return (
        <div className="cardPageContainer">
            <div className="cardContentWrapper">
                <div className="cardHeader">
                    <h1 className="pageTitle">{t(`products.${product.id}.title`)}</h1>
                </div>

                <div className="cardContentLayout">
                    <div className="column-left">
                        
                        <InfoContainer 
                            product={product} 
                            isTextOnly={true}
                            onOpenGallery={openDetailsGallery}
                        />
                    </div>

                    <div className="column-right">
                        <CardContainer 
                            product={product} 
                            onOpenGallery={(index: number) => setGalleryData({ images: mainGalleryImages, startIndex: index })}
                        />
                        
                       
                        <InfoContainer 
                            product={product} 
                            isTextOnly={false}
                            onOpenGallery={openDetailsGallery}
                        />
                    </div>
                </div>
            </div>

            {galleryData && (
                <ViewGallery
                    images={galleryData.images}
                    currentImageId={galleryData.startIndex}
                    onClose={() => setGalleryData(null)}
                />
            )}

            <div className="similarProductsContainer">
                <SimilarProducts currentProductId={product.id} />
            </div>
        </div>
    );
};

export default CardPage;
*/