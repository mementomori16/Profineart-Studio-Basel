// src/components/common/DateSelector/DateSelector.tsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
import { Product } from '../types/Product';
import { FaCalendarAlt, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'; // Added icons
import { loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import './dateSelector.scss'; 

interface DateSelectorProps {
    product: Product;
}

// Define the Lesson Packages Structure
interface LessonPackage {
    id: number;
    lessons: number;
    priceCHF: number; // Price in CHF
    label: string;
}

const LESSON_PACKAGES: LessonPackage[] = [
    { id: 1, lessons: 1, priceCHF: 80, label: '1 Lesson - 80 CHF' },
    { id: 5, lessons: 5, priceCHF: 390, label: '5 Lessons - 390 CHF' },
    { id: 10, lessons: 10, priceCHF: 780, label: '10 Lessons - 780 CHF' },
];

const stripePromise = loadStripe('pk_test_51...YOUR_PUBLISHABLE_KEY...Ym'); 

const BACKEND_URL = 'http://localhost:3001'; 

const DateSelector: React.FC<DateSelectorProps> = ({ product }) => {
    const { t } = useTranslation();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedPackage, setSelectedPackage] = useState<LessonPackage>(LESSON_PACKAGES[0]); // Default to the 1st package
    const [address, setAddress] = useState<string>('');
    
    // State for address validation feedback
    const [isAddressValidating, setIsAddressValidating] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [addressValidated, setAddressValidated] = useState(false);
    
    const [isProcessing, setIsProcessing] = useState(false);
    
    // NOTE: For now, we only use the dates from the component's internal array
    const availableDates: Date[] = [ 
        new Date(2025, 11, 1),
        new Date(2025, 11, 3),
        new Date(2025, 11, 5),
    ];
    
    const filterAvailableDates = (date: Date) => {
        // Simple filter logic: check if date is in the availableDates array (day/month/year match)
        return availableDates.some(
            (availableDate) => 
                availableDate.getDate() === date.getDate() &&
                availableDate.getMonth() === date.getMonth() &&
                availableDate.getFullYear() === date.getFullYear()
        );
    };

    const handleAddressValidation = async () => {
        if (!address.trim()) {
            setAddressError(t('checkout.addressRequired') || 'Please enter your address.');
            setAddressValidated(false);
            return;
        }

        setIsAddressValidating(true);
        setAddressError(null);
        setAddressValidated(false);

        try {
            // CALL NEW BACKEND VALIDATION ENDPOINT
            const response = await fetch(`${BACKEND_URL}/api/validate-address`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: address }),
            });

            const result = await response.json();

            if (response.ok) {
                setAddressValidated(true);
                setAddressError(null);
                alert(t('checkout.addressValid') || 'Address is within the service area!');
            } else {
                // Address is too far or invalid
                setAddressError(result.message || (t('checkout.addressInvalid') || 'Address is outside the 27km service area of Basel.'));
                setAddressValidated(false);
            }
        } catch (error) {
            console.error('Validation Error:', error);
            setAddressError(t('checkout.validationError') || 'An error occurred during address validation.');
            setAddressValidated(false);
        } finally {
            setIsAddressValidating(false);
        }
    };


    const handleCheckout = async () => {
        if (!selectedDate || !selectedPackage) {
            alert(t('checkout.selectOptionsError') || 'Please select a date and lesson package.');
            return;
        }
        
        if (!addressValidated) {
            alert(t('checkout.validateAddressError') || 'Please validate your address before proceeding.');
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Call your Node.js backend to create the Stripe Checkout Session
            const response = await fetch(`${BACKEND_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Pass the ID of the product and the selected package
                    courseId: product.id,
                    packageId: selectedPackage.id, // NEW: Send the selected package ID
                    selectedDate: selectedDate.toISOString().split('T')[0], 
                    address: address, // NEW: Send the validated address
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session on the server.');
            }

            const session = await response.json();
            
            // 2. Redirect the user to Stripe Checkout
            const stripe = await stripePromise;
            if (stripe) {
                const result = await stripe.redirectToCheckout({
                    sessionId: session.id,
                });
                
                if (result.error) {
                    alert(result.error.message);
                }
            }

        } catch (error) {
            console.error('Checkout Error:', error);
            alert(t('checkout.generalError') || 'An error occurred during checkout. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="date-selector-container">
            {/* 1. DATE PICKER */}
            <div className="input-group">
                <h4><FaCalendarAlt /> {t('checkout.pickDateTitle') || '1. Pick Your Course Date'}</h4>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="dd MMMM yyyy"
                    minDate={new Date()}
                    filterDate={filterAvailableDates}
                    placeholderText={t('checkout.selectDatePlaceholder') || 'Select a date from the calendar'}
                    className="date-input"
                    isClearable={true}
                />
            </div>
            
            {/* 2. PACKAGE SELECTOR */}
            <div className="input-group">
                <h4><FaShoppingCart /> {t('checkout.selectPackageTitle') || '2. Choose Lesson Package'}</h4>
                <div className="package-options">
                    {LESSON_PACKAGES.map((pkg) => (
                        <label key={pkg.id} className="package-option">
                            <input
                                type="radio"
                                name="lessonPackage"
                                value={pkg.id}
                                checked={selectedPackage.id === pkg.id}
                                onChange={() => setSelectedPackage(pkg)}
                            />
                            {pkg.label}
                        </label>
                    ))}
                </div>
            </div>

            {/* 3. ADDRESS INPUT AND VALIDATION */}
            <div className="input-group address-group">
                <h4><FaMapMarkerAlt /> {t('checkout.enterAddressTitle') || '3. Enter Service Address'}</h4>
                <div className="address-controls">
                    <input
                        type="text"
                        placeholder={t('checkout.addressPlaceholder') || 'Enter Address (Basel or Baselland area)'}
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressValidated(false); // Reset validation on change
                            setAddressError(null);
                        }}
                        className="address-input"
                    />
                    <button
                        className="btn-validate"
                        onClick={handleAddressValidation}
                        disabled={!address.trim() || isAddressValidating}
                    >
                        {isAddressValidating ? 'Checking...' : 'Check Address'}
                    </button>
                </div>

                {addressValidated && (
                    <p className="validation-message success">
                        <FaCheckCircle /> {t('checkout.addressValidSuccess') || 'Service available at this location!'}
                    </p>
                )}
                {addressError && (
                    <p className="validation-message error">
                        <FaExclamationCircle /> {addressError}
                    </p>
                )}
            </div>

            {/* 4. CHECKOUT BUTTON */}
            <button
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={!selectedDate || isProcessing || !addressValidated}
            >
                {isProcessing ? (
                    t('checkout.processing') || 'Processing...'
                ) : (
                    <>
                        <FaShoppingCart style={{ marginRight: '0.5rem' }} />
                        {t('checkout.payNow') || 'Pay Now'} {selectedPackage.priceCHF.toFixed(2)} CHF
                    </>
                )}
            </button>
            
            <p className="text-center" style={{marginTop: '0.5rem', color: '#888'}}>
                {t('checkout.feeNote') || 'Final price is based on the selected package and location.'}
            </p>
        </div>
    );
};

export default DateSelector;