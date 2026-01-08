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

    const allCourses: Product[] = products.courses || []; 
    const otherCourses = allCourses.filter(product => product.id !== currentProductId);
    const finalOtherCourses = otherCourses.slice(0, 10); 

    if (finalOtherCourses.length === 0) return null;

    return (
        <div className="similarProducts">
            <h2>{t('similarProducts.exploreOtherCourses')}</h2> 
            <div className="scrollableGallery">
                {finalOtherCourses.map(product => (
                    <div key={product.id} className="similarProductItem">
                        {/* Badge implementation exactly like Courses.tsx */}
                        {product.badge && (
                            <div className="badge">
                                {t(`products.${product.id}.badge`)}
                            </div>
                        )}

                        <Link to={`/card/${product.id}`} className="imageWrapper">
                            <img
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