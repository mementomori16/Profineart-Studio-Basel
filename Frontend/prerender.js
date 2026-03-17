import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import http from 'http';
import handler from 'serve-handler';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  '', 
  'about', 
  'courses', 
  'students-works',
  'how-it-works',
  'course/byzantine-iconography-course',
  'course/oil-painting-course',
  'course/mixed-media-drawing-course',
  'course/aquarelle-course',
  'course/academic-drawing-course',
  'course/stone-painting-course',
  'course/contemporary-painting-course'
];

async function prerender() {
  const server = http.createServer((request, response) => {
    return handler(request, response, { 
      public: path.join(__dirname, 'dist'),
      rewrites: [{ source: "/**", destination: "/index.html" }]
    });
  });

  const PORT = 5000;
  server.listen(PORT, async () => {
    console.log(`🚀 Prerender server running at http://localhost:${PORT}`);
    
    const browser = await puppeteer.launch({ 
      headless: "new",
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });

    const page = await browser.newPage();
    // Large viewport prevents "hidden" content issues
    await page.setViewport({ width: 1440, height: 2000 });

    const today = new Date().toISOString().split('T')[0];

    for (const route of routes) {
      const url = `http://localhost:${PORT}/${route}`;
      console.log(`📡 Crawling: ${url}`);
      
      await page.goto(url, { waitUntil: 'networkidle0' });

      if (route !== '') {
        console.log(`⏳ Waiting for DOM structure to load for /${route}...`);
        try {
          await page.waitForFunction(
            (targetRoute) => {
              const pathMatches = window.location.pathname.includes(targetRoute);
              const bodyText = document.body.innerText;
              
              const hasCourseContainer = !!document.querySelector('.cardPageContainer');
              const hasAboutContent = bodyText.includes("About the Studio");
              const hasWorksContent = bodyText.includes("Student");

              if (targetRoute.includes('course/')) return pathMatches && hasCourseContainer;
              if (targetRoute === 'about') return pathMatches && hasAboutContent;
              if (targetRoute === 'students-works') return pathMatches && hasWorksContent;
              
              return pathMatches;
            },
            { timeout: 8000 },
            route
          );

          // Scroll to trigger lazy-loading and footer visibility
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
          await new Promise(r => setTimeout(r, 1000));
          await page.evaluate(() => window.scrollTo(0, 0));

        } catch (e) {
          console.log(`⚠️ Warning: Transition to /${route} timed out. Saving current DOM.`);
        }
      }

      // Final buffer for stability
      await new Promise(r => setTimeout(r, 3000));

      // 1. INJECT SEO METADATA BEFORE SAVING
      await page.evaluate((isoDate) => {
        // Add or update Meta Last-Modified
        let meta = document.querySelector('meta[name="last-modified"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = "last-modified";
          document.head.appendChild(meta);
        }
        meta.content = isoDate;

        // Update JSON-LD Schema dateModified
        const schemas = document.querySelectorAll('script[type="application/ld+json"]');
        schemas.forEach(script => {
          try {
            let data = JSON.parse(script.innerText);
            const updateObj = (obj) => { obj.dateModified = isoDate; };
            
            if (Array.isArray(data)) {
                data.forEach(updateObj);
            } else {
                updateObj(data);
            }
            script.innerText = JSON.stringify(data);
          } catch (e) {
            // Skip scripts that aren't valid JSON or don't need updates
          }
        });
      }, new Date().toISOString());

      const content = await page.content();
      const routePath = path.join(__dirname, 'dist', route);
      
      if (!fs.existsSync(routePath)) {
        fs.mkdirSync(routePath, { recursive: true });
      }

      fs.writeFileSync(path.join(routePath, 'index.html'), content);
      console.log(`✅ Success: Generated /${route}/index.html`);
    }

    // 2. UPDATE SITEMAP.XML DATES
    // Note: Assuming sitemap.xml is in your 'public' folder
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml'); 
    if (fs.existsSync(sitemapPath)) {
      console.log('🗺️ Updating sitemap.xml timestamps...');
      let sitemap = fs.readFileSync(sitemapPath, 'utf8');
      
      // Replaces all <lastmod> tags with today's date
      sitemap = sitemap.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
      
      // Save updated sitemap back to public and also to dist for the build
      fs.writeFileSync(sitemapPath, sitemap);
      fs.writeFileSync(path.join(__dirname, 'dist', 'sitemap.xml'), sitemap);
      console.log(`✅ Sitemap updated to ${today}`);
    } else {
      console.log('⚠️ Warning: sitemap.xml not found in /public. Skipping timestamp update.');
    }

    await browser.close();
    server.close();
    console.log('✨ SEO Prerender Complete!');
    process.exit(0);
  });
}

prerender().catch(err => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});