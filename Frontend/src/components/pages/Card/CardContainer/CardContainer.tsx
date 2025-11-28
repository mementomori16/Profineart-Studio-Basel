// CardContainer.tsx

import React, { useEffect, useState } from 'react';
import { Product, ProductImage } from '../../../../../../Backend/types/Product';
import ViewGallery from '../../View Gallery/ViewGallery';
import './cardContainer.scss';

interface CardContainerProps {
    product: Product;
}

const getImageOrientation = (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    return new Promise<boolean>((resolve) => {
        img.onload = () => {
            const isLandscape = img.width > img.height;
            resolve(isLandscape);
        };
    });
};

const CardContainer: React.FC<CardContainerProps> = ({ product }) => {
    const [mainImageLowRes, setMainImageLowRes] = useState<string>(product.image.lowResUrl);
    const [currentHighResUrl, setCurrentHighResUrl] = useState<string>(product.image.highResUrl);
    const [showGallery, setShowGallery] = useState<boolean>(false);
    const [isLandscape, setIsLandscape] = useState<boolean>(false);
    const [opacity, setOpacity] = useState<number>(1);

    useEffect(() => {
        if (product) {
            setMainImageLowRes(product.image.lowResUrl);
            setCurrentHighResUrl(product.image.highResUrl);
            getImageOrientation(product.image.lowResUrl).then(setIsLandscape);
        }
    }, [product]);

    const handleThumbnailClick = (image: ProductImage) => {
        setOpacity(0);
        setTimeout(() => {
            setMainImageLowRes(image.lowResUrl);
            setCurrentHighResUrl(image.highResUrl);
            getImageOrientation(image.lowResUrl).then(setIsLandscape);
            setOpacity(1);
        }, 300);
    };

    const handleImageClick = () => {
        setShowGallery(true);
    };

    const handleCloseGallery = () => {
        setShowGallery(false);
    };

    // Constructing the images array for ViewGallery
    const images = product
        ? [
            {
                url: product.image.highResUrl,
                lowResUrl: product.image.lowResUrl,
                title: product.title,
                date: product.date || ''
            },
            ...product.thumbnails.map((thumbnail) => ({
                url: thumbnail.highResUrl,
                lowResUrl: thumbnail.lowResUrl,
                title: product.title,
                date: product.date || '',
            })),
        ]
        : [];

    const currentImageIndex = product
        ? images.findIndex(image => image.url === currentHighResUrl)
        : 0;

    return (
        <div className={`cardContainer ${isLandscape ? 'landscape' : ''}`}>
            
            {/* The problematic <article className="card"> wrapper has been removed */}
            
            <div className={`imageContainer ${isLandscape ? 'landscape' : 'portrait'}`}>
                {product ? (
                    <img
                        src={mainImageLowRes}
                        alt={product.title}
                        className="image"
                        style={{ opacity, cursor: 'zoom-in' }}
                        onClick={handleImageClick}
                    />
                ) : (
                    <p>Image not found</p>
                )}
            </div>
            
            {/* Thumbnails are direct children of .cardContainer */}
            {product && (product.thumbnails.length > 0 || product.image) && (
                <div className="thumbnails">
                    {/* Main Image Thumbnail */}
                    <button
                        className="thumbnailContainer"
                        onClick={() => handleThumbnailClick(product.image)}
                        style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                    >
                        <img
                            src={product.image.lowResUrl}
                            alt={`${product.title} Main Image`}
                            className="thumbnail"
                        />
                    </button>
                    {/* Additional Thumbnails */}
                    {product.thumbnails.map((thumbnail, index) => (
                        <button
                            key={index}
                            className="thumbnailContainer"
                            onClick={() => handleThumbnailClick(thumbnail)}
                            style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                        >
                            <img
                                src={thumbnail.lowResUrl}
                                alt={`${product.title} Thumbnail ${index + 1}`}
                                className="thumbnail"
                            />
                        </button>
                    ))}
                </div>
            )}
            {showGallery && product && (
                <ViewGallery
                    images={images}
                    currentImageId={currentImageIndex}
                    onClose={handleCloseGallery}
                />
            )}
        </div>
    );
};

export default CardContainer;

