import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../context/CartContext/CartContext';
import { Product } from '../../../../../../Backend/types/Product';
import './infoContainer.scss';

type Props = {
    product: Product;
    isTextOnly: boolean;
    onOpenGallery?: (index: number) => void;
};

const InfoContainer: React.FC<Props> = ({ product, isTextOnly, onOpenGallery }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { addItemToCart, isProductInCart } = useCart();

    const detailsTextKey = `products.${product.id}.detailsSection.text`;
    const detailsText = t(detailsTextKey);
    const isDetailsTextMissing = detailsText === detailsTextKey;

    const itemInCart = isProductInCart(product.id);
    const isBookable = product.medium === t('cardPage.mediumForPrivateLessonsCheck');

    // Reusable Booking Buttons
    const BookingButtons = isBookable ? (
        <div className="booking-action-container">
            <button 
                className={`btn-add-to-cart ${itemInCart ? 'in-cart' : ''}`}
                onClick={() => { if(!itemInCart) addItemToCart(product); navigate('/basket'); }}
            >
                {itemInCart ? t('checkout.alreadyInBasket') : t('checkout.addToCartButton')}
            </button>
            <button className="btn-book-now" onClick={() => navigate(`/order/${product.id}`)}>
                {t('checkout.bookNowButton')}
            </button>
        </div>
    ) : null;

    const renderImg = (index: number, isMobile: boolean) => {
        const image = product.detailsImages?.[index];
        if (!image) return null;
        return (
            <button 
                key={index} 
                className={`detailImageWrapper ${isMobile ? 'mobile-only-img' : ''}`} 
                onClick={() => onOpenGallery?.(index)}
            >
                <img src={image.lowResUrl} alt="" className="detailImage" />
                {image.caption && <p className="imageCaption">{image.caption}</p>}
            </button>
        );
    };

    if (isTextOnly) {
        return (
            <div className="infoContainer-text">
                {/* PLACED HERE: Directly under CardContainer on mobile */}
                <div className="mobile-buttons-wrapper">
                    {BookingButtons}
                </div>

                {product.date && <p className="infodate">{product.date}</p>}
                <div className="description" dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />

                {!isDetailsTextMissing && (
                    <div className="detailsSection-wrapper">
                        {renderImg(0, true)}
                        
                        <h2 className="detailsTitle">
                            {product.detailsTitle || t(`products.${product.id}.detailsSection.title`)}
                        </h2>

                        <div className="detailsText">
                            {detailsText.split('<h3>').map((chunk, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && renderImg(i, true)}
                                    <div dangerouslySetInnerHTML={{ __html: i === 0 ? chunk : '<h3>' + chunk }} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="infoContainer-visual">
            {BookingButtons}
            <div className="detailsImageGallery">
                {product.detailsImages?.map((_, index) => renderImg(index, false))}
            </div>
        </div>
    );
};

export default InfoContainer;


