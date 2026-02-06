import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart, CartItem } from '../../../../context/CartContext/CartContext';
import { FiShoppingCart, FiTrash, FiAlertCircle } from 'react-icons/fi';
import './basket.scss';

const BasketItemCard: React.FC<{
  item: CartItem;
  onRemove: (id: number) => void;
  onCheckout: (id: number) => void;
  isBlocked: boolean;
}> = ({ item, onRemove, onCheckout, isBlocked }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getProductName = (id: number) => t(`products.${id}.title`);
  const getProductBriefDescription = (id: number) => t(`products.${id}.briefDescription`); 
  
  return (
    <div className="basket-item-card">
      <div className="item-image-container" onClick={() => navigate(`/card/${item.id}`)}>
        <img
          src={item.image?.lowResUrl || ''}
          alt={getProductName(item.id)}
          className="item-image"
        />
      </div>

      <div className="item-details" onClick={() => navigate(`/card/${item.id}`)}>
        <h3>{getProductName(item.id)}</h3>
        <p>{getProductBriefDescription(item.id)}</p> 
      </div>

      <div className="item-actions">
        <button 
          className="btn-checkout-inviting" 
          onClick={() => onCheckout(item.id)}
          disabled={isBlocked}
        >
          {t('checkout.checkoutButtonText')}
        </button>
        <button className="btn-remove-subtle" onClick={() => onRemove(item.id)}>
          <FiTrash />
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

  const isBlocked = cart.length > 1;

  useEffect(() => {
    document.body.style.backgroundColor = '#171717'; 
    return () => { document.body.style.backgroundColor = ''; };
  }, []);

  return (
    <div className="shopping-basket-page container">
      <div className="basket-frame">
        <h1 className="text-center">
          <FiShoppingCart style={{ marginRight: '0.5rem' }} />
          {t('cart.mainTitle')}
        </h1>

        {isBlocked && (
          <div className="basket-error-notice">
            <FiAlertCircle className="error-icon" />
            <span>{t('cart.multiItemError')}</span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="basket-empty-message">
            <p>{t('cart.emptyMessage')}</p>
            <button className="btn-back-to-courses" onClick={() => navigate('/courses')}>
              {t('cart.backToCourses')}
            </button>
          </div>
        ) : (
          <div className="basket-content-wrapper">
            <div className="basket-list">
              {cart.map(item => (
                <BasketItemCard
                  key={item.id}
                  item={item}
                  onRemove={removeItemFromCart}
                  onCheckout={(id) => navigate(`/order/${id}`)}
                  isBlocked={isBlocked}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Basket;





