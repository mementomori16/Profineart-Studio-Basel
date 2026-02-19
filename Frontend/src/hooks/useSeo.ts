import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { courses } from '../../../Backend/data/products'; 

export const useSeo = (slug?: string, imageUrl?: string) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const isDe = i18n.language.startsWith('de');
    const baseUrl = "https://profineart.ch";
    // Sitemap uses /course/slug
    const currentUrl = slug ? `${baseUrl}/course/${slug}` : `${baseUrl}/courses`;
    let img = imageUrl || "https://res.cloudinary.com/dpayqcrg5/image/fetch/f_auto,q_auto/https://i.ibb.co/JWdc4DCb/No-borders50kb.jpg";

    let title = "";
    let rawDescription = "";
    let keywords = "";

    // Exact towns from your data
    const towns = "Basel, Basel-Landschaft, Zurich, Bern, Allschwil, Reinach, Muttenz, Pratteln, Binningen, Liestal, Münchenstein, Oberwil, Aesch, Arlesheim, Bubendorf, Gelterkinden, Sissach, Bottmingen, Lörrach, Weil am Rhein, Saint-Louis, Huningue";

    if (isDe) {
      // GERMAN SEO (Instruction in English)
      title = "Privatunterricht & Mentoring | Profineart Studio Basel";
      rawDescription = `Professionelles Kunst-Mentoring in ${towns}. Privater Malunterricht (Unterricht auf Englisch) bei Ihnen zu Hause oder im Atelier.`;
      keywords = `Privatunterricht Malen, Kunst Mentor Basel, privater Mallehrer, Ölmalerei Mentor, Zeichnen Privatstunden, Mappenvorbereitung, Malen für Tätowierer, Figurative Malerei, ${towns}`;

      if (slug) {
        const p = courses.find(c => c.slug === slug);
        if (p) {
          title = `${t(`products.${p.id}.title`)} | Mentoring Basel`;
          rawDescription = t(`products.${p.id}.briefDescription`) + " (Unterricht auf Englisch)";
          
          // German Keyword Injection based on slug
          if (slug === 'byzantine-iconography-course') keywords += ", Ikonenmalerei, Eitempera Malen, sakrale Kunst, Vergoldung";
          if (slug === 'oil-painting-course') keywords += ", Ölmalerei Technik, Porträtmalerei, klassische Untermalung";
          if (slug === 'mixed-media-drawing-course') keywords += ", Mixed Media Kunst, Illustration Mentor, Grafik Design";
          if (slug === 'aquarelle-course') keywords += ", Aquarellmalerei, Wasserfarben Mentor, Lasurtechnik";
          if (slug === 'academic-drawing-course') keywords += ", Akademisches Zeichnen, Anatomie Tutor, Kohlezeichnung";
          if (slug === 'stone-painting-course') keywords += ", Malen auf Stein, Kunst auf Marmor, Steinmalerei";
          if (slug === 'contemporary-painting-course') keywords += ", Zeitgenössische Malerei, Alla Prima Technik";
        }
      }
    } else {
      // ENGLISH SEO
      title = "Private Fine Art Mentorship | Profineart Studio Basel";
      rawDescription = `Professional private art mentorship in ${towns}. Exclusive individual sessions at your location. Instruction in English.`;
      keywords = `private painting mentor, fine art mentorship, painting tutor, professional art mentor, in-person painting sessions, figurative painting mentor, academic drawing tutor, oil painting coach, tattoo artist painting mentor, portfolio preparation, ${towns}`;

      if (slug) {
        const p = courses.find(c => c.slug === slug);
        if (p) {
          title = `${t(`products.${p.id}.title`)} | Private Mentorship Basel`;
          rawDescription = t(`products.${p.id}.briefDescription`);

          // English Keyword Injection based on slug
          if (slug === 'byzantine-iconography-course') keywords += ", byzantine iconography mentor, egg tempera glazing, sacred painting, historical techniques, gilding master";
          if (slug === 'oil-painting-course') keywords += ", oil painting mentor, classical underpainting, impasto technique, professional oil coach, portraiture";
          if (slug === 'mixed-media-drawing-course') keywords += ", mixed media mentor, dry and wet media fusion, illustration sessions";
          if (slug === 'aquarelle-course') keywords += ", aquarelle painting mentor, watercolor mentorship, paper physics, translucent painting";
          if (slug === 'academic-drawing-course') keywords += ", academic drawing mentorship, freehand stroke, anatomical study";
          if (slug === 'stone-painting-course') keywords += ", painting on stone mentor, fine art on marble, tactile art, miniature painting";
          if (slug === 'contemporary-painting-course') keywords += ", contemporary painting mentor, old master discipline, conceptual power";
        }
      }
    }

    // FINAL APPLICATION
    const cleanDescription = rawDescription.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160);
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', cleanDescription);
    document.querySelector('meta[name="keywords"]')?.setAttribute('content', keywords);

    // Socials
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', cleanDescription);
    document.querySelector('meta[property="og:image"]')?.setAttribute('content', img);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', currentUrl);

    // HREFLANG
    const updateHreflang = (lang: string, url: string) => {
      let el = document.querySelector(`link[hreflang="${lang}"]`) as HTMLLinkElement;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.hreflang = lang;
        document.head.appendChild(el);
      }
      el.href = url;
    };
    updateHreflang('de-CH', `${baseUrl}/course/${slug || ''}?lang=de`);
    updateHreflang('en-CH', `${baseUrl}/course/${slug || ''}?lang=en`);

    // SCHEMA
    const scriptId = 'dynamic-seo-schema';
    document.getElementById(scriptId)?.remove();
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Profineart Studio Basel",
      "image": img,
      "description": cleanDescription,
      "url": currentUrl,
      "address": { "@type": "PostalAddress", "addressLocality": "Basel", "addressCountry": "CH" },
      "areaServed": towns.split(', '),
      "knowsLanguage": "en"
    });
    document.head.appendChild(script);

    document.documentElement.lang = i18n.language;

  }, [slug, t, i18n.language, imageUrl]);
};