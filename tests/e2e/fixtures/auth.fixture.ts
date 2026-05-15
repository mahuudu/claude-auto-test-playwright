import { test as base, Page } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../../../.auth/user.json');

type AuthFixtures = {
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    // Reuse session saved by auth.setup.ts — no login per test
    const context = await browser.newContext({ storageState: authFile });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from '@playwright/test';
