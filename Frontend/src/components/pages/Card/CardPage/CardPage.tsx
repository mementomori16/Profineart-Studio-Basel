// src/components/pages/Card/CardPage/CardPage.tsx

import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardContainer from '../CardContainer/CardContainer'; 
import InfoContainer from '../InfoContainer/InfoContainer';
import SimilarProducts from '../../../SimilarProducts/SimilarProducts';
import { products } from '../../../../../../Backend/data/products';
import ProductDetailsFrame from '../ProductDetailsFrame/ProductDetailsFrame'; 
import ViewGallery from '../../View Gallery/ViewGallery'; 
import { Product } from '../../../../../../Backend/types/Product'; 

import './cardPage.scss';

// Type definitions remain the same
interface GalleryImageData {
    url: string;
    lowResUrl: string;
    title: string;
    date: string;
    caption?: string;
    altText?: string;
}

type GalleryData = {
    images: GalleryImageData[];
    startIndex: number;
} | null;


const CardPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const parsedId = id ? parseInt(id, 10) : NaN;
    const currentImageId = isNaN(parsedId) ? 0 : parsedId;

    // Only use 'products.courses' for simplicity based on previous context
    const allProducts = [ ...products.courses ]; 
    
    const product: Product | undefined = allProducts.find((p) => p.id === currentImageId);

    if (!product) { return <p>{t('cardPage.productNotFound')}</p>; }
    
    // --- GALLERY STATE & LOGIC ---
    const [galleryData, setGalleryData] = useState<GalleryData>(null);

    const handleCloseGallery = () => {
        setGalleryData(null); // Setting to null closes the gallery
    };

    // 1. CREATE TWO SEPARATE IMAGE ARRAYS
    const { mainGalleryImages, detailsGalleryImages } = useMemo(() => {
        
        const mapProductImageToGalleryData = (img: any): GalleryImageData => ({
            url: img.highResUrl, 
            lowResUrl: img.lowResUrl, 
            title: product.title, 
            date: product.date || '',
            caption: img.caption,
            altText: img.altText
        });

        // A. Images for CardContainer (Main + Thumbnails)
        const main: GalleryImageData[] = [
            mapProductImageToGalleryData(product.image),
            ...product.thumbnails.map(mapProductImageToGalleryData)
        ];

        // B. Images for ProductDetailsFrame (Only Detail Images)
        const details: GalleryImageData[] = product.detailsImages 
            ? product.detailsImages.map(mapProductImageToGalleryData) 
            : [];

        return { mainGalleryImages: main, detailsGalleryImages: details };
    }, [product]);


    // 2. NEW HANDLER: Accepts the specific array and the local index
    const handleOpenGallery = (images: GalleryImageData[], startIndex: number): void => {
        if (images.length === 0) return;
        
        setGalleryData({
            images: images,
            startIndex: startIndex,
        });
    };
    
    return (
        <div className="cardPageContainer">
            <div className="cardContentWrapper">
                
                <div className="cardHeader">
                    <h1 className="pageTitle">{t(`products.${product.id}.title`)}</h1>
                </div>

                <div className="cardContentLayout">
                    {/* CardContainer (Image/Thumbnails/Main Image) */}
                    {
                        React.createElement(
                            CardContainer as any, 
                            { 
                                product: product, 
                                onOpenGallery: (index: number) => handleOpenGallery(mainGalleryImages, index)
                            }
                        )
                    }
                    {/* InfoContainer (Text, Date, Buttons) */}
                    <InfoContainer product={product} /> 
                </div>

                {/* Product Details Frame (Extended Content) */}
                <ProductDetailsFrame 
                    product={product} 
                    onOpenGallery={(index: number) => handleOpenGallery(detailsGalleryImages, index)}
                />
                
            </div>
            
            {/* RENDER VIEW GALLERY CENTRALLY */}
            {galleryData && galleryData.images.length > 0 && (
                <ViewGallery
                    images={galleryData.images}
                    currentImageId={galleryData.startIndex}
                    onClose={handleCloseGallery}
                />
            )}

            <div className="similarProductsContainer">
                <SimilarProducts currentProductId={currentImageId} />
            </div>
        </div>
    );
};

export default CardPage;


