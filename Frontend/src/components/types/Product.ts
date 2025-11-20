// src/types/Product.ts

export interface Testimonial {
    id: number;
    quote: string;
    clientName: string;
    clientTitle?: string;
    clientCompany?: string;
    clientImage: string;
}

// Interface for a single image, now storing both low-res and high-res URLs
export interface ProductImage {
    lowResUrl: string; // New: For quick loading previews
    highResUrl: string; // New: For full-screen zoom/expansion
}

export interface Product {
    id: number;
    title: string;
    date?: string;
    medium?: string;
    description: string | string[];
    
    // CHANGED: image is now a ProductImage object
    image: ProductImage; 
    
    // CHANGED: thumbnails is an array of ProductImage objects
    thumbnails: ProductImage[];
    
    likes?: number;
    views?: number;
    link?: string;
    githubLink?: string;
    gitlabLink?: string;
    tags?: string[];
    price?: number;
    icons?: string[]; // <-- KEPT THIS AS REQUESTED
    stripePriceId: string;
    technologies?: string[];
    techniques?: string[];
    testimonials?: Testimonial[];
}