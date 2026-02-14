// src/types/Product.ts - FINALIZED TYPE DEFINITIONS

// --- Lesson Package Types (Source of Truth for Package Structure) ---

export interface LessonPackage {
    id: string;
    name: string;
    description: string;
    lessons: number;
    durationMinutes: number; // Duration of one session in minutes (CONSISTENT)
    price: number; // CHF price for the entire package
    label: string; // Display label (e.g., "5 Sessions x 90 min - 390 CHF")
    isFeatured?: boolean;
    sessionType?: string;
}

// --- Booking/Slot Selection Types (Frontend State) ---

export interface SlotSelection {
    productId: string;
    selectedDate: string;
    selectedTime: string;
    packageId: string;
    lessons: number;
    durationMinutes: number; 
    price: number;
    address: string;
}

// Interface for the slot data returned by the backend (Source of Truth for Slot Structure)
export interface AvailableSlot {
    time: string; 
    packageId: string; 
    durationMinutes: number; 
    price: number; 
    isAvailable: boolean; // Whether this specific time slot is available (CONSISTENT)
}

// --- Customer Details (Moved from OrderPage to consolidate types) ---

export interface CustomerDetails {
    name: string;
    email: string;
    phone: string;
    message: string;
}

// --- Product/Course Types ---

export interface Testimonial {
    id: number;
    quote: string;
    clientName: string;
    clientTitle?: string;
    clientCompany?: string;
    clientImage: string;
}

export interface ProductImage {
    lowResUrl: string;
    highResUrl: string;
    altText?: string; 
    caption?: string;
    thumbnails?: ProductImage[];
}

export interface Product {
    briefDescription: any;
    title: string | undefined;
    id: number;
    slug: string;
    category: 'Drawing' | 'Painting' | 'Mixed';
    date?: string;
    medium?: string;
    image: ProductImage;
    thumbnails: ProductImage[];
    detailsImages?: ProductImage[];
    likes?: number;
    views?: number;
    link?: string;
    badge?: string;
}