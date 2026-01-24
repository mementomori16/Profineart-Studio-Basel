// src/components/Order/ContactDetails/ContactDetails.tsx - FIXED NAVIGATION VERSION

import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

// 1. Import the form component and types
import ContactDetailsForm, { FullCustomerDetails } from '../ContactDetailsForm/ContactDetailsForm';

// 2. Import the base types
import { Product, SlotSelection } from '../../../../../Backend/types/Product';

// Interface definition: Added onTitleClick to bridge the navigation
interface ContactDetailsProps {
    product: Product;
    slotSelection: SlotSelection;
    initialDetails: FullCustomerDetails; 
    onBackStep: () => void;
    onTitleClick: () => void; // ✅ Step 1: Accept the prop in the interface
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
    product,
    slotSelection,
    initialDetails,
    onBackStep,
    onTitleClick, // ✅ Step 2: Destructure the prop
}) => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const handleSubmitOrder = async (fullDetails: FullCustomerDetails) => {
        if (isLoading) return;

        setIsLoading(true);
        setPaymentError(null);
        
        const checkoutData = {
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
            const response = await axios.post<{ checkoutUrl: string }>('/api/create-checkout-session', checkoutData);
            const { checkoutUrl } = response.data;
            
            if (!checkoutUrl) {
                throw new Error("Backend did not return a Stripe checkout URL.");
            }

            window.location.href = checkoutUrl;

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || t('checkout.unknownPaymentError');
            console.error('Checkout Session Failed:', errorMessage);
            setPaymentError(errorMessage);
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
                onTitleClick={onTitleClick} // ✅ Step 3: Pass it to the Form
                onSubmit={handleSubmitOrder} 
                isLoading={isLoading}
            />
        </div>
    );
};

export default ContactDetails;