import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';

import { Product, SlotSelection, CustomerDetails, LessonPackage } from '../../../../../Backend/types/Product';
import { PRODUCT_PACKAGES } from '../../../../../Backend/data/products';
import './contactDetailsForm.scss';

// Updated type definition for CustomerDetails to include new address fields
type ExtendedCustomerDetails = CustomerDetails & {
    streetAndNumber: string;
    apartmentAndFloor: string;
    index: string; // Postal Code
    city: string;
    country: string;
};

export type FullCustomerDetails = ExtendedCustomerDetails & {
    dateOfBirth: string;
    termsAgreed: boolean;
};

interface ContactDetailsFormProps {
    product: Product;
    slotSelection: SlotSelection;
    initialDetails: ExtendedCustomerDetails;
    onBackStep: () => void;
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

    const [details, setDetails] = useState<ExtendedCustomerDetails>({
        ...initialDetails,
        streetAndNumber: initialDetails.streetAndNumber || '',
        apartmentAndFloor: initialDetails.apartmentAndFloor || '',
        index: initialDetails.index || '',
        city: initialDetails.city || '',
        country: initialDetails.country || '',
    });

    const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
    const [termsAgreed, setTermsAgreed] = useState(false);

    const [validationError, setValidationError] = useState<string | null>(null);

    const getPackageLabel = (packageId: string): string => {
        const pkg = PRODUCT_PACKAGES.find(p => p.id === packageId) as LessonPackage | undefined;
        return pkg ? t(`packages.${pkg.id}.label`, { defaultValue: pkg.label }) : t('common.unknown');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!details.name || !details.email || !details.streetAndNumber || !details.index || !details.city || !details.country) {
            setValidationError(t('validation.requiredFields') || 'Name, Email, and all main Address fields are required.');
            return;
        }

        if (!dateOfBirth) {
            setValidationError(t('validation.dobRequired') || 'Date of Birth is required.');
            return;
        }

        if (!termsAgreed) {
            setValidationError(t('validation.termsRequired') || 'You must agree to the Terms of Use.');
            return;
        }

        setValidationError(null);

        const fullDetails: FullCustomerDetails = {
            ...details,
            dateOfBirth: dateOfBirth.toISOString().split('T')[0],
            termsAgreed: termsAgreed,
        };

        onSubmit(fullDetails);
    };

    const formattedPrice = `${slotSelection.price} ${t('common.currency')}`;

    const minDateLimit = new Date('1935-01-01');
    const maxDateLimit = new Date();

    return (
        <div className="contact-details-form">

            <h3 className="h4 mb-3">{t('checkout.step2Title')}</h3>

            {validationError && (
                <div className="alert-warning"><FaExclamationCircle /> {validationError}</div>
            )}

            <div className="booking-summary">
                <h3 className="h5">{t('checkout.bookingSummary')}</h3>
                <p className="course-title"><strong>{product.title}</strong></p>
                
                <div className="justify-content-between">
                    <span>{t('checkout.summaryDate')}:</span>
                    <span>
                        {format(parseISO(slotSelection.selectedDate), 'dd/MM/yyyy')} | Time: {slotSelection.selectedTime}
                    </span>
                </div>
                <div className="justify-content-between">
                    <span>{t('checkout.summaryPackage')}:</span>
                    <span>{getPackageLabel(slotSelection.packageId)}</span>
                </div>
                {/* Only one line before total price */}
                <div className="justify-content-between fw-bold">
                    <span>{t('checkout.totalPrice')}:</span>
                    <span>{formattedPrice}</span>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <h4 className="h5">{t('checkout.personalDetails')}</h4>

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

                    <div className="form-field date-picker-wrapper">
                        <label>{t('form.dateOfBirth')} <span className="text-danger">*</span></label>
                        <div className="input-group">
                            <DatePicker
                                selected={dateOfBirth}
                                onChange={(date: Date | null) => setDateOfBirth(date)}
                                dateFormat="dd/MM/yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                yearDropdownItemNumber={100}
                                minDate={minDateLimit}
                                maxDate={maxDateLimit}
                                placeholderText={t('form.dobPlaceholder') || 'DD/MM/YYYY'}
                                className="form-control"
                                required
                            />
                            <span className="input-group-text"><FaCalendarAlt /></span>
                        </div>
                    </div>
                </div>

                <h4 className="h5">{t('checkout.addressDetails')}</h4>

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

                    <button
                        type="submit"
                        className="btn-primary-custom"
                        disabled={isLoading || !termsAgreed}
                    >
                        {isLoading ? t('common.processing') : t('checkout.confirmAndPay')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContactDetailsForm;


