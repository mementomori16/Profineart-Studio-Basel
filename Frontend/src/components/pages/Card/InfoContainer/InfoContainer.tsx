// src/components/pages/Card/InfoContainer/InfoContainer.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../../../types/Product';
import DateSelector from '../../../DateSelector/DateSelector'; // The new component

import './infoContainer.scss';

type Props = {
    product: Product;
};

const InfoContainer: React.FC<Props> = ({ product }) => {
    const { t } = useTranslation();

    const translatedDescription = t(`products.${product.id}.description`);

    // Ensure description rendering handles both array and string formats
    const renderDescription = () => {
        if (Array.isArray(product.description)) {
            // If description is an array, map over it (assuming translation handles structure)
            return (
                <div className="description">
                    {product.description.map((_paragraph, index) => (
                        <p key={index} dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />
                    ))}
                </div>
            );
        }
        // If description is a single string (translated)
        return (
            <p className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />
        );
    };


    return (
        <div className="infoContainer">
            {product.medium && <p className="medium">{product.medium}</p>}
            {product.date && <p className="infodate">{product.date}</p>}

            {/* Description Rendering Logic */}
            {renderDescription()}

            {/* E-COMMERCE DATE SELECTOR & CHECKOUT SECTION 
                The DateSelector component is rendered only if the medium is 'Course'.
            */}
            {product.medium === 'Course' && (
                <DateSelector product={product} />
            )}
        </div>
    );
};

export default InfoContainer;

