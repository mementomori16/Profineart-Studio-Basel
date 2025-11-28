// src/components/Order/ContactDetails/ContactDetails.tsx - FINAL ERROR-FREE VERSION

import React, { useState } from 'react';
import axios from 'axios'; // Keeping axios as it's used in handleSubmitOrder
import { useTranslation } from 'react-i18next';

// 1. Import the form component and the required type from its file
import ContactDetailsForm, { FullCustomerDetails } from '../ContactDetailsForm/ContactDetailsForm';

// 2. Import the base types
import { Product, SlotSelection } from '../../../../../Backend/types/Product';

// Interface definition uses the imported type
interface ContactDetailsProps {
    product: Product;
    slotSelection: SlotSelection;
    initialDetails: FullCustomerDetails; 
    onBackStep: () => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
    product,
    slotSelection,
    initialDetails,
    onBackStep,
}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const handleSubmitOrder = async (fullDetails: FullCustomerDetails) => {
        if (isLoading) return;

        setIsLoading(true);
        setPaymentError(null);
        
        const checkoutData = {
            // Data for backend
            price: slotSelection.price,
            packageId: slotSelection.packageId,
            selectedDate: slotSelection.selectedDate,
            selectedTime: slotSelection.selectedTime,
            name: fullDetails.name,
            email: fullDetails.email,
            phone: fullDetails.phone,
            message: fullDetails.message,
            dateOfBirth: fullDetails.dateOfBirth,
        };

        try {
            // Call your backend API endpoint and expect the redirect URL
            const response = await axios.post<{ checkoutUrl: string }>('/api/create-checkout-session', checkoutData);

            const { checkoutUrl } = response.data;
            
            if (!checkoutUrl) {
                throw new Error("Backend did not return a Stripe checkout URL.");
            }

            // Redirect to Stripe's hosted Checkout page
            window.location.href = checkoutUrl;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || t('checkout.unknownPaymentError');
            console.error('Checkout Session Failed:', errorMessage);
            setPaymentError(errorMessage);
            setIsLoading(false); // Stop loading only if the API call or redirect setup fails
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
                onSubmit={handleSubmitOrder} 
                isLoading={isLoading}
            />
        </div>
    );
};

export default ContactDetails;