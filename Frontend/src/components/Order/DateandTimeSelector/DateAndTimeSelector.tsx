import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTime } from 'luxon';
import { FaCalendarAlt, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { SlotSelection, LessonPackage, AvailableSlot } from '../../../../../Backend/types/Product';
import './dateAndTimeSelector.scss';

// ====================================================================
// CLIENT-SIDE HOLIDAY DATA for UI (Coloring and initial disabling)
// Note: The Backend (availabilityservice.ts) performs the definitive slot filtering.
// ====================================================================
const CLIENT_SWISS_HOLIDAYS: string[] = [
    // ------------------- 2025 -------------------
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-05-29', // Ascension Day
    '2025-06-09', // Whit Monday
    '2025-08-01', // Swiss National Day
    '2025-12-25', // Christmas Day 
    '2025-12-26', // St. Stephen's Day 

    // ------------------- 2026 -------------------
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labour Day
    '2026-05-14', // Ascension Day
    '2026-05-25', // Whit Monday
    '2026-08-01', // Swiss National Day
    '2026-12-25', // Christmas Day
    '2026-12-26', // St. Stephen's Day

    // ------------------- 2027 -------------------
    '2027-01-01', // New Year's Day
    '2027-03-26', // Good Friday
    '2027-03-29', // Easter Monday
    '2027-05-01', // Labour Day
    '2027-05-06', // Ascension Day
    '2027-05-17', // Whit Monday
    '2027-08-01', // Swiss National Day
    '2027-12-25', // Christmas Day
    '2027-12-26', // St. Stephen's Day
];

const isClientSwissHoliday = (dateString: string) => CLIENT_SWISS_HOLIDAYS.includes(dateString);

interface DateAndTimeSelectorProps {
    productId: string;
    onNextStep: (selection: SlotSelection) => void;
    // The packages array is now received via props from OrderPage
    packages: LessonPackage[];
}

const BACKEND_URL = '';

const DateAndTimeSelector: React.FC<DateAndTimeSelectorProps> = ({ productId, onNextStep, packages }) => {
    const { t } = useTranslation();

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

    // Initialize selectedPackage using the 'packages' prop (CRITICAL: Ensure packages[0] exists)
    const [selectedPackage, setSelectedPackage] = useState<LessonPackage>(packages.length > 0 ? packages[0] : {} as LessonPackage);

    // Address Validation State
    const [address, setAddress] = useState<string>('');
    const [isAddressValidating, setIsAddressValidating] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [addressValidated, setAddressValidated] = useState(false);

    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formattedDate = selectedDate ? DateTime.fromJSDate(selectedDate).toISODate() : '';

    // Guard against empty packages array
    if (packages.length === 0 || !selectedPackage.durationMinutes) {
        return <div className="date-time-selector-container error-state">
            <p className="error-message"><FaExclamationCircle /> {t('error.productNotFound') || 'No lesson packages available. Please configure product data.'}</p>
        </div>;
    }

    // --- Data Transformation for Column Display ---
    // Grouping the packages by Session Type
    const groupedPackages = packages.reduce((acc, pkg) => {
        const type = pkg.sessionType || 'Other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(pkg);
        return acc;
    }, {} as Record<string, LessonPackage[]>);

    // Explicitly define the column order
    const columnOrder = ['2 Sessions', '1.5 Sessions', '1 Session'];
    const packageColumns = columnOrder.map(key => ({
        title: key,
        packages: groupedPackages[key] || []
    })).filter(column => column.packages.length > 0);


    // --- FETCH AVAILABILITY ---
    const fetchAvailability = useCallback(async (dateString: string, durationInMins: number) => {
        setIsLoadingSlots(true);
        setError(null);
        setSelectedSlot(null);
        setAvailableSlots([]);

        try {
            // Include durationMinutes in the query string
            const response = await axios.get<{ success: boolean; slots: AvailableSlot[]; message?: string }>(
                `${BACKEND_URL}/api/schedule/slots?productId=${productId}&date=${dateString}&duration=${durationInMins}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch slots.");
            }

            const sortedSlots = response.data.slots.sort((a, b) => a.time.localeCompare(b.time));
            setAvailableSlots(sortedSlots);

        } catch (err) {
            console.error("Availability fetch error:", err);

            const axiosError = axios.isAxiosError(err) ? err : null;
            let errorMessage;
            if (axiosError?.response?.status === 400) {
                errorMessage = axiosError.response.data?.message || t('error.invalidRequest');
            } else {
                errorMessage = axiosError?.response?.data?.message || axiosError?.message || (err as Error).message || t('error.failedToFetchSchedule');
            }
            setError(t('error.failedToFetchSchedule') || `Failed to fetch schedule: ${errorMessage}`);
        } finally {
            setIsLoadingSlots(false);
        }
    }, [t, productId]);

    // Trigger slot fetch whenever date or package changes
    useEffect(() => {
        if (formattedDate && selectedPackage.durationMinutes) {
            // Check if the selected date is a holiday or Sunday (client-side check for UX)
            // The backend check is definitive, but this prevents unnecessary API calls
            const date = DateTime.fromISO(formattedDate, { zone: 'utc' });
            if (date.weekday === 7 || isClientSwissHoliday(formattedDate)) {
                setAvailableSlots([]);
                setError(t('checkout.noServiceOnSundayOrHoliday') || 'No lessons available on Sundays or official holidays.');
                return;
            }

            fetchAvailability(formattedDate, selectedPackage.durationMinutes);
        }
    }, [formattedDate, fetchAvailability, selectedPackage.durationMinutes, t]);


    // --- HANDLERS ---

    const handleNextStep = () => {
        if (!selectedSlot || !addressValidated || !formattedDate) {
            setError(t('error.completeAllSteps') || 'Please select a date, time slot, and validate your address.');
            return;
        }

        const selection: SlotSelection = {
            productId: productId,
            packageId: selectedPackage.id,
            lessons: selectedPackage.lessons,
            durationMinutes: selectedPackage.durationMinutes,
            price: selectedPackage.price,
            selectedDate: formattedDate,
            selectedTime: selectedSlot.time,
            address: address,
        };

        onNextStep(selection);
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
            const response = await axios.post(`${BACKEND_URL}/api/validate-address`, { address: address });

            if (response.data.success) {
                setAddressValidated(true);
                setAddressError(null);
            } else {
                setAddressError(response.data.message || (t('checkout.addressInvalid') || 'Address is outside the service area.'));
                setAddressValidated(false);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || (t('checkout.validationError') || 'An error occurred during address validation.');
            setAddressError(errorMessage);
            setAddressValidated(false);
        } finally {
            setIsAddressValidating(false);
        }
    };


    const getDayClassName = (date: Date) => {
        const dateISO = DateTime.fromJSDate(date).toISODate();
        if (date.getDay() === 0) { // Sunday
            return 'calendar-holiday-date';
        }
        if (dateISO && isClientSwissHoliday(dateISO)) {
            return 'calendar-holiday-date';
        }
        return '';
    };
    
    const filterAvailableDates = (date: Date) => {
        const dateISO = DateTime.fromJSDate(date).toISODate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = date < today;

        // Exclude Sundays (day 0) and Holidays from selection
        if (date.getDay() === 0 || (dateISO && isClientSwissHoliday(dateISO))) {
            return false;
        }

        return !isPast;
    };

    // Group slots by hour for cleaner display
    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const hourKey = slot.time.substring(0, 2);
        if (!acc[hourKey]) {
            acc[hourKey] = [];
        }
        acc[hourKey].push(slot);
        return acc;
    }, {} as Record<string, AvailableSlot[]>);


    return (
        <div className="date-time-selector-container">
            <div className="section-group package-select-group">
                <h3><FaShoppingCart /> {t('checkout.selectPackageTitle')}</h3>
                <p className="package-instruction-text">
                    {t('checkout.packageInstruction')}
                </p>

                <div className="package-options-columns">
                    {packageColumns.map(column => (
                        <div key={column.title} className="package-column">
                            <h4 className="column-title">{column.title}</h4>
                            <div className="package-options">
                                {column.packages.map((pkg) => (
                                    <label key={pkg.id} className={`package-option ${selectedPackage.id === pkg.id ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="lessonPackage"
                                            value={pkg.id}
                                            checked={selectedPackage.id === pkg.id}
                                            onChange={() => {
                                                setSelectedPackage(pkg);
                                                setSelectedSlot(null); // Reset slot selection when package changes
                                            }}
                                        />
                                        <div className="package-info-wrapper">
                                            <span className="package-name-lessons">{pkg.name} ({pkg.lessons} {t('common.lessons')})</span>
                                            <span className="package-duration">{pkg.durationMinutes} {t('common.minutes')} / {t('common.lesson')}</span>
                                            <strong className="package-price">
                                                {pkg.price} {t('common.currency')}
                                            </strong>
                                            {pkg.isFeatured && <span className="featured-label">{t('common.bestValue')}</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. DATE AND TIME SELECTOR */}
            <div className="section-group date-time-group">
                <h3><FaCalendarAlt /> {t('checkout.pickDateAndTimeTitle')}</h3>
                <div className="date-time-controls">
                    <div className="date-picker-wrapper">
                        <label>{t('form.date')}</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            dateFormat="dd MMMM yyyy"
                            minDate={new Date()}
                            filterDate={filterAvailableDates}
                            placeholderText={t('checkout.selectDatePlaceholder')}
                            className="date-input"
                            isClearable={true}
                            calendarClassName="custom-calendar"
                            dayClassName={getDayClassName}
                        />
                    </div>

                    <div className="time-slot-wrapper">
                        <label>{t('form.timeSlots')}</label>
                        {isLoadingSlots ? (
                            <p className="loading-message">
                                {t('checkout.loadingSlotsMessage', { lessons: selectedPackage.lessons, duration: selectedPackage.durationMinutes })}
                            </p>
                        ) : availableSlots.length > 0 ? (
                            <div className="time-slots-grid">
                                {Object.entries(groupedSlots)
                                    .sort(([hourA], [hourB]) => hourA.localeCompare(hourB))
                                    .map(([hour, slots]) => (
                                        <div key={hour} className="time-slot-group">
                                            <h4>{hour}:00</h4>
                                            <div className="time-slots-row">
                                                {slots.map(slot => (
                                                    <button
                                                        key={slot.time}
                                                        type="button"
                                                        className={`time-slot-button ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        disabled={!slot.isAvailable}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            // Display a specific message if a holiday/Sunday was selected but filtered out.
                            <p className="no-slots-message">{error || t('checkout.noAvailableSlots')}</p>
                        )}
                        {error && <p className="error-message"><FaExclamationCircle /> {error}</p>}
                    </div>
                </div>
            </div>

            {/* 3. ADDRESS INPUT AND VALIDATION */}
            <div className="section-group address-group">
                <h3><FaMapMarkerAlt /> {t('checkout.enterAddressTitle') || '3. Enter your address'}</h3>
                
                <p className="address-instruction-text">
                    {t('checkout.addressInstruction') || "The teacher can drive to your address if it is within a **25 km radius** of Basel. This includes parts of Basel, Basel-Land, northern Aargau, and the border towns of Germany (Lörrach, Weil am Rhein, Grenzach-Wyhlen) and France (Saint-Louis, Hésingue, and others). Please check your address below."}
                </p>

                <div className="address-controls">
                    <input
                        type="text"
                        placeholder={t('checkout.addressPlaceholder')}
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressValidated(false);
                            setAddressError(null);
                        }}
                        className="address-input"
                    />
                    <button
                        className="btn-validate"
                        onClick={handleAddressValidation}
                        disabled={!address.trim() || isAddressValidating}
                    >
                        {isAddressValidating ? t('checkout.addressValidating') : t('checkout.addressCheckButton')}
                    </button>
                </div>

                {addressValidated && (
                    <p className="validation-message success">
                        <FaCheckCircle /> {t('checkout.addressValidSuccess')}
                    </p>
                )}
                {addressError && (
                    <p className="validation-message error">
                        <FaExclamationCircle /> {addressError}
                    </p>
                )}
            </div>

            {/* NEXT STEP BUTTON */}
            <div className="form-actions next-step-button">
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={!selectedSlot || isLoadingSlots || !addressValidated}
                >
                    {t('checkout.continueToDetails')}
                </button>
            </div>
        </div>
    );
};

export default DateAndTimeSelector;

/*
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DateTime } from 'luxon';
import { FaCalendarAlt, FaShoppingCart, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { SlotSelection, LessonPackage, AvailableSlot } from '../../../../../Backend/types/Product';
import './dateAndTimeSelector.scss';

// ====================================================================
// CLIENT-SIDE HOLIDAY DATA for UI (Coloring and initial disabling)
// Note: The Backend (availabilityservice.ts) performs the definitive slot filtering.
// ====================================================================
const CLIENT_SWISS_HOLIDAYS: string[] = [
    // ------------------- 2025 -------------------
    '2025-01-01', // New Year's Day
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-05-29', // Ascension Day
    '2025-06-09', // Whit Monday
    '2025-08-01', // Swiss National Day
    '2025-12-25', // Christmas Day 
    '2025-12-26', // St. Stephen's Day 

    // ------------------- 2026 -------------------
    '2026-01-01', // New Year's Day
    '2026-04-03', // Good Friday
    '2026-04-06', // Easter Monday
    '2026-05-01', // Labour Day
    '2026-05-14', // Ascension Day
    '2026-05-25', // Whit Monday
    '2026-08-01', // Swiss National Day
    '2026-12-25', // Christmas Day
    '2026-12-26', // St. Stephen's Day

    // ------------------- 2027 -------------------
    '2027-01-01', // New Year's Day
    '2027-03-26', // Good Friday
    '2027-03-29', // Easter Monday
    '2027-05-01', // Labour Day
    '2027-05-06', // Ascension Day
    '2027-05-17', // Whit Monday
    '2027-08-01', // Swiss National Day
    '2027-12-25', // Christmas Day
    '2027-12-26', // St. Stephen's Day
];

const isClientSwissHoliday = (dateString: string) => CLIENT_SWISS_HOLIDAYS.includes(dateString);

interface DateAndTimeSelectorProps {
    productId: string;
    onNextStep: (selection: SlotSelection) => void;
    // The packages array is now received via props from OrderPage
    packages: LessonPackage[];
}

const BACKEND_URL = '';

const DateAndTimeSelector: React.FC<DateAndTimeSelectorProps> = ({ productId, onNextStep, packages }) => {
    const { t } = useTranslation();

    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

    // Initialize selectedPackage using the 'packages' prop (CRITICAL: Ensure packages[0] exists)
    const [selectedPackage, setSelectedPackage] = useState<LessonPackage>(packages.length > 0 ? packages[0] : {} as LessonPackage);

    // Address Validation State
    const [address, setAddress] = useState<string>('');
    const [isAddressValidating, setIsAddressValidating] = useState(false);
    const [addressError, setAddressError] = useState<string | null>(null);
    const [addressValidated, setAddressValidated] = useState(false);

    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const formattedDate = selectedDate ? DateTime.fromJSDate(selectedDate).toISODate() : '';

    // Guard against empty packages array
    if (packages.length === 0 || !selectedPackage.durationMinutes) {
        return <div className="date-time-selector-container error-state">
            <p className="error-message"><FaExclamationCircle /> {t('error.productNotFound') || 'No lesson packages available. Please configure product data.'}</p>
        </div>;
    }

    // --- Data Transformation for Column Display ---
    // Grouping the packages by Session Type
    const groupedPackages = packages.reduce((acc, pkg) => {
        const type = pkg.sessionType || 'Other';
        if (!acc[type]) {
            acc[type] = [];
        }
        acc[type].push(pkg);
        return acc;
    }, {} as Record<string, LessonPackage[]>);

    // Explicitly define the column order
    const columnOrder = ['2 Sessions', '1.5 Sessions', '1 Session'];
    const packageColumns = columnOrder.map(key => ({
        title: key,
        packages: groupedPackages[key] || []
    })).filter(column => column.packages.length > 0);


    // --- FETCH AVAILABILITY ---
    const fetchAvailability = useCallback(async (dateString: string, durationInMins: number) => {
        setIsLoadingSlots(true);
        setError(null);
        setSelectedSlot(null);
        setAvailableSlots([]);

        try {
            // Include durationMinutes in the query string
            const response = await axios.get<{ success: boolean; slots: AvailableSlot[]; message?: string }>(
                `${BACKEND_URL}/api/schedule/slots?productId=${productId}&date=${dateString}&duration=${durationInMins}`
            );

            if (!response.data.success) {
                throw new Error(response.data.message || "Failed to fetch slots.");
            }

            const sortedSlots = response.data.slots.sort((a, b) => a.time.localeCompare(b.time));
            setAvailableSlots(sortedSlots);

        } catch (err) {
            console.error("Availability fetch error:", err);

            const axiosError = axios.isAxiosError(err) ? err : null;
            let errorMessage;
            if (axiosError?.response?.status === 400) {
                errorMessage = axiosError.response.data?.message || t('error.invalidRequest');
            } else {
                errorMessage = axiosError?.response?.data?.message || axiosError?.message || (err as Error).message || t('error.failedToFetchSchedule');
            }
            setError(t('error.failedToFetchSchedule') || `Failed to fetch schedule: ${errorMessage}`);
        } finally {
            setIsLoadingSlots(false);
        }
    }, [t, productId]);

    // Trigger slot fetch whenever date or package changes
    useEffect(() => {
        if (formattedDate && selectedPackage.durationMinutes) {
            // Check if the selected date is a holiday or Sunday (client-side check for UX)
            // The backend check is definitive, but this prevents unnecessary API calls
            const date = DateTime.fromISO(formattedDate, { zone: 'utc' });
            if (date.weekday === 7 || isClientSwissHoliday(formattedDate)) {
                setAvailableSlots([]);
                setError(t('checkout.noServiceOnSundayOrHoliday') || 'No lessons available on Sundays or official holidays.');
                return;
            }

            fetchAvailability(formattedDate, selectedPackage.durationMinutes);
        }
    }, [formattedDate, fetchAvailability, selectedPackage.durationMinutes, t]);


    // --- HANDLERS ---

    const handleNextStep = () => {
        if (!selectedSlot || !addressValidated || !formattedDate) {
            setError(t('error.completeAllSteps') || 'Please select a date, time slot, and validate your address.');
            return;
        }

        const selection: SlotSelection = {
            productId: productId,
            packageId: selectedPackage.id,
            lessons: selectedPackage.lessons,
            durationMinutes: selectedPackage.durationMinutes,
            price: selectedPackage.price,
            selectedDate: formattedDate,
            selectedTime: selectedSlot.time,
            address: address,
        };

        onNextStep(selection);
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
            const response = await axios.post(`${BACKEND_URL}/api/validate-address`, { address: address });

            if (response.data.success) {
                setAddressValidated(true);
                setAddressError(null);
            } else {
                setAddressError(response.data.message || (t('checkout.addressInvalid') || 'Address is outside the service area.'));
                setAddressValidated(false);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || (t('checkout.validationError') || 'An error occurred during address validation.');
            setAddressError(errorMessage);
            setAddressValidated(false);
        } finally {
            setIsAddressValidating(false);
        }
    };


    const getDayClassName = (date: Date) => {
        const dateISO = DateTime.fromJSDate(date).toISODate();
        if (date.getDay() === 0) { // Sunday
            return 'calendar-holiday-date';
        }
        if (dateISO && isClientSwissHoliday(dateISO)) {
            return 'calendar-holiday-date';
        }
        return '';
    };
    
    const filterAvailableDates = (date: Date) => {
        const dateISO = DateTime.fromJSDate(date).toISODate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isPast = date < today;

        // Exclude Sundays (day 0) and Holidays from selection
        if (date.getDay() === 0 || (dateISO && isClientSwissHoliday(dateISO))) {
            return false;
        }

        return !isPast;
    };

    // Group slots by hour for cleaner display
    const groupedSlots = availableSlots.reduce((acc, slot) => {
        const hourKey = slot.time.substring(0, 2);
        if (!acc[hourKey]) {
            acc[hourKey] = [];
        }
        acc[hourKey].push(slot);
        return acc;
    }, {} as Record<string, AvailableSlot[]>);


    return (
        <div className="date-time-selector-container">
            <div className="section-group package-select-group">
                <h3><FaShoppingCart /> {t('checkout.selectPackageTitle')}</h3>
                <p className="package-instruction-text">
                    {t('checkout.packageInstruction')}
                </p>

                <div className="package-options-columns">
                    {packageColumns.map(column => (
                        <div key={column.title} className="package-column">
                            <h4 className="column-title">{column.title}</h4>
                            <div className="package-options">
                                {column.packages.map((pkg) => (
                                    <label key={pkg.id} className={`package-option ${selectedPackage.id === pkg.id ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="lessonPackage"
                                            value={pkg.id}
                                            checked={selectedPackage.id === pkg.id}
                                            onChange={() => {
                                                setSelectedPackage(pkg);
                                                setSelectedSlot(null); // Reset slot selection when package changes
                                            }}
                                        />
                                        <div className="package-info-wrapper">
                                            <span className="package-name-lessons">{pkg.name} ({pkg.lessons} {t('common.lessons')})</span>
                                            <span className="package-duration">{pkg.durationMinutes} {t('common.minutes')} / {t('common.lesson')}</span>
                                            <strong className="package-price">
                                                {pkg.price} {t('common.currency')}
                                            </strong>
                                            {pkg.isFeatured && <span className="featured-label">{t('common.bestValue')}</span>}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          
            <div className="section-group date-time-group">
                <h3><FaCalendarAlt /> {t('checkout.pickDateAndTimeTitle')}</h3>
                <div className="date-time-controls">
                    <div className="date-picker-wrapper">
                        <label>{t('form.date')}</label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) => setSelectedDate(date)}
                            dateFormat="dd MMMM yyyy"
                            minDate={new Date()}
                            filterDate={filterAvailableDates}
                            placeholderText={t('checkout.selectDatePlaceholder')}
                            className="date-input"
                            isClearable={true}
                            calendarClassName="custom-calendar"
                            dayClassName={getDayClassName}
                        />
                    </div>

                    <div className="time-slot-wrapper">
                        <label>{t('form.timeSlots')}</label>
                        {isLoadingSlots ? (
                            <p className="loading-message">
                                {t('checkout.loadingSlotsMessage', { lessons: selectedPackage.lessons, duration: selectedPackage.durationMinutes })}
                            </p>
                        ) : availableSlots.length > 0 ? (
                            <div className="time-slots-grid">
                                {Object.entries(groupedSlots)
                                    .sort(([hourA], [hourB]) => hourA.localeCompare(hourB))
                                    .map(([hour, slots]) => (
                                        <div key={hour} className="time-slot-group">
                                            <h4>{hour}:00</h4>
                                            <div className="time-slots-row">
                                                {slots.map(slot => (
                                                    <button
                                                        key={slot.time}
                                                        type="button"
                                                        className={`time-slot-button ${selectedSlot?.time === slot.time ? 'selected' : ''}`}
                                                        onClick={() => setSelectedSlot(slot)}
                                                        disabled={!slot.isAvailable}
                                                    >
                                                        {slot.time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            // Display a specific message if a holiday/Sunday was selected but filtered out.
                            <p className="no-slots-message">{error || t('checkout.noAvailableSlots')}</p>
                        )}
                        {error && <p className="error-message"><FaExclamationCircle /> {error}</p>}
                    </div>
                </div>
            </div>

           
            <div className="section-group address-group">
                <h3><FaMapMarkerAlt /> {t('checkout.enterAddressTitle') || '3. Enter your address'}</h3>
                
                <p className="address-instruction-text">
                    {t('checkout.addressInstruction') || "The teacher can drive to your address if it is within a **25 km radius** of Basel. This includes parts of Basel, Basel-Land, northern Aargau, and the border towns of Germany (Lörrach, Weil am Rhein, Grenzach-Wyhlen) and France (Saint-Louis, Hésingue, and others). Please check your address below."}
                </p>

                <div className="address-controls">
                    <input
                        type="text"
                        placeholder={t('checkout.addressPlaceholder')}
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            setAddressValidated(false);
                            setAddressError(null);
                        }}
                        className="address-input"
                    />
                    <button
                        className="btn-validate"
                        onClick={handleAddressValidation}
                        disabled={!address.trim() || isAddressValidating}
                    >
                        {isAddressValidating ? t('checkout.addressValidating') : t('checkout.addressCheckButton')}
                    </button>
                </div>

                {addressValidated && (
                    <p className="validation-message success">
                        <FaCheckCircle /> {t('checkout.addressValidSuccess')}
                    </p>
                )}
                {addressError && (
                    <p className="validation-message error">
                        <FaExclamationCircle /> {addressError}
                    </p>
                )}
            </div>

            
            <div className="form-actions next-step-button">
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNextStep}
                    disabled={!selectedSlot || isLoadingSlots || !addressValidated}
                >
                    {t('checkout.continueToDetails')}
                </button>
            </div>
        </div>
    );
};

export default DateAndTimeSelector;
*/