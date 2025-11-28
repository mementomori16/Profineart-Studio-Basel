// src/components/pages/Card/InfoContainer/InfoContainer.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'; // <--- NEW IMPORT
import { Product } from '../../../../../../Backend/types/Product';
// import DateSelector from '../../../DateSelector/DateSelector'; // <--- REMOVE: Replaced by new flow

import './infoContainer.scss';

type Props = {
    product: Product;
};

const InfoContainer: React.FC<Props> = ({ product }) => {
    const { t } = useTranslation();
    const navigate = useNavigate(); // <--- INITIALIZE NAVIGATE

    const translatedDescription = t(`products.${product.id}.description`);

    const renderDescription = () => {
        if (Array.isArray(product.description)) {
            return (
                <div className="description">
                    {product.description.map((_paragraph, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />
                    ))}
                </div>
            );
        }
        return (
            <p className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />
        );
    };

    // --- NEW HANDLER FOR BOOKING ---
    const handleBookNow = () => {
        // We navigate to the new OrderPage route, passing the product ID
        navigate(`/order/${product.id}`); 
    };
    // --- END NEW HANDLER ---

    return (
        <div className="infoContainer">
            {product.medium && <p className="medium">{product.medium}</p>}
            {product.date && <p className="infodate">{product.date}</p>}

            {renderDescription()}

            {/* E-COMMERCE BOOKING ACTION SECTION */}
            {product.medium === 'Course' && (
                <div className="booking-action-container"> 
                    {/* Add price display here if applicable */}
                    
                    <button 
                        className="btn-book-now" 
                        onClick={handleBookNow}
                    >
                        {t('checkout.bookNowButton')} 
                    </button>
                </div>
            )}
        </div>
    );
};

export default InfoContainer;

