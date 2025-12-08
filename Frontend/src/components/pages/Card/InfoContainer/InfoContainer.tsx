// src/components/pages/Card/InfoContainer/InfoContainer.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext/CartContext';
import { Product } from '../../../../../../Backend/types/Product';

import './infoContainer.scss';

type Props = {
    product: Product;
};

const InfoContainer: React.FC<Props> = ({ product }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addItemToCart, isProductInCart } = useCart();

    const translatedDescription = t(`products.${product.id}.description`);
    const itemInCart = isProductInCart(product.id);

    // ... (renderDescription logic remains unchanged) ...
    const renderDescription = () => {
        if (Array.isArray(product.description)) {
            return (
                <div className="description">
                    {product.description.map((_paragraph, index) => (
                        <p
                            key={index}
                            dangerouslySetInnerHTML={{
                                __html: t(`products.${product.id}.description[${index}]`),
                            }}
                        />
                    ))}
                </div>
            );
        }
        return <div className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />;
    };


    // --- RENDER MEDIUM LOGIC (Updated path to cardPage) ---
    const renderMedium = () => {
        if (!product.medium) return null;

        // ✅ UPDATED PATH: Get the value for the comparison from cardPage
        const mediumToChange = t('cardPage.mediumForPrivateLessonsCheck', { defaultValue: 'Course' });

        // Use the dynamic value for the comparison
        const context = product.medium === mediumToChange ? 'privateLessons' : 'default';

        return (
            <p className="medium">
                {/* ✅ UPDATED PATH: Use cardPage.mediumType with context */}
                {t('cardPage.mediumType', { context: context, defaultValue: product.medium })}
            </p>
        );
    };
    // --- END RENDER MEDIUM LOGIC ---

    // --- BUTTONS LOGIC ---
    
    // ✅ UPDATED PATH: Check if product.medium matches the value defined in cardPage
    const isBookableMedium = product.medium === t('cardPage.mediumForPrivateLessonsCheck', { defaultValue: 'Course' });

    const handleBookNow = () => {
        navigate(`/order/${product.id}`);
    };

    const handleAddToCartAndGoToBasket = () => {
        if (!itemInCart) {
            addItemToCart(product);
        }
        navigate('/basket');
    };
    
    const getCartButtonTextKey = () => {
        return itemInCart ? 'checkout.toOrder' : 'checkout.addToCartButton';
    };

    return (
        <div className="infoContainer">
            {isBookableMedium && (
                <div className="booking-action-container center-buttons">
                    <button
                        className={`btn-add-to-cart ${itemInCart ? 'in-cart' : ''}`}
                        onClick={handleAddToCartAndGoToBasket}
                    >
                        {t(getCartButtonTextKey())}
                    </button>

                    <button 
                        className="btn-book-now" 
                        onClick={handleBookNow}
                    >
                        {t('checkout.bookNowButton')}
                    </button>
                </div>
            )}

            {renderMedium()} 
            
            {product.date && <p className="infodate">{product.date}</p>}

            {renderDescription()}
        </div>
    );
};

export default InfoContainer;


