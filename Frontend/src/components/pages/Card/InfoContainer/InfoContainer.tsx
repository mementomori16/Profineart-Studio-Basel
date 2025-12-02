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

    // --- RENDER DESCRIPTION LOGIC ---
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
        return <p className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />;
    };
    // --- END RENDER DESCRIPTION LOGIC ---

    // --- BOOK NOW HANDLER ---
    const handleBookNow = () => {
        navigate(`/order/${product.id}`);
    };

    // --- ADD TO CART + NAVIGATE HANDLER ---
    const handleAddToCartAndGoToBasket = () => {
        // Add product if not already in cart
        if (!isProductInCart(product.id)) {
            addItemToCart(product);
            console.log(`Product ${product.id} added to cart`);
        } else {
            console.log(`Product ${product.id} already in cart`);
        }
        // Always navigate to basket page
        navigate('/basket');
    };

    return (
        <div className="infoContainer">
            {product.medium && <p className="medium">{product.medium}</p>}
            {product.date && <p className="infodate">{product.date}</p>}

            {renderDescription()}

            {product.medium === 'Course' && (
                <div className="booking-action-container">
                    <button
                        className="btn-add-to-cart"
                        onClick={handleAddToCartAndGoToBasket}
                    >
                        {isProductInCart(product.id)
                            ? t('checkout.inCartButton')
                            : t('checkout.addToCartButton')}
                    </button>

                    <button className="btn-book-now" onClick={handleBookNow}>
                        {t('checkout.bookNowButton')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default InfoContainer;



