// src/components/pages/Card/ProductDetailsFrame/ProductDetailsFrame.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../../../../Backend/types/Product'; 
import './productDetailsFrame.scss';

type Props = {
    product: Product;
    onOpenGallery: (index: number) => void; 
};

const ProductDetailsFrame: React.FC<Props> = ({ product, onOpenGallery }) => {
    const { t } = useTranslation();

    const detailsTextKey = `products.${product.id}.detailsSection.text`;
    const detailsText = t(detailsTextKey);

    const detailsImages = product.detailsImages || []; 
    
    const detailsTitle = product.detailsTitle || t(`products.${product.id}.detailsSection.title`, {
        defaultValue: 'Extended Product Details' 
    }); 

    const isTextMissing = detailsText === detailsTextKey;

    if (isTextMissing && detailsImages.length === 0) {
        return null; 
    }

    return (
        <div className="productDetailsFrame">
            
            <h2 className="detailsTitle">
                {detailsTitle}
            </h2>

            <div className="detailsContentLayout">
                
                {/* 1. TEXT COLUMN (Text first, aligned left) */}
                {!isTextMissing && (
                    <div className="detailsText" dangerouslySetInnerHTML={{ __html: detailsText }} />
                )}

                {/* 2. IMAGE COLUMN (Visual second) */}
                {detailsImages.length > 0 && (
                    <div className="detailsImageGallery">
                        {detailsImages.map((image, index) => (
                            <button 
                                key={index} 
                                className="detailImageWrapper" 
                                onClick={() => onOpenGallery(index)}
                            >
                                <img 
                                    src={image.lowResUrl} 
                                    alt={image.altText || `${product.title} detail ${index + 1}`} 
                                    className="detailImage" 
                                />
                                {image.caption && <p className="imageCaption">{image.caption}</p>}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailsFrame;