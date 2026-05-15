import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL as string | undefined;
  if (!baseURL) throw new Error('BASE_URL is not set. Check your .env file.');

  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    const response = await page.goto(baseURL, { timeout: 20000 });
    if (!response) throw new Error(`Health check: no response from ${baseURL}`);
    if (response.status() >= 500)
      throw new Error(`Health check failed: HTTP ${response.status()} from ${baseURL}`);
    console.log(`\n✅ Server health check passed: ${baseURL} (HTTP ${response.status()})\n`);
  } finally {
    await browser.close();
  }
}

export default globalSetup;
