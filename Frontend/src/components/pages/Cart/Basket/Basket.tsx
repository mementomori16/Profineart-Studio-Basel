// src/components/pages/Cart/Basket.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '../../../../context/CartContext/CartContext';
import { FiShoppingCart, FiTrash } from 'react-icons/fi';
import './basket.scss';

const BasketItemCard: React.FC<{
  item: CartItem;
  onRemove: (id: number) => void;
  onCheckout: (id: number) => void;
}> = ({ item, onRemove, onCheckout }) => {
  const { t } = useTranslation();

  const getProductName = (id: number) => t(`products.${id}.title`);

  return (
    <div className="basket-item-card">
      <div className="item-image-container">
        <img
          src={item.image?.lowResUrl || ''}
          alt={getProductName(item.id)}
          className="item-image"
        />
      </div>

      <div className="item-details">
        <h3>{getProductName(item.id)}</h3>
        <p>{t('cart.itemDescriptionShort')}</p>
      </div>

      <div className="item-actions">
        <button className="btn-checkout" onClick={() => onCheckout(item.id)}>
          {t('checkout.toOrder')}
        </button>
        <button className="btn-remove" onClick={() => onRemove(item.id)}>
          <FiTrash style={{ marginRight: '0.25rem' }} />
          {t('common.remove')}
        </button>
      </div>
    </div>
  );
};

const Basket: React.FC = () => {
  const { t } = useTranslation();
  const { cart, removeItemFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleRemove = (productId: number) => removeItemFromCart(productId);

  const handleItemCheckout = (productId: number) => {
    navigate(`/order/${productId}`);
  };

  return (
    <div className="shopping-basket-page container">
      <h1 className="text-center">
        <FiShoppingCart style={{ marginRight: '0.5rem' }} />
        {t('cart.mainTitle')}
      </h1>

      <div className="basket-content-wrapper">
        {cart.length === 0 ? (
          <div className="basket-empty-message">
            <p>{t('cart.emptyMessage')}</p>
            <button
              className="btn-back-to-courses"
              onClick={() => navigate('/courses')}
            >
              {t('cart.backToCourses')}
            </button>
          </div>
        ) : (
          <>
            <div className="basket-list">
              {cart.map(item => (
                <BasketItemCard
                  key={item.id}
                  item={item}
                  onRemove={handleRemove}
                  onCheckout={handleItemCheckout}
                />
              ))}
            </div>

            <div className="basket-summary">
              <p>{t('cart.itemsCount', { count: cart.length })}</p>
              <button className="btn-clear-cart" onClick={clearCart}>
                <FiTrash style={{ marginRight: '0.25rem' }} />
                {t('cart.clearAll')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Basket;





