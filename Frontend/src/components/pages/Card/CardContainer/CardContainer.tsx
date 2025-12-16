import React, { useEffect, useState } from 'react';
import { Product, ProductImage } from '../../../../../../Backend/types/Product';
// Note: We can remove ViewGallery from here if CardPage is now handling the gallery globally
import './cardContainer.scss';

interface CardContainerProps {
    product: Product;
    onOpenGallery: (index: number) => void; // Added this to fix the CardPage error
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

const CardContainer: React.FC<CardContainerProps> = ({ product, onOpenGallery }) => {
    const [mainImageLowRes, setMainImageLowRes] = useState<string>(product.image.lowResUrl);
    const [currentHighResUrl, setCurrentHighResUrl] = useState<string>(product.image.highResUrl);
    const [currentCaption, setCurrentCaption] = useState<string | undefined>(product.image.caption);
    const [isLandscape, setIsLandscape] = useState<boolean>(false);
    const [opacity, setOpacity] = useState<number>(1);

    useEffect(() => {
        if (product) {
            setMainImageLowRes(product.image.lowResUrl);
            setCurrentHighResUrl(product.image.highResUrl);
            setCurrentCaption(product.image.caption);
            getImageOrientation(product.image.lowResUrl).then(setIsLandscape);
        }
    }, [product]);

    const handleThumbnailClick = (image: ProductImage) => {
        setOpacity(0);
        setTimeout(() => {
            setMainImageLowRes(image.lowResUrl);
            setCurrentHighResUrl(image.highResUrl);
            setCurrentCaption(image.caption);
            getImageOrientation(image.lowResUrl).then(setIsLandscape);
            setOpacity(1);
        }, 300);
    };

    // Calculate the index for the global gallery based on current high-res URL
    const handleImageClick = () => {
        const images = [product.image, ...product.thumbnails];
        const index = images.findIndex(img => img.highResUrl === currentHighResUrl);
        onOpenGallery(index >= 0 ? index : 0);
    };

    return (
        <div className={`cardContainer ${isLandscape ? 'landscape' : ''}`}>
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
            
            {product && (product.thumbnails.length > 0 || product.image) && (
                <div className="thumbnails">
                    <button
                        className="thumbnailContainer"
                        onClick={() => handleThumbnailClick(product.image)}
                        style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                    >
                        <img src={product.image.lowResUrl} alt="Main" className="thumbnail" />
                    </button>
                    {product.thumbnails.map((thumbnail, index) => (
                        <button
                            key={index}
                            className="thumbnailContainer"
                            onClick={() => handleThumbnailClick(thumbnail)}
                            style={{ cursor: 'pointer', border: 'none', background: 'none', padding: 0 }}
                        >
                            <img src={thumbnail.lowResUrl} alt={`Thumb ${index}`} className="thumbnail" />
                        </button>
                    ))}
                </div>
            )}

            {currentCaption && (
                <p className="imageCaption">{currentCaption}</p>
            )}
        </div>
    );
};

export default CardContainer;

