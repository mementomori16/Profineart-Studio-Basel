// src/SimilarProducts/SimilarProducts.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { products } from '../../../../Backend/data/products';
import { Product } from '../../../../Backend/types/Product';
import './similarProducts.scss';

interface SimilarProductsProps {
    currentProductId: number;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({ currentProductId }) => {
    const { t } = useTranslation();

    // ✅ FIX 1: Change from 'products.services' to 'products.courses'.
    // ✅ FIX 2: Add safety fallback '|| []' to prevent the 'filter' error 
    // if 'products.courses' is somehow undefined.
    const allCourses: Product[] = products.courses || []; 

    // Filter out the current product from the courses list
    // This is the line that was crashing when allCourses was undefined.
    const otherCourses = allCourses.filter(product => product.id !== currentProductId);

    // You can limit the number of courses displayed
    const finalOtherCourses = otherCourses.slice(0, 10); 

    // If there are no other courses to show, return null
    if (finalOtherCourses.length === 0) {
        return null;
    }

    return (
        <div className="similarProducts">
            <h2>{t('similarProducts.exploreOtherCourses')}</h2> {/* Update translation key */}
            <div className="scrollableGallery">
                {finalOtherCourses.map(product => (
                    <div key={product.id} className="similarProductItem">
                        <Link to={`/card/${product.id}`}>
                            <img
                                // Assuming 'product.image' should be 'product.image.lowResUrl' based on your data structure
                                src={product.image.lowResUrl} 
                                alt={t(`products.${product.id}.title`)} 
                                className="image"
                            />
                        </Link>
                        <h3 className="title">{t(`products.${product.id}.title`)}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimilarProducts;