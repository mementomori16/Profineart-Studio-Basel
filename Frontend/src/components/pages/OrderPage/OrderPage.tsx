import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Product, SlotSelection, LessonPackage } from '../../../../../Backend/types/Product'; 
import { courses, PRODUCT_PACKAGES, CONSULTATION_PACKAGES } from '../../../../../Backend/data/products'; 
import productsData from '../../../locales/en/translation.json'; 

import DateAndTimeSelector from '../../../components/Order/DateandTimeSelector/DateAndTimeSelector'; 
import ContactDetails from '../../../components/Order/ContactDetails/ContactDetails'; 
import { FullCustomerDetails } from '../../../components/Order/ContactDetailsForm/ContactDetailsForm'; 

import './orderPage.scss'; 

const LS_SLOT_KEY = 'bookingSlotSelection';
const LS_DETAILS_KEY = 'bookingCustomerDetails';

const getInitialSlot = (): SlotSelection | null => {
    const stored = localStorage.getItem(LS_SLOT_KEY);
    return stored ? JSON.parse(stored) : null;
};

const getInitialDetails = (): FullCustomerDetails => {
    const stored = localStorage.getItem(LS_DETAILS_KEY);
    const defaultDetails: FullCustomerDetails = { 
        name: '', email: '', phone: '', message: '', dateOfBirth: '', 
        termsAgreed: false, streetAndNumber: '', apartmentAndFloor: '',
        index: '', city: '', country: '',
    };
    return stored ? { ...defaultDetails, ...JSON.parse(stored) } : defaultDetails;
};

const OrderPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate(); 

    const initialSlot = getInitialSlot();
    const [step, setStep] = useState(initialSlot ? 2 : 1); 
    const [error, setError] = useState<string | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [slotSelection, setSlotSelection] = useState<SlotSelection | null>(initialSlot);
    
    const [availablePackages, setAvailablePackages] = useState<LessonPackage[]>([]);

    const customerDetails = getInitialDetails(); 

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [step]);

    useEffect(() => {
        const productIdStr = id || '';
        const productIdNum = parseInt(productIdStr, 10);

        if (productIdNum === 900) {
            // Priority: Load Mentorship Packages
            setAvailablePackages(CONSULTATION_PACKAGES);
            setProduct({
                id: 900,
                title: "Online Mentorship",
                slug: "online-mentorship",
                category: "Mixed",
                briefDescription: "Professional Art Audit and Mentorship",
                image: { 
                    lowResUrl: "https://res.cloudinary.com/dvzing79y/image/upload/v1739016335/Mentoring_Product_Image_low_ayicf2.webp", 
                    highResUrl: "https://res.cloudinary.com/dvzing79y/image/upload/v1739016335/Mentoring_Product_Image_high_v6cl6t.webp" 
                },
                thumbnails: []
            } as Product);
        } else {
            setAvailablePackages(PRODUCT_PACKAGES);
            const selectedProduct = courses.find(c => c.id === productIdNum);

            if (!selectedProduct) {
                setError(t('error.productNotFound'));
                return;
            }

            const richData = (productsData.products as any)[productIdStr];
            const mergedProduct: Product = {
                ...selectedProduct,
                title: richData?.title || selectedProduct.title || "Course",
                briefDescription: richData?.briefDescription || selectedProduct.briefDescription
            };
            setProduct(mergedProduct);
        }
    }, [id, t]);

    const handleNextStep = (selection: SlotSelection) => {
        setSlotSelection(selection);
        localStorage.setItem(LS_SLOT_KEY, JSON.stringify(selection)); 
        setStep(2); 
    };

    const handleBackStep = () => setStep(1); 

    const handleNavigateBackToProduct = () => {
        if (product?.id === 900) {
            navigate('/online-mentorship');
        } else if (product?.slug) {
            navigate(`/course/${product.slug}`);
        } else {
            navigate('/courses');
        }
    };
    
    if (error && !product) return <div className="order-page-error">{error}</div>;
    if (!product || availablePackages.length === 0) return <div className="order-page-loading">{t('common.loading')}...</div>;
    
    const currentPackage = availablePackages.find(p => p.id === slotSelection?.packageId);

    return (
        <div className="order-page container">
            <div className="order-content-wrapper"> 
                <h1 className="text-center">{t('checkout.mainTitle')}</h1>
                <div className="step-indicator">
                    <span className={step === 1 ? 'active' : ''}>1. {t('checkout.step1Title')}</span>
                    <span className={step === 2 ? 'active' : ''}>2. {t('checkout.step2Title')}</span>
                </div>

                {step === 1 && (
                    <DateAndTimeSelector 
                        productId={product.id.toString()}
                        onNextStep={handleNextStep}
                        packages={availablePackages} 
                    />
                )}

                {step === 2 && slotSelection && (
                    <ContactDetails
                        product={product}
                        slotSelection={slotSelection}
                        initialDetails={customerDetails}
                        onBackStep={handleBackStep}
                        onTitleClick={handleNavigateBackToProduct} 
                        requiresAddress={currentPackage?.requiresAddress ?? true}
                    />
                )}
            </div> 
        </div>
    );
};

export default OrderPage;

/*
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// --- Types and Data Imports ---
import { Product, SlotSelection } from '../../../../../Backend/types/Product'; 
import { courses, PRODUCT_PACKAGES } from '../../../../../Backend/data/products'; 

// --- Component Imports ---
import DateAndTimeSelector from '../../../components/Order/DateandTimeSelector/DateAndTimeSelector'; 
import ContactDetails from '../../../components/Order/ContactDetails/ContactDetails'; 
import { FullCustomerDetails } from '../../../components/Order/ContactDetailsForm/ContactDetailsForm'; 

import './orderPage.scss'; 

// --- Local Storage Keys (No Change) ---
const LS_SLOT_KEY = 'bookingSlotSelection';
const LS_DETAILS_KEY = 'bookingCustomerDetails';

// --- Helper Functions for Local Storage ---
const getInitialSlot = (): SlotSelection | null => {
    const stored = localStorage.getItem(LS_SLOT_KEY);
    return stored ? JSON.parse(stored) : null;
};

const getInitialDetails = (): FullCustomerDetails => {
    const stored = localStorage.getItem(LS_DETAILS_KEY);
    // FIX: Added missing address properties to satisfy the FullCustomerDetails interface
    const defaultDetails: FullCustomerDetails = { 
        name: '', 
        email: '', 
        phone: '', 
        message: '', 
        dateOfBirth: '', 
        termsAgreed: false,
        
        // Missing Address fields added:
        streetAndNumber: '',
        apartmentAndFloor: '',
        index: '',
        city: '',
        country: '',
    };
    
    return stored ? { ...defaultDetails, ...JSON.parse(stored) } : defaultDetails;
};
// ----------------------------------------------------


const OrderPage: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>(); 
    const navigate = useNavigate(); 

    // --- State Initialization with Local Storage ---
    const initialSlot = getInitialSlot();
    
    const [step, setStep] = useState(initialSlot ? 2 : 1); 
    const [error, setError] = useState<string | null>(null);

    // State for Booking Data
    const [product, setProduct] = useState<Product | null>(null);
    const [slotSelection, setSlotSelection] = useState<SlotSelection | null>(initialSlot);
    
    // customerDetails is a constant, not a state variable
    const customerDetails = getInitialDetails(); 

    // Load Product Data on Mount (No change)
    useEffect(() => {
        const productId = parseInt(id || '', 10);
        const selectedProduct = courses.find(c => c.id === productId);

        if (!selectedProduct) {
            setError(t('error.productNotFound'));
            return;
        }
        setProduct(selectedProduct);
    }, [id, t, navigate]);

    // --- STEP NAVIGATION HANDLERS (No change) ---
    const handleNextStep = (selection: SlotSelection) => {
        setSlotSelection(selection);
        localStorage.setItem(LS_SLOT_KEY, JSON.stringify(selection)); 
        setStep(2); 
    };

    const handleBackStep = () => {
        setStep(1); 
    };
    
    // --- RENDER LOGIC ---
    if (error && !product) {
        return <div className="order-page-error">{error}</div>;
    }
    if (!product) {
        return <div className="order-page-loading">{t('common.loading')}...</div>;
    }
    
    return (
        <div className="order-page container">
            <div className="order-content-wrapper"> 
                <h1 className="text-center">{t('checkout.mainTitle')}</h1>
                
               
                <div className="step-indicator">
                    <span className={step === 1 ? 'active' : ''}>1. {t('checkout.step1Title')}</span>
                    <span className={step === 2 ? 'active' : ''}>2. {t('checkout.step2Title')}</span>
                </div>

                
                {typeof error === 'string' && error.length > 0 && 
                    <div className="alert alert-error">{error}</div>
                }

               
                {step === 1 && (
                    <DateAndTimeSelector 
                        productId={product.id.toString()}
                        onNextStep={handleNextStep}
                        packages={PRODUCT_PACKAGES} 
                    />
                )}

                {step === 2 && slotSelection && product && (
                    <ContactDetails
                        product={product}
                        slotSelection={slotSelection}
                        initialDetails={customerDetails}
                        onBackStep={handleBackStep}
                    />
                )}
            </div> 
        </div>
    );
};

export default OrderPage;
*/