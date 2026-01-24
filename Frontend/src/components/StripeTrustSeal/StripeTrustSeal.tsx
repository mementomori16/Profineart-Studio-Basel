import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaLock, FaShieldAlt } from 'react-icons/fa';
import './stripeTrustSeal.scss';

const StripeTrustSeal: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="stripe-trust-seal">
      <div className="trust-header">
        <FaLock className="trust-icon" />
        <span>{t('checkout.securePayment', 'Secure Payment via')} <strong>Stripe</strong></span>
      </div>
      
      <div className="payment-methods-row">
        <span className="method">TWINT</span>
        <span className="method">Visa</span>
        <span className="method">Mastercard</span>
        <span className="method">Apple Pay</span>
        <span className="method">Google Pay</span>
        <span className="method">Klarna</span>
      </div>

      <div className="security-note">
        <FaShieldAlt className="shield-icon" />
        <span>{t('checkout.encryptedData', 'Your data is encrypted & processed securely.')}</span>
      </div>
    </div>
  );
};

export default StripeTrustSeal;