import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../Backend/data/products'; 

export const useSeo = (slug?: string, imageUrl?: string) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const isDe = i18n.language.startsWith('de');
    const baseUrl = "https://profineart.ch";

    // --- NEW: THE "SUPER-TAG" DATA BLOCKS ---
    // These blocks ensure you cover every town and niche you mentioned.
    const townsCH = "Basel, Zurich, Bern, Allschwil, Reinach, Muttenz, Pratteln, Binningen, Liestal, Münchenstein, Oberwil, Aesch, Arlesheim, Bubendorf, Gelterkinden, Sissach, Bottmingen";
    const townsInt = "Lörrach, Weil am Rhein, Saint-Louis, Huningue";
    const nicheMentors = "private painting mentor, fine art tutor, contemporary figurative painting, tattoo artist painting coach, portfolio preparation, academic drawing mentor";
    const courseTypes = "oil painting, iconography, stone painting, mixed media, acrylic lessons, in-person sessions";

    // 1. BASE DEFAULTS (Localized and Saturating the Meta Tags)
    let title = isDe 
      ? `Privatunterricht & Malkurse | Profineart Studio Basel & Schweiz` 
      : `Private Art Mentorship & Painting Courses | Basel, Zurich, Bern`;
    
    let rawDescription = isDe
      ? `Professioneller privater Kunstunterricht und Mentoring in ${townsCH} sowie ${townsInt}. Individuelle Lektionen für Ölmalerei und Zeichnen direkt bei Ihnen.`
      : `Private in-person painting courses and art mentorship in ${townsCH} and nearby French/German towns. Professional drawing and painting tutor at your location.`;
    
    let keywords = isDe
      ? `Malkurs Basel, Zeichenkurs Basel, Privatunterricht Kunst, Ölmalerei Schweiz, Ikonenmalerei, ${townsCH}, ${townsInt}, ${nicheMentors}, ${courseTypes}`
      : `Private painting teacher Basel, art mentor Zurich, painting tutor Bern, ${nicheMentors}, ${courseTypes}, ${townsCH}, ${townsInt}, in-person art classes`;
    
    let img = imageUrl || "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg";
    const currentUrl = slug ? `${baseUrl}/course/${slug}` : `${baseUrl}/courses`;

    // 2. COURSE-SPECIFIC DEEP OPTIMIZATION (Using Slugs)
    if (slug) {
      const product = courses.find(p => p.slug === slug);
      if (product) {
        const productTitle = t(`products.${product.id}.title`);
        rawDescription = t(`products.${product.id}.briefDescription`);
        img = imageUrl || product.image?.highResUrl || img;

        switch (slug) {
          case 'byzantine-iconography-course':
          case 'contemporary-iconography-course':
            title = isDe ? `${productTitle} Schweiz | Ikonenmalerei Basel` : `${productTitle} Switzerland | Byzantine Art Mentor`;
            keywords += ", иконопись в швейцарии, egg tempera lessons, religious art workshop, Ikonen malen Basel";
            break;
          case 'oil-painting-course':
            title = isDe ? `${productTitle} Basel & Zurich | Ölmalerei Privatlehrer` : `${productTitle} Basel | Professional Oil Painting Mentor`;
            keywords += ", figurative oil painting, painting for tattoo artists, academic techniques, museum quality instruction";
            break;
          case 'academic-drawing-course':
            title = isDe ? `${productTitle} Basel | Zeichenkurs & Anatomie` : `${productTitle} Basel | Academic Drawing & Portfolio Prep`;
            keywords += ", anatomical drawing, graphite mentor, art school preparation, charcoal drawing Basel";
            break;
          case 'stone-painting-course':
            title = isDe ? `Steinmalerei Kurs Schweiz | ${productTitle}` : `Stone Painting Course Basel | ${productTitle}`;
            keywords += ", painting on stone, unique art workshop, painting on marble Switzerland";
            break;
          case 'aquarelle-course':
            title = isDe ? `Aquarellkurs Basel & Lörrach | ${productTitle}` : `Aquarelle Painting Tutor | Basel & Switzerland`;
            keywords += ", watercolor teacher, aquarelle mentorship, painting on paper Basel";
            break;
          default:
            title = `${productTitle} | Profineart Studio Basel`;
        }
      }
    }

    // 3. APPLY CLEAN METADATA (Sanitizing for Google Snippets)
    const cleanDescription = rawDescription
      .replace(/<[^>]*>/g, '') 
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 160);

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', cleanDescription);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);

    // 4. SOCIAL & CANONICAL
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', cleanDescription);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', img);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl);
    
    document.querySelector('meta[name="twitter:card"]')?.setAttribute('content', 'summary_large_image');
    document.querySelector('meta[name="twitter:image"]')?.setAttribute('content', img);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
        canonical.setAttribute('href', currentUrl);
    } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = currentUrl;
        document.head.appendChild(link);
    }

    // 5. HREFLANG (Crucial for Swiss SEO)
    const setHreflang = (lang: string, href: string) => {
        let el = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
        if (!el) {
            el = document.createElement('link');
            el.rel = 'alternate';
            el.hreflang = lang;
            document.head.appendChild(el);
        }
        el.href = href;
    };
    setHreflang('de-CH', `${baseUrl}/course/${slug || ''}?lang=de`);
    setHreflang('en-CH', `${baseUrl}/course/${slug || ''}?lang=en`);

    // 6. SCHEMA INJECTION (Localized AreaServed for Maps)
    const scriptId = 'dynamic-seo-schema';
    document.getElementById(scriptId)?.remove();

    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Courses", "item": `${baseUrl}/courses` },
          ...(slug ? [{ "@type": "ListItem", "position": 2, "name": title, "item": currentUrl }] : [])
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Profineart Studio Basel",
        "image": img,
        "description": cleanDescription,
        "url": currentUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Basel",
          "addressCountry": "CH"
        },
        "areaServed": [
            "Basel", "Zurich", "Bern", "Allschwil", "Reinach", "Muttenz", "Pratteln", 
            "Binningen", "Liestal", "Münchenstein", "Oberwil", "Aesch", "Arlesheim", 
            "Lörrach", "Saint-Louis", "Weil am Rhein"
        ]
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