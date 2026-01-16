import React, { useState, useEffect } from 'react';
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

const DetailImage: React.FC<{ url: string, alt: string, caption?: string, onClick?: () => void }> = ({ url, alt, caption, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const [orientation, setOrientation] = useState<'is-portrait' | 'is-landscape'>('is-portrait');

    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            if (img.naturalWidth > img.naturalHeight) {
                setOrientation('is-landscape');
            } else {
                setOrientation('is-portrait');
            }
            setLoaded(true);
        };
    }, [url]);

    return (
        <button className="detailImageWrapper" onClick={onClick} type="button">
            <img 
                src={url} 
                alt={alt} 
                className={`detailImage ${loaded ? 'loaded' : ''} ${orientation}`} 
            />
            {caption && <p className="imageCaption">{caption}</p>}
        </button>
    );
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

    const renderImg = (index: number) => {
        const image = product.detailsImages?.[index];
        if (!image) return null;
        return (
            <DetailImage 
                key={index}
                url={image.lowResUrl} 
                alt={image.altText || t(`products.${product.id}.title`)}
                caption={image.caption}
                onClick={() => onOpenGallery?.(index)}
            />
        );
    };

    const splitIndex = detailsText.indexOf('</p>') + 4;
    const hasMultipleParagraphs = splitIndex > 4 && splitIndex < detailsText.length;
    const firstPart = hasMultipleParagraphs ? detailsText.substring(0, splitIndex) : detailsText;
    const secondPart = hasMultipleParagraphs ? detailsText.substring(splitIndex) : "";

    if (isTextOnly) {
        return (
            <div className="infoContainer-text-column">
                <div className="mobile-only-section">{BookingButtons}</div>
                
                {product.date && <p className="infodate">{product.date}</p>}
                
                {/* NEW WRAPPER: info-main-wrapper 
                   This acts as the single frame for desktop browser 
                */}
                <div className="info-main-wrapper">
                    <div className="content-frame main-description">
                        <div 
                            className="description" 
                            dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} 
                        />
                    </div>

                    {!isDetailsTextMissing && (
                        <div className="detailsSection-wrapper">
                            
                            {/* Staggered view splits the frames for mobile layout */}
                            <div className="mobile-staggered-view">
                                {renderImg(0)}
                                <div className="content-frame">
                                    <h3 className="detailsTitle">{t(`products.${product.id}.detailsSection.title`)}</h3>
                                    <div className="detailsText" dangerouslySetInnerHTML={{ __html: firstPart }} />
                                </div>
                                {renderImg(1)}
                                {secondPart && (
                                    <div className="content-frame no-bg-mobile">
                                        <div className="detailsText" dangerouslySetInnerHTML={{ __html: secondPart }} />
                                    </div>
                                )}
                            </div>

                            {/* Full view shows everything in one flow for desktop browser */}
                            <div className="desktop-full-text-view">
                                <div className="content-frame">
                                    <h3 className="detailsTitle">{t(`products.${product.id}.detailsSection.title`)}</h3>
                                    <div className="detailsText" dangerouslySetInnerHTML={{ __html: detailsText }} />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                <div className="mobile-only-section">
                    {product.detailsImages?.slice(2).map((_, index) => renderImg(index + 2))}
                </div>
            </div>
        );
    }

    return (
        <div className="infoContainer-visual-column">
            {BookingButtons}
            {product.detailsImages?.map((_, index) => renderImg(index))}
        </div>
    );
};

export default InfoContainer;

/* import React, { useState, useEffect } from 'react';
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

// --- HELPER COMPONENT FOR SILENT LOADING ---
const DetailImage: React.FC<{ url: string, alt: string, caption?: string, onClick?: () => void }> = ({ url, alt, caption, onClick }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = url;
        img.onload = () => setLoaded(true);
    }, [url]);

    return (
        <button className="detailImageWrapper" onClick={onClick}>
            <img 
                src={url} 
                alt={alt} 
                className={`detailImage ${loaded ? 'loaded' : ''}`} 
            />
            {caption && <p className="imageCaption">{caption}</p>}
        </button>
    );
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
            <div key={index} className={isMobile ? 'mobile-only-img' : ''}>
                <DetailImage 
                    url={image.lowResUrl} 
                    alt={image.altText || t(`products.${product.id}.title`)}
                    caption={image.caption}
                    onClick={() => onOpenGallery?.(index)}
                />
            </div>
        );
    };

    // Logic to split the HTML string for mobile staggered layout
    const splitIndex = detailsText.indexOf('</p>') + 4; 
    const firstPart = detailsText.substring(0, splitIndex);
    const secondPart = detailsText.substring(splitIndex);

    if (isTextOnly) {
        return (
            <div className="infoContainer-text">
                <div className="mobile-buttons-wrapper">
                    {BookingButtons}
                </div>

                {product.date && <p className="infodate">{product.date}</p>}
                
                <div className="content-frame">
                    <div className="description" dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />
                </div>

                {!isDetailsTextMissing && (
                    <div className="detailsSection-wrapper">
                        {renderImg(0, true)}

                        <div className="details-content-group">
                            <div className="content-frame split-top">
                                <h3 className="detailsTitle">{t(`products.${product.id}.detailsSection.title`)}</h3>
                                <div className="detailsText" dangerouslySetInnerHTML={{ __html: firstPart }} />
                            </div>

                            {renderImg(1, true)}

                            <div className="content-frame split-bottom">
                                <div className="detailsText" dangerouslySetInnerHTML={{ __html: secondPart }} />
                            </div>
                        </div>

                        {product.detailsImages?.slice(2).map((_, index) => renderImg(index + 2, true))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="infoContainer-visual">
            {BookingButtons}
            {product.detailsImages?.map((_, index) => renderImg(index, false))}
        </div>
    );
};

export default InfoContainer;*/

