// src/data/products.ts
import { LessonPackage, Product, Testimonial, ProductImage } from '../types/Product.js';

// --- Courses ---

export const courses: Product[] = [
  {
    id: 800,
    title: 'Byzantine Icon Painting Individual Sessions',
    description:
      `This highly professional program offers exclusive, focused instruction with Ilya Medvedev. The curriculum is tailored to fit all skill levels, from beginners wishing to learn the fundamentals to highly advanced professional painters seeking specialized historical techniques.
      
      <h5>Key Techniques & Focus Areas</h5>
      <ul>
        <li><strong>Technical Mastery:</strong> Learn the professional secrets of Egg Tempera Glazing, Old Master techniques, and achieving luminous color.</li>
        <li><strong>24-Carat Gold Leaf:</strong> Comprehensive training in applying and drawing with gold leaf (Gilding Mastery).</li>
        <li><strong>Historical Schools:</strong> In-depth study of the Cretan, Macedonian, Russian, and Coptic traditions.</li>
        <li><strong>Advanced Form:</strong> Mastering volume, drapery, and the spiritual representation of icon faces (Liki) using "medieval cubism" principles.</li>
      </ul>`,
      briefDescription: 'Individual instruction focusing on Egg Tempera, Gilding, and Byzantine historical schools.',
    image: {
      lowResUrl: 'https://i.ibb.co/DBrD41T/100kbphotoshoped-more-bright-1.jpg',
      highResUrl: 'https://i.ibb.co/kg0RQm5/best.jpg',
    },
    // CORRECTED STRUCTURE
    thumbnails: [
      {
        lowResUrl: "https://i.ibb.co/gZh2SgPV/100kbcloseup.jpg",
        highResUrl: 'https://i.ibb.co/y5g7SZC/IMG-4570.jpg',
      },  
    ],
 detailsTitle: 'In-Depth Course Curriculum', // Can be used by the component
    detailsImages: [
      {
        lowResUrl: 'https://i.ibb.co/WWx2fhv/newphotoshoped-darker-2025-more-bright.jpg', // Replace with your detail image 1
        highResUrl: 'https://i.ibb.co/WWx2fhv/newphotoshoped-darker-2025-more-bright.jpg',
        caption: 'A view of the initial wood panel preparation process.',
      },
      {
        lowResUrl: 'https://i.ibb.co/j9hMh9wN/smaller-smaller-2-2025.png', // Replace with your detail image 2
        highResUrl: 'https://i.ibb.co/j9hMh9wN/smaller-smaller-2-2025.png',
        caption: 'Applying the gold leaf during the gilding module.',
      },
    
    ],
    tags: ['Iconography', 'Egg Tempera', 'Classical', 'Individual'],
    techniques: [
      'Egg Tempera',
      '24-Carat Gold Leaf',
      'Gilding',
      'Glazing (Lapis Lazuli)',
      'Underpainting',
      'Maulstick',
      'Iconographic Drawing',
      'Cretan School',
      'Macedonian School',
      'Proto-Byzantine',
      'Fayum Portraiture',
      'Historical Pigments',
      'Varnishing',
      'Panel Preparation',
      'Fine Brushwork'
    ],
    price: 150.00,
    stripePriceId: 'price_1P6d5T...your_stripe_price_id...xZ',
    medium: 'Course',
  },
   {
    id: 801,
    title: 'Oil Painting Individual Sessions',
    description:
      `This highly professional program offers exclusive, focused instruction with Ilya Medvedev. The curriculum is tailored to fit all skill levels, from beginners wishing to learn the fundamentals to highly advanced professional painters seeking specialized historical techniques.
      
      <h5>Key Techniques & Focus Areas</h5>
      <ul>
        <li><strong>Technical Mastery:</strong> Learn the professional secrets of Egg Tempera Glazing, Old Master techniques, and achieving luminous color.</li>
        <li><strong>24-Carat Gold Leaf:</strong> Comprehensive training in applying and drawing with gold leaf (Gilding Mastery).</li>
        <li><strong>Historical Schools:</strong> In-depth study of the Cretan, Macedonian, Russian, and Coptic traditions.</li>
        <li><strong>Advanced Form:</strong> Mastering volume, drapery, and the spiritual representation of icon faces (Liki) using "medieval cubism" principles.</li>
      </ul>`,
      briefDescription: 'Individual instruction focusing on Egg Tempera, Gilding, and Byzantine historical schools.',
    // CORRECTED STRUCTURE
  
    image: {
      lowResUrl: 'https://i.ibb.co/4ds7LRB/Detail1-photoshoped-2025-small.jpg',
      highResUrl: 'https://i.ibb.co/4ds7LRB/Detail1-photoshoped-2025-small.jpg',
    },
    // CORRECTED STRUCTURE
    thumbnails: [
      {
        lowResUrl: "https://i.ibb.co/gZh2SgPV/100kbcloseup.jpg",
        highResUrl: 'https://i.ibb.co/y5g7SZC/IMG-4570.jpg',
      },
    ],
    tags: ['Iconography', 'Egg Tempera', 'Classical', 'Individual'],
    techniques: [
      'Egg Tempera',
      '24-Carat Gold Leaf',
      'Gilding',
      'Glazing (Lapis Lazuli)',
      'Underpainting',
      'Maulstick',
      'Iconographic Drawing',
      'Cretan School',
      'Macedonian School',
      'Proto-Byzantine',
      'Fayum Portraiture',
      'Historical Pigments',
      'Varnishing',
      'Panel Preparation',
      'Fine Brushwork'
    ],
    price: 150.00,
    stripePriceId: 'price_1P6d5T...your_stripe_price_id...xZ',
    medium: 'Course',
  }
];

// --- Lesson Packages ---

export const PRODUCT_PACKAGES: LessonPackage[] = [
  // COLUMN 1: 2 Sessions (Using '2 Sessions' in label)
  {
    id: 'double_90',
    name: '1 x 2 Sessions',
    description: '1 x 2 sessions of 90 minutes.',
    lessons: 2, // Corrected to 2 sessions
    durationMinutes: 90,
    price: 100, // Price from label
    label: '1 x 2 Sessions (2x45 min) - 90 minutes - 100 CHF',
    sessionType: '2 Sessions' // Custom property for grouping
  },
  {
    id: 'five_90',
    name: '5 x 2 Sessions',
    description: '5 x 2 sessions of 90 minutes.',
    lessons: 10, // 5 * 2 = 10 sessions total
    durationMinutes: 90,
    price: 485, // Price from label
    label: '5 x 2 Sessions (10x45 min) - 485 CHF',
    sessionType: '2 Sessions' 
  },
  {
    id: 'Ten_90',
    name: '10 x 2 Sessions',
    description: '10 x 2 sessions of 90 minutes.',
    lessons: 20, // 10 * 2 = 20 sessions total
    durationMinutes: 90,
    price: 950, // Price from label
    label: '10 x 2 Sessions (20x45 min) - 950 CHF',
    isFeatured: true,
    sessionType: '2 Sessions' 
  },

  // COLUMN 2: 1.5 Sessions (Using '1.5 Session' in label, 70 minutes duration)
  {
    id: 'single_90',
    name: '1 x 1.5 Session',
    description: '1.5 session of 70 minutes.',
    lessons: 1.5,
    durationMinutes: 70, // Assuming 70 minutes for 1.5 session
    price: 80,
    label: '1.5 Session (70 min) - 80 CHF',
    sessionType: '1.5 Sessions',
  },
  {
    id: 'bundle_5x90',
    name: '5 x 1.5 Sessions',
    description: 'Five sessions, 70 minutes each.',
    lessons: 7.5,
    durationMinutes: 70, // Assuming 70 minutes for 1.5 session
    price: 390,
    label: '5 x 1.5 Sessions (5x70 min) - 390 CHF',
    sessionType: '1.5 Sessions',
  },
  {
    id: 'bundle_10x90',
    name: '10 x 1.5 Sessions ',
    description: '10 x 1.5 Sessions (10x70 min) - 770 CHF.',
    lessons: 15,
    durationMinutes: 70, // Assuming 70 minutes for 1.5 session
    price: 770,
    label: '10 x 1.5 Sessions (10x70 min) - 770 CHF',
    isFeatured: true,
    sessionType: '1.5 Sessions',
  },

  // COLUMN 3: 1 Session (Using '1 Session' in label, 45 or 60 minutes duration)
  {
    id: 'single_45',
    name: '1 x 1 Session',
    description: 'Single session of 45 minutes.',
    lessons: 1,
    durationMinutes: 45,
    price: 58, // Price from label
    label: '1 Session (45 min) - 58 CHF',
    sessionType: '1 Session',
  },
  {
    id: 'bundle_5x60',
    name: '5  x 1 Sessions',
    description: 'Five sessions, 45 min each.', // Changed from 60 to 45 for consistency
    lessons: 5,
    durationMinutes: 45, // Changed from 60 to 45 for consistency
    price: 265,
    label: '5 x 1 Sessions (5x45 min) - 265 CHF',
    sessionType: '1 Session',
  },
  {
    id: 'bundle_10x60',
    name: '10 x 1 Sessions',
    description: 'Ten sessions, 45 minutes each.', // Changed from 60 to 45 for consistency
    lessons: 10,
    durationMinutes: 45, // Changed from 60 to 45 for consistency
    price: 525,
    label: '10 x 1 Sessions (10x45 min) - 525 CHF',
    isFeatured: true,
    sessionType: '1 Session',
  },
];


// --- Testimonials ---

export const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I can recommend Ilya's work, and him personally, with full conviction. I don't even know where to begin in highlighting his qualities. His personality is exceptional, and this shines through in his work. He's not your typical programmer. I have a feeling he started that field of study simply to satisfy his brilliant mind. But Ilya's work is more than just coding. His range of experience seems endless, which makes his input incredibly valuable. He's knowledgeable in art as well as current technological developments. His creativity overflows. He genuinely invests himself in his work rather than just fulfilling a task. What's truly valuable is that he contributes for the benefit of the client. He's always thinking, \"What else could be helpful? What could make this new homepage even more up-to-date?\" Things I couldn't even imagine existed are commonplace for him, and he incorporates them. He also possesses a patience and kindness that made our collaboration incredibly pleasant. My objections, ideas, wishes... everything! He always took everything to heart and implemented it. Even when my work required something a bit old-fashioned, he made an absolute effort to find the best solution for me. It's a gift to have Ilya by my side, both for the design and the maintenance of my homepage.",
    clientName: "Daniela Hagmann",
    clientTitle: "Co",
    clientCompany: "Lebend-Ich",
    clientImage: "https://i.ibb.co/xKGQtdbJ/Portrait-7-photoshoped.jpg",
  },
  {
    id: 2,
    quote: "We were incredibly pleased with Ilya's contributions to our team. He played a key role in developing several components of our main PWA, consistently maintaining a positive attitude and fostering a great atmosphere in the workplace. Ilya is a true asset!",
    clientName: "Tal Yaron",
    clientTitle: "CEO",
    clientCompany: "FreeDi",
    clientImage: "https://i.ibb.co/1Jt1c6kC/1670996333512.jpg",
  }
];

// --- Export ---

export const products = {
  
  courses: courses,
  testimonials: testimonials,
};

