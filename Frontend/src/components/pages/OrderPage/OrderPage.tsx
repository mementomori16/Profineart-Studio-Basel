import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Product, SlotSelection, LessonPackage } from '../../../../../functions/src/types/Product';
import { courses, PRODUCT_PACKAGES, CONSULTATION_PACKAGES } from '../../../../../functions/src/data/products';
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
    const location = useLocation();

    // Catch the package ID passed from OnlineMentorship.tsx
    const preferredPackageId = location.state?.preferredPackageId;

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

        // Reset logic if switching between Mentorship and standard courses
        if (slotSelection?.packageId) {
            const isOnline = productIdNum === 900;
            const savedIsOnline = slotSelection.packageId.startsWith('consult');
            if (isOnline !== savedIsOnline) {
                localStorage.removeItem(LS_SLOT_KEY);
                setSlotSelection(null);
                setStep(1);
            }
        }

        if (productIdNum === 900) {
            setAvailablePackages(CONSULTATION_PACKAGES);
            setProduct({
                id: 900,
                title: t('mentorship.title'),
                slug: "online-mentorship",
                category: "Mixed",
                // Passing the full mentorship description here so it shows in Step 2 summary
                briefDescription: t('mentorship.description'), 
                image: {
                    lowResUrl: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1776688345/002154-120kbadjusted_fsrfcw.jpg",
                    highResUrl: "https://res.cloudinary.com/dpayqcrg5/image/upload/v1776692095/002154-500kbadjusted_wlcx5m.jpg"
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
    }, [id, t, slotSelection?.packageId]);

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
                
                {/* TITLE LOGIC: 
                  We only show the "Checkout" H1 on Step 2. 
                  On Step 1, we rely on the titles inside DateAndTimeSelector to avoid repetition.
                */}
                {step === 2 && <h1 className="text-center">{t('checkout.mainTitle')}</h1>}
                
                <div className="step-indicator">
                    <span className={step === 1 ? 'active' : ''}>1. {t('checkout.step1Title')}</span>
                    <span className={step === 2 ? 'active' : ''}>2. {t('checkout.step2Title')}</span>
                </div>

                {step === 1 && (
                    <div className="selection-header">
                        <DateAndTimeSelector
                            productId={product.id.toString()}
                            onNextStep={handleNextStep}
                            packages={availablePackages}
                            // Prioritize the button clicked (state) over what was saved in LocalStorage
                            initialPackageId={preferredPackageId || slotSelection?.packageId}
                        />
                    </div>
                )}

                {step === 2 && slotSelection && (
                    <ContactDetails
                        product={product}
                        slotSelection={slotSelection}
                        initialDetails={customerDetails}
                        onBackStep={handleBackStep}
                        onTitleClick={handleNavigateBackToProduct}
                        requiresAddress={product.id === 900 ? false : (currentPackage?.requiresAddress ?? true)}
                    />
                )}
            </div>
        </div>
    );
};

export default OrderPage;

