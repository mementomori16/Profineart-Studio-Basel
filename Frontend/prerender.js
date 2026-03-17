import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const routes = [
  '', 
  'about', 
  'courses', 
  'students-works',
  'course/byzantine-iconography-course',
  'course/oil-painting-course',
  'course/mixed-media-drawing-course',
  'course/aquarelle-course',
  'course/academic-drawing-course',
  'course/stone-painting-course',
  'course/contemporary-painting-course'
];

async function prerender() {
  console.log('🚀 Starting Prerender for SEO visibility...');
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (const route of routes) {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    // We use the file protocol to open your built app
    const url = `file://${indexPath}#/${route}`;
    
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Wait for translations and Cloudinary images to stabilize
    await new Promise(r => setTimeout(r, 2500));

    const content = await page.content();
    const routePath = path.join(__dirname, 'dist', route);
    
    if (!fs.existsSync(routePath)) {
      fs.mkdirSync(routePath, { recursive: true });
    }

    fs.writeFileSync(path.join(routePath, 'index.html'), content);
    console.log(`✅ Visible Page Created: /${route}`);
  }

  await browser.close();
  console.log('✨ All pages are now statically visible for Google!');
  process.exit(0);
}

prerender().catch(err => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});