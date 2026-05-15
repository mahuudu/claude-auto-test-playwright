// scripts/crawl.js
// Bước 1: Dùng Playwright chụp screenshot + lấy HTML → lưu file
// Claude (chạy trong /e2e) sẽ đọc các file này và tự phân tích — không cần Anthropic API
require('dotenv').config();
const { chromium } = require('playwright');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL;
const FEATURE    = process.env.FEATURE;
const PAGE       = process.env.PAGE;

if (!TARGET_URL) {
  console.error('❌  TARGET_URL chưa được set trong .env');
  process.exit(1);
}

// Output dir: docs/crawl/<feature>/<page>/ if FEATURE+PAGE provided, else docs/ (legacy)
const outDir = (FEATURE && PAGE) ? `docs/crawl/${FEATURE}/${PAGE}` : 'docs';

(async () => {
  console.log(`🔍  Crawling: ${TARGET_URL}`);
  if (FEATURE && PAGE) console.log(`📁  Output  → ${outDir}/`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 30000 });

  const html = await page.content();
  const title = await page.title();
  const screenshotBuffer = await page.screenshot({ fullPage: true });

  await browser.close();

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(`${outDir}/screenshot.png`, screenshotBuffer);
  // Cắt HTML để tránh file quá lớn (giữ 20KB đầu là đủ cho Claude phân tích)
  const htmlTruncated = html.length > 20000 ? html.slice(0, 20000) + '\n<!-- truncated -->' : html;
  fs.writeFileSync(`${outDir}/raw-html.txt`, htmlTruncated);

  // Skeleton crawl-data.json — Claude fills in the analysis fields
  const skeleton = {
    crawledAt: new Date().toISOString(),
    url: TARGET_URL,
    title,
    metaDescription: '',
    pageType: 'other',
    purpose: '',
    headings: [],
    interactiveElements: { buttons: [], links: [], inputs: [], forms: [] },
    keyFeatures: [],
    testableScenarios: [],
    potentialIssues: [],
  };
  fs.writeFileSync(`${outDir}/crawl-data.json`, JSON.stringify(skeleton, null, 2));

  console.log(`📸  Screenshot saved → ${outDir}/screenshot.png`);
  console.log(`📄  HTML saved      → ${outDir}/raw-html.txt`);
  console.log(`📋  Skeleton saved  → ${outDir}/crawl-data.json`);
  console.log(`✅  Crawl xong. Claude sẽ phân tích screenshot + HTML và điền vào crawl-data.json.`);
})();
