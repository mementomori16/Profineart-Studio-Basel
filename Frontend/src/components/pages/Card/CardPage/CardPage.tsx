import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CardContainer from '../CardContainer/CardContainer';
import InfoContainer from '../InfoContainer/InfoContainer';
import SimilarProducts from '../../../SimilarProducts/SimilarProducts';
import { products } from '../../../../../../Backend/data/products';
import SimilarProjects from '../../../SimilarProjects/Similarprojects';
import './cardPage.scss';

const CardPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    // CRITICAL FIX: Robustly parse the ID to prevent NaN/undefined issues
    const parsedId = id ? parseInt(id, 10) : NaN;
    const currentImageId = isNaN(parsedId) ? 0 : parsedId;

    const allProducts = [
        ...products.courses,
        ...products.services,
        ...products.portfolio, 
    ];

    const product = allProducts.find((p) => p.id === currentImageId);

    // If product is not found, return error message immediately.
    if (!product) {
        console.error(`Product not found for ID: ${id}. Parsed ID: ${currentImageId}`);
        return <p>{t('cardPage.productNotFound')}</p>;
    }

    const isPortfolioProduct = products.portfolio.some(item => item.id === currentImageId);

    return (
        <div className="cardPageContainer">
            <div className="cardContentWrapper">
                
                {/* 1. HEADER */}
                <div className="cardHeader">
                    <h1 className="pageTitle">{t(`products.${product.id}.title`)}</h1>
                </div>

                {/* 2. LAYOUT WRAPPER */}
                <div className="cardContentLayout">
                    <CardContainer product={product} /> 
                    <InfoContainer product={product} /> 
                </div>

            </div>

            <div className="similarProductsContainer">
                {isPortfolioProduct ? (
                    <SimilarProjects currentProductId={currentImageId} />
                ) : (
                    <SimilarProducts currentProductId={currentImageId} />
                )}
            </div>
        </div>
    );
};

export default CardPage;


