import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import ContactDetailsForm, {
  FullCustomerDetails,
} from '../ContactDetailsForm/ContactDetailsForm';
import { Product, SlotSelection } from '../../../../../Backend/types/Product';

interface ContactDetailsProps {
  product: Product;
  slotSelection: SlotSelection;
  initialDetails: FullCustomerDetails;
  onBackStep: () => void;
  onTitleClick: () => void;
}

const MIN_AGE = 9;
const MAX_AGE = 85;

const calculateAge = (dateOfBirth: string): number => {
  const dob = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
};

const ContactDetails: React.FC<ContactDetailsProps> = ({
  product,
  slotSelection,
  initialDetails,
  onBackStep,
  onTitleClick,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handleSubmitOrder = async (fullDetails: FullCustomerDetails) => {
    if (isLoading) return;

    setPaymentError(null);

    // ✅ AGE VALIDATION (CRITICAL)
    const age = calculateAge(fullDetails.dateOfBirth);

    if (age < MIN_AGE || age > MAX_AGE) {
      setPaymentError(
        t(
          'validation.ageRestriction',
          'Unfortunately, this service is only available for people between 9 and 85 years old.'
        )
      );
      return; // ⛔ STOP HERE — NO STRIPE CALL
    }

    setIsLoading(true);

    const checkoutData = {
      price: slotSelection.price,
      packageId: slotSelection.packageId,
      selectedDate: slotSelection.selectedDate,
      selectedTime: slotSelection.selectedTime,
      name: fullDetails.name,
      email: fullDetails.email,
      phone: fullDetails.phone,
      message: fullDetails.message,
      dateOfBirth: fullDetails.dateOfBirth, // stored internally only
    };

    try {
      const response = await axios.post<{ checkoutUrl: string }>(
        '/api/create-checkout-session',
        checkoutData
      );

      if (!response.data.checkoutUrl) {
        throw new Error('Checkout URL missing');
      }

      window.location.href = response.data.checkoutUrl;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        t('checkout.unknownPaymentError');

      console.error('Checkout error:', msg);
      setPaymentError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="contact-details-payment-wrapper">
      {paymentError && (
        <div className="alert alert-danger mb-3">
          {t('common.error')}: {paymentError}
        </div>
      )}

      <ContactDetailsForm
        product={product}
        slotSelection={slotSelection}
        initialDetails={initialDetails}
        onBackStep={onBackStep}
        onTitleClick={onTitleClick}
        onSubmit={handleSubmitOrder}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ContactDetails;
