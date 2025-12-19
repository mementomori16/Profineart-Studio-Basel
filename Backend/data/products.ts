// src/data/products.ts
import { LessonPackage, Product, Testimonial, ProductImage } from '../types/Product.js';

// --- Courses ---

export const courses: Product[] = [
  {
    id: 800,
    badge: 'has_badge',
    image: {
      lowResUrl: 'https://i.ibb.co/DBrD41T/100kbphotoshoped-more-bright-1.jpg',
      highResUrl: 'https://i.ibb.co/kg0RQm5/best.jpg',
      caption: 'Jesus Christ Pontocrator. Egg Tempera and 24 Karat Gold on Primed Wood Panel. Artist: Ilya Medvedev',
    },

    thumbnails: [
      {
        lowResUrl: "https://i.ibb.co/mVYD615H/IMG-4570120kb.jpg",
        highResUrl: 'https://i.ibb.co/mVYD615H/IMG-4570120kb.jpg',
      },
    ],

    detailsImages: [
      {
        lowResUrl: 'https://i.ibb.co/wNgF6c9M/3.jpg',
        highResUrl: 'https://i.ibb.co/WWx2fhv/newphotoshoped-darker-2025-more-bright.jpg',
        caption: 'Virgin and the Child. Egg Tempera and 24 Karat Gold on Primed Wood Panel. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/chG9pv25/smaller2025-120kb.jpg',
        highResUrl: 'https://i.ibb.co/8L2X1jfz/smaller2025-Recovered500kb.jpg',
        caption: 'Presentation of Christ at the Temple. Egg Tempera on Primed Wood Panel. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/6R2BLYQ8/IMG-4588ph120kb.jpg',
        highResUrl: 'https://i.ibb.co/8nkdprgS/IMG-4588ph500kb.jpg',
        caption: 'Virgin Mary at Annunsiation. Egg Tempera on Primed Wood Panel. Artist: Ilya Medvedev',
      },
    ],

    medium: 'Course',
    briefDescription: undefined,
    title: undefined
  },

  {
    id: 801,
    badge: 'has_badge',
    image: {
      lowResUrl: 'https://i.ibb.co/C5nyCr4D/photoshoped-new-2025-Royal-Gore-Oil-on-canvas-111-x-200-cm-2008-Ilya-Medvedev120kb.jpg',
      highResUrl: 'https://i.ibb.co/kg0RQm5/best.jpg',
      caption: 'Two nudes. Oil on canvas. Artist: Ilya Medvedev',
    },

    thumbnails: [
      {
        lowResUrl: "https://i.ibb.co/1G4060P9/Ilya-Medvedev-next-to-his-painting-ph25.jpg",
        highResUrl: 'https://i.ibb.co/mVYD615H/IMG-4570120kb.jpg',
      },
    ],

    detailsImages: [
      {
        lowResUrl: 'https://i.ibb.co/FbRvJv6d/Vanitas-ph12-2025120kb.jpg',
        highResUrl: 'https://i.ibb.co/qMLc4c6j/Vanitas-ph12-2025.jpg',
        caption: 'Skulls, Fruits and Flowers. Oil on canvas. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/mrgBT7rW/good100kb.jpg',
        highResUrl: 'https://i.ibb.co/pB2pdQ1R/good500kb.jpg',
        caption: 'Tereza. Oil on canvas. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/6RCSpq0h/IMG-4906-photoshoped-12-2025-120kb.jpg',
        highResUrl: 'https://i.ibb.co/WWx2fhv/newphotoshoped-darker-2025-more-bright.jpg',
        caption: 'Nude on chair. Oil on canvas. Artist: Ilya Medvedev',
      },
    ],

    medium: 'Course',
    briefDescription: undefined,
    title: undefined
  },

  {
    id: 803,
    badge: 'has_badge',
    image: {
      lowResUrl: 'https://i.ibb.co/tP1wnd89/photoshoped2025final120kb.jpg',
      highResUrl: 'https://i.ibb.co/PvKs8FBC/photoshoped2025final500kb.jpg',
      caption: 'E.T. Artist: Ilya Medvedev',
    },

    thumbnails: [
      {
        lowResUrl: "https://i.ibb.co/PG11gxKp/IMG-508715120kb.jpg",
        highResUrl: '',
      },
    ],

    detailsImages: [
      {
        lowResUrl: 'https://i.ibb.co/dxbsLPS/IMG-3271ph12-2025100kb.jpg',
        highResUrl: 'https://i.ibb.co/XxwRtFvB/IMG-3271ph12-2025500kb.jpg',
        caption: 'Baby Lion. Mixed technique on Paper. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/mrgBT7rW/good100kb.jpg',
        highResUrl: 'https://i.ibb.co/8L2X1jfz/smaller2025-Recovered500kb.jpg',
        caption: 'Presentation of Christ at the Temple. Artist: Ilya Medvedev',
      },
      {
        lowResUrl: 'https://i.ibb.co/6R2BLYQ8/IMG-4588ph120kb.jpg',
        highResUrl: 'https://i.ibb.co/8nkdprgS/IMG-4588ph500kb.jpg',
        caption: 'Virgin Mary at Annunsiation. Artist: Ilya Medvedev',
      },
    ],

    medium: 'Course',
    briefDescription: undefined,
    title: undefined
  },

   
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

