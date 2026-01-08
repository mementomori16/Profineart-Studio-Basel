import React, { useEffect, useState } from 'react';
import { Product, ProductImage } from '../../../../../../Backend/types/Product';
import './cardContainer.scss';

const CardContainer: React.FC<{ product: Product, onOpenGallery: (i: number) => void }> = ({ product, onOpenGallery }) => {
    const [mainImage, setMainImage] = useState(product.image.lowResUrl);
    const [isLoaded, setIsLoaded] = useState(false);

    // Reset when product changes
    useEffect(() => {
        preloadImage(product.image.lowResUrl);
    }, [product]);

    const preloadImage = (url: string) => {
        setIsLoaded(false); // Hide the old image immediately
        const img = new Image();
        img.src = url;
        img.onload = () => {
            setMainImage(url);
            setIsLoaded(true); // Show the new image only when 100% downloaded
        };
    };

    const handleThumbnailClick = (image: ProductImage) => {
        preloadImage(image.lowResUrl);
    };

    return (
        <div className="cardContainer">
            <div className="imageContainer">
                <img
                    src={mainImage}
                    alt="Gallery"
                    className={`image ${isLoaded ? 'loaded' : ''}`}
                    onClick={() => onOpenGallery(0)}
                />
            </div>
            
            <div className="thumbnails">
                {[product.image, ...product.thumbnails].map((img, idx) => (
                    <div key={idx} className="thumbnailContainer" onClick={() => handleThumbnailClick(img)}>
                        <img src={img.lowResUrl} className="thumbnail" alt="thumb" />
                    </div>
                ))}
            </div>

            {product.image.caption && <p className="imageCaption">{product.image.caption}</p>}
        </div>
    );
};

export default CardContainer;

