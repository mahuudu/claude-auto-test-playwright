import { test as base } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';
import { PasswordPage } from '../pages/auth/PasswordPage';

type PageObjectFixtures = {
  signInPage: SignInPage;
  passwordPage: PasswordPage;
};

export const test = base.extend<PageObjectFixtures>({
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  passwordPage: async ({ page }, use) => {
    await use(new PasswordPage(page));
  },
});

export { expect } from '@playwright/test';
