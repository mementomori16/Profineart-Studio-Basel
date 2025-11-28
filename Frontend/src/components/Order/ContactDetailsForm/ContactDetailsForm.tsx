import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';

import { Product, SlotSelection, CustomerDetails, LessonPackage } from '../../../../../Backend/types/Product';
import { PRODUCT_PACKAGES } from '../../../../../Backend/data/products';
import './contactDetailsForm.scss';

// Updated type definition for CustomerDetails to include new address fields
// Assuming the imported CustomerDetails type is now extended with these fields
type ExtendedCustomerDetails = CustomerDetails & {
    streetAndNumber: string;
    apartmentAndFloor: string;
    index: string; // Postal Code
    city: string;
    country: string;
};

// 1. UPDATE: Define the type that the form submits, including new fields
export type FullCustomerDetails = ExtendedCustomerDetails & { 
    dateOfBirth: string; 
    termsAgreed: boolean; 
};

interface ContactDetailsFormProps {
    product: Product;
    slotSelection: SlotSelection;
    initialDetails: ExtendedCustomerDetails; // Use extended type for initial details
    onBackStep: () => void;
    // 2. UPDATE: Change onSubmit signature to accept the new combined type
    onSubmit: (details: FullCustomerDetails) => Promise<void>; 
    isLoading: boolean;
}

const ContactDetailsForm: React.FC<ContactDetailsFormProps> = ({
    product,
    slotSelection,
    initialDetails,
    onBackStep,
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation();
    
    // Initialize state with extended fields. If initialDetails only contains old fields, the new ones will be undefined.
    // We ensure they are initialized as empty strings for control.
    const [details, setDetails] = useState<ExtendedCustomerDetails>({
        ...initialDetails,
        streetAndNumber: initialDetails.streetAndNumber || '',
        apartmentAndFloor: initialDetails.apartmentAndFloor || '',
        index: initialDetails.index || '',
        city: initialDetails.city || '',
        country: initialDetails.country || '',
    });
    
    // 3. NEW STATE: Date of Birth (stored as Date object) and Terms Agreement
    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [validationError, setValidationError] = useState<string | null>(null);

    // Function to get the package label based on the ID
    const getPackageLabel = (packageId: string): string => {
        const pkg = PRODUCT_PACKAGES.find(p => p.id === packageId) as LessonPackage | undefined;
        return pkg ? t(`packages.${pkg.id}.label`, { defaultValue: pkg.label }) : t('common.unknown');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation Checks (Updated to include new required address fields)
        if (!details.name || !details.email || !details.streetAndNumber || !details.index || !details.city || !details.country) {
            setValidationError(t('validation.requiredFields') || 'Name, Email, and all main Address fields (Street, Index, City, Country) are required.');
            return;
        }
        
        // Check for Date of Birth
        if (!dateOfBirth) {
            setValidationError(t('validation.dobRequired') || 'Date of Birth is required.');
            return;
        }
        
        // Check for Terms Agreement
        if (!termsAgreed) {
            setValidationError(t('validation.termsRequired') || 'You must agree to the Terms of Use.');
            return;
        }
        
        setValidationError(null);

        // 5. SUBMIT: Combine customer details with new fields and format DoB
        const fullDetails: FullCustomerDetails = {
            ...details,
            // Format Date of Birth to YYYY-MM-DD string for backend
            dateOfBirth: dateOfBirth.toISOString().split('T')[0], 
            termsAgreed: termsAgreed,
        };
        
        onSubmit(fullDetails);
    };

    // The price string comes from slotSelection.price, which should already be formatted/defined correctly.
    const formattedPrice = `${slotSelection.price} ${t('common.currency')}`;

    // DatePicker Configuration (Min date 1935, Max date today)
    const minDateLimit = new Date('1935-01-01');
    const maxDateLimit = new Date();

    return (
        // Styled with the aesthetic of the Date and Time component
        <div className="contact-details-form">
            
            <h3 className="h4 mb-3">{t('checkout.step2Title')}</h3>

            {/* Validation Error Display */}
            {validationError && (
                <div className="alert-warning"><FaExclamationCircle /> {validationError}</div>
            )}
            
            {/* Booking Summary - Styled as a primary section */}
            <div className="booking-summary">
                <h3 className="h5">{t('checkout.bookingSummary')}</h3>
                <p><strong>{product.title}</strong></p>
                <div className="justify-content-between">
                    <span>{t('checkout.summaryDate')}:</span>
                    <span>{slotSelection.selectedDate} @ {slotSelection.selectedTime}</span>
                </div>
                <div className="justify-content-between">
                    <span>{t('checkout.summaryPackage')}:</span>
                    <span>{getPackageLabel(slotSelection.packageId)}</span>
                </div>
                <hr />
                <div className="justify-content-between fw-bold">
                    <span>{t('checkout.totalPrice')}:</span>
                    <span>{formattedPrice}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form-section">
                <h4 className="h5">{t('checkout.personalDetails')}</h4>
                
                {/* Contact Fields Grid */}
                <div className="form-group-grid-address">
                    <div className="form-field">
                        <label>{t('form.name')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="name"
                            value={details.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>{t('form.email')} <span className="text-danger">*</span></label>
                        <input
                            type="email"
                            name="email"
                            value={details.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>{t('form.phone')}</label>
                        <input
                            type="tel"
                            name="phone"
                            value={details.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* NEW FIELD: Date of Birth */}
                    <div className="form-field date-picker-wrapper">
                        <label>{t('form.dateOfBirth')} <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <DatePicker
                                selected={dateOfBirth}
                                onChange={(date: Date | null) => setDateOfBirth(date)}
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100} // Increased dropdown range for easy 1935 selection
                                minDate={minDateLimit}
                                maxDate={maxDateLimit}
                                placeholderText={t('form.dobPlaceholder') || 'DD/MM/YYYY'}
                                className="form-control" // Used for styling the input box
                                required
                                // Allowing manual text input is default behavior, just ensuring the range is wide enough
                            />
                            <span className="input-group-text"><FaCalendarAlt /></span>
                        </div>
                    </div>
                </div>


                <h4 className="h5">{t('checkout.addressDetails')}</h4>

                {/* Address Line 1: Street and Apartment (2 fields) */}
                <div className="form-group-grid-address">
                    <div className="form-field">
                        <label>{t('form.streetAndNumber')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="streetAndNumber"
                            value={details.streetAndNumber}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>{t('form.apartmentAndFloor')}</label>
                        <input
                            type="text"
                            name="apartmentAndFloor"
                            value={details.apartmentAndFloor}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Address Line 2: Index, City, Country (3 fields) */}
                <div className="form-group-grid-address grid-3">
                    <div className="form-field">
                        <label>{t('form.index')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="index"
                            value={details.index}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>{t('form.city')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="city"
                            value={details.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-field">
                        <label>{t('form.country')} <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            name="country"
                            value={details.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-field">
                    <label>{t('form.message')}</label>
                    <textarea
                        name="message"
                        value={details.message}
                        onChange={handleChange}
                        rows={3}
                    />
                </div>

                
                {/* 7. NEW FIELD: Terms Agreement Checkbox */}
                <div className="form-check mb-4">
                    <input
                        type="checkbox"
                        id="termsAgreed"
                        className="form-check-input"
                        checked={termsAgreed}
                        onChange={(e) => setTermsAgreed(e.target.checked)}
                        required
                        disabled={isLoading}
                    />
                    <label className="form-check-label" htmlFor="termsAgreed">
                        {t('form.iAgreeTo')} <a href="/terms" target="_blank">{t('form.termsOfUse')}</a> <span className="text-danger">*</span>
                    </label>
                </div>
                
                <div className="d-flex justify-content-between">
                    <button 
                        type="button" 
                        onClick={onBackStep} 
                        className="btn-secondary"
                        disabled={isLoading}
                    >
                        &larr; {t('checkout.backToSchedule')}
                    </button>
                    
                    {/* CONFIRM AND PAY BUTTON */}
                    <button 
                        type="submit" 
                        className="btn-primary"
                        disabled={isLoading || !termsAgreed} // Disable if loading or terms not agreed
                    >
                        {isLoading ? t('common.processing') : t('checkout.confirmAndPay')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactDetailsForm;