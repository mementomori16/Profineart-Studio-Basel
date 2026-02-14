import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../Backend/data/products'; 

export const useSeo = (slug?: string, imageUrl?: string) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // 1. BASE DEFAULTS
    let title = `${t('coursesPage.title')} | Profineart Studio Basel`;
    let description = "Private in-person painting courses and art mentorship in Basel, Zurich, and Bern. Individual lessons in your studio or home.";
    let keywords = "Malkurs Basel, Art lessons Switzerland, painting teacher Zurich, drawing lessons Bern, иконопись в швейцарии, private art mentor, oil painting Basel, Ikonenmalerei Schweiz, art classes Lörrach, Saint-Louis art";
    let img = imageUrl || "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg";
    const baseUrl = "https://profineart.ch";
    const currentUrl = slug ? `${baseUrl}/course/${slug}` : `${baseUrl}/courses`;

    let isProductPage = false;

    // 2. COURSE-SPECIFIC DEEP OPTIMIZATION
    if (slug) {
      const product = courses.find(p => p.slug === slug);
      
      if (product) {
        isProductPage = true;
        const productTitle = t(`products.${product.id}.title`);
        const productBrief = t(`products.${product.id}.briefDescription`);

        description = productBrief;
        img = imageUrl || product.image?.highResUrl || img;

        // Custom Title/Keyword logic for the most important search terms
        switch (slug) {
          case 'byzantine-iconography-course':
          case 'contemporary-iconography-course':
            title = `${productTitle} Switzerland | иконопись в швейцарии`;
            keywords = "иконопись в швейцарии, Ikonenmalerei Kurs Schweiz, Byzantine Iconography Basel, Egg Tempera lessons, иконопись базель, private icon painting Zurich";
            break;
          case 'oil-painting-course':
            title = `${productTitle} Basel & Zurich | Ölmalerei Kurs`;
            keywords = "Ölmalerei Basel, Oil painting private teacher Zurich, Malkurs Basel Land, painting mentor Bern, уроки живописи маслом базель, professional oil painting Switzerland";
            break;
          case 'aquarelle-course':
            title = `${productTitle} Basel & Lörrach | Aquarelle Course`;
            keywords = "Aquarellkurs Basel, watercolor lessons Switzerland, Aquarelle private teacher, уроки акварели базель, watercolor workshop Zurich";
            break;
          default:
            title = `${productTitle} | Profineart Studio Basel`;
            keywords = `${productTitle}, private art lessons Switzerland, art mentor Basel`;
        }
      }
    }

    // 3. APPLY META TAGS (Visible to all Search Engines)
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);

    // 4. OPEN GRAPH & CANONICAL
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', img);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl);
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', currentUrl);

    // 5. THE SENIOR SEO WIN: SCHEMA INJECTION
    const scriptId = 'dynamic-seo-schema';
    document.getElementById(scriptId)?.remove();

    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Courses", "item": `${baseUrl}/courses` },
          ...(isProductPage ? [{ "@type": "ListItem", "position": 2, "name": title, "item": currentUrl }] : [])
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": slug ? "Course" : "ItemList",
        "name": title,
        "description": description,
        "image": img,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Profineart Studio Basel",
          "image": img,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Basel",
            "addressCountry": "CH"
          }
        }
      }
    ];

    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemas);
    document.head.appendChild(script);

    document.documentElement.lang = i18n.language;

  }, [slug, i18n.language, t, imageUrl]);
};