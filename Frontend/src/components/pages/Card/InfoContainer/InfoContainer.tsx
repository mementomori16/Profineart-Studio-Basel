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

  return (
    <div className="infoContainer">
      {product.medium && <p className="medium">{product.medium}</p>}
      {product.date && <p className="infodate">{product.date}</p>}

      {/* Description Rendering Logic */}
      {Array.isArray(product.description) ? (
        <div className="description">
          {product.description.map((_paragraph, index) => (
            <p key={index} dangerouslySetInnerHTML={{ __html: t(`products.${product.id}.description`) }} />
          ))}
        </div>
      ) : (
        <p className="description" dangerouslySetInnerHTML={{ __html: translatedDescription }} />
      )}

      {/* E-COMMERCE DATE SELECTOR & CHECKOUT SECTION 
          Requires price and stripePriceId to be defined on the Product interface.
      */}
      {product.medium === 'Course' && product.price && product.stripePriceId && (
        <DateSelector product={product} />
      )}
      
      {/* Old "Explore" button removed to prevent conflicting actions. */}
    </div>
  );
};

export default InfoContainer;

