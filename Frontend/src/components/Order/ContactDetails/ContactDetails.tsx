import React, { useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import ContactDetailsForm, { FullCustomerDetails } from '../ContactDetailsForm/ContactDetailsForm';
import { Product, SlotSelection } from '../../../../../Backend/types/Product';

interface ContactDetailsProps {
    product: Product;
    slotSelection: SlotSelection;
    initialDetails: FullCustomerDetails; 
    onBackStep: () => void;
    onTitleClick: () => void; 
}

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

        setIsLoading(true);
        setPaymentError(null);
        
        // ✅ STEP 1: Combine the separate fields from your form into one string
        const formattedAddress = `${fullDetails.streetAndNumber}${fullDetails.apartmentAndFloor ? ', ' + fullDetails.apartmentAndFloor : ''}, ${fullDetails.index} ${fullDetails.city}, ${fullDetails.country}`;

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
            address: formattedAddress, // ✅ STEP 2: Send the address string to the API
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
                onTitleClick={onTitleClick}
                onSubmit={handleSubmitOrder} 
                isLoading={isLoading}
            />
        </div>
    );
};

export default ContactDetails;