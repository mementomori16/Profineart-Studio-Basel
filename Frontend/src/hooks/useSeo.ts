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
      keywords = `Privatunterricht Malen, Kunst Mentor Basel, privater Mallehrer, Ölmalerei Mentor, Zeichnen Privatstunden, Mappenvorbereitung, Malen für Tätowierer, Figurative Malerei, privater mallehrer basel, aquarell privatstunden basel, atelierunterricht basel, malunterricht für erwachsene basel,  ${towns}`;

      if (slug) {
        const p = courses.find(c => c.slug === slug);
        if (p) {
          title = `${t(`products.${p.id}.title`)} | Mentoring Basel`;
          rawDescription = t(`products.${p.id}.briefDescription`) + " (Unterricht auf Englisch)";
          
          // German Keyword Injection based on slug
          if (slug === 'byzantine-iconography-course') keywords += ", Ikonenmalerei Mentor, Ikonen Malkurs, privater Ikonenmallehrer, Eitempera Malerei Mentoring, sakrale Kunst in Basel, historische Maltechniken Basel, Vergoldung Privatunterricht Basel, Vergoldung Lehrer, Ikonenmalerei Privatlehrer Basel, Ikonenmalerei Tutor Basel, Eitempera Malerei Mentor Basel, Eitempera Malerei Privatunterricht";
          if (slug === 'oil-painting-course') keywords += ", Ölmalerei Mentor, Ölmalerei Tutor, Ölmalerei Privatunterricht, privater Ölmalerei Lehrer, klassische Untermalung, Impasto Technik, professioneller Ölmalerei Coach, Porträtmalerei, Ölmalerei Privatlehrer in Basel, Ölmalerei Lehrer Basel, Ölmalerei Tutor Basel, Ölmalerei Mentor Baselland";
          if (slug === 'mixed-media-drawing-course') keywords += ", Mixed Media Mentor, Zeichnen Tutor, Mischtechnik Kunst, Illustration Privatstunden, Mixed Media Zeichnen Privatlehrer, Mixed Media Tutor Basel";
          if (slug === 'aquarelle-course') keywords += ", Aquarellmalerei Mentor, Aquarell Mentoring, Papierphysik Kunst, lasierende Malerei, Aquarellmalerei Tutor, Aquarell Privatlehrer, Aquarell Tutor Basel, Aquarellmalerei Privatunterricht, Aquarell Lehrer in Basel";
          if (slug === 'academic-drawing-course') keywords += ", Zeichenlehrer in Basel, Zeichnen Privatlehrer Basel, Zeichen Mentor, Zeichen Tutor, akademisches Zeichnen Mentoring, freihändiges Zeichnen, Zeichenkurs Basel, Anatomiestudium Basel, Anatomisches Zeichnen Coaching";
          if (slug === 'stone-painting-course') keywords += ", Malen auf Stein Mentor, Kunst auf Marmor, taktile Kunst, Miniaturmalerei Studium, Malen auf Stein Tutor, Malen auf Stein Privatlehrer, Malen auf Stein in Basel, Steinmalerei Kurs Basel";
          if (slug === 'contemporary-painting-course') keywords += ", zeitgenössische Malerei Mentor, zeitgenössische Malerei Tutor, Disziplin der alten Meister, konzeptionelle Kunst, zeitgenössische Kunst Mentor, zeitgenössische Kunst Privatlehrer, zeitgenössische Kunst Tutor in Basel, zeitgenössische Malerei Lehrer Basel";
        }
      }
    } else {
      // ENGLISH SEO
      title = "Private Fine Art Mentorship | Profineart Studio Basel";
      rawDescription = `Professional private art mentorship in ${towns}. Exclusive individual sessions at your location. Instruction in English.`;
      keywords = `private painting mentor, fine art mentorship, painting tutor, professional art mentor, in-person painting sessions, figurative painting mentor, academic drawing tutor, oil painting coach, tattoo artist painting mentor, personal portfolio preparation, english speaking painting private classes basel, mobile art teacher basel, private art mentorship basel, one-on-one art classes basel, one-on-one painting classes basel, acrylic painting lessons basel, acrylic painting privet lessons basel, oil painting tutor basel, oil painting privet teacher, oil painting tutor in basel switzerland, drawing tutor in basel switzerland, drawing mentor in basel switzerland, watercolor tutor, watercolor mentor, watercolor privet teacher, academic drawing course in basel switzerland,  ${towns}`;

      if (slug) {
        const p = courses.find(c => c.slug === slug);
        if (p) {
          title = `${t(`products.${p.id}.title`)} | Private Mentorship Basel`;
          rawDescription = t(`products.${p.id}.briefDescription`);

          // English Keyword Injection based on slug
          if (slug === 'byzantine-iconography-course') keywords += ", byzantine iconography mentor, iconography painting tutor, byzantine iconography privet teacher, egg tempera glazing mentorship, sacred painting in basel switzerland, historical techniques mentorship in basel switzerland, gilding mastery tutoring in basel switzerland, gilding privet teacher, byzantine iconography privet teacher in basel switzerland, byzantine iconography tutor in basel switzerland, egg tempera painting mentor in basel switzerland, egg tempera painting tutor in basel switzerland, egg tempera painting privet teacher in basel switzerland";
          if (slug === 'oil-painting-course') keywords += ", oil painting mentor, oil painting tutor, oil painting private teaching, oil painting privet teacher, classical underpainting, impasto technique, professional oil coach, portraiture, oil painting privet teacher in basel switzerland, oil painting teacher in basel switzerland, oil painting tutor in basel switzerland, oil painting mentor in baseland";
          if (slug === 'mixed-media-drawing-course') keywords += ", mixed media painting mentor, drawing tutor, dry and wet media fusion, illustration sessions, mixed media drawing privet teacher, mixed media drawing tutor";
          if (slug === 'aquarelle-course') keywords += ", aquarelle painting mentor, watercolor mentorship, paper physics, translucent painting, aquarelle painting tutor, aquarelle painting privet teacher, watercolor painting tutor, watercolor painting privet teacher, watercolor painting teacher in Basel";
          if (slug === 'academic-drawing-course') keywords += ", drawing teacher in basel switzerland, drawing privet teacher in basel switzerland, drawing mentor, drawing tutor, academic drawing mentorship, freehand stroke, freehand drawing course in basel switzerland, anatomical study in basel switzerland, anatomical drawing tutoring";
          if (slug === 'stone-painting-course') keywords += ", painting on stone mentor, fine art on marble, tactile art, miniature painting study, painting on stone tutor, painting on stone privet teacher, painting on stone in basel switzerland, painting on stone course in basel switzerland";
          if (slug === 'contemporary-painting-course') keywords += ", contemporary painting mentor, contemporery painting tutor,old master discipline, conceptual power, contemporery art painting mentor, contemporery art painting privet teacher, contemporery art painting tutor in basel switzerland, contemporery art painting teacher in basel switzerland";
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
      "@type": "ArtSchool",
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