import { test as setup, expect } from '@playwright/test';
import path from 'path';
import { SignInPage } from './pages/auth/SignInPage';
import { users } from './fixtures/test-data/users';

const authFile = path.join(__dirname, '../../.auth/user.json');

setup('authenticate as standard user', async ({ page }) => {
  const signIn = new SignInPage(page);
  await signIn.goto();
  await signIn.login(users.standard.email, users.standard.password);
  await page.waitForURL(url => !url.pathname.includes('/sign-in'), { timeout: 15000 });
  await expect(page).not.toHaveURL(/\/sign-in/);
  await page.context().storageState({ path: authFile });
  console.log(`\n🔐 Auth state saved → .auth/user.json\n`);
});
