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
        
        // ASSEMBLY: Glue the 5 individual fields into one string for Stripe Metadata
        const combinedAddress = [
            fullDetails.streetAndNumber,
            fullDetails.apartmentAndFloor,
            `${fullDetails.index} ${fullDetails.city}`,
            fullDetails.country
        ].filter(part => part && part.trim() !== "").join(', ');

        const checkoutData = {
            productId: product.id.toString(),
            packageId: slotSelection.packageId,
            selectedDate: slotSelection.selectedDate,
            selectedTime: slotSelection.selectedTime,
            price: slotSelection.price,
            lessons: slotSelection.lessons,
            durationMinutes: slotSelection.durationMinutes,
            // This is the key the backend is looking for
            address: combinedAddress, 
            name: fullDetails.name,
            email: fullDetails.email,
            phone: fullDetails.phone,
            message: fullDetails.message,
            dateOfBirth: fullDetails.dateOfBirth,
        };

        try {
            const response = await axios.post<{ checkoutUrl: string }>('/api/create-checkout-session', checkoutData);
            const { checkoutUrl } = response.data;
            
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || t('checkout.unknownPaymentError');
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