// tests/e2e/home/home.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { HomePage } from '../pages/home/HomePage';

test.describe('Home', () => {

  test('TC-001: page loads with correct title and hero section', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectLoaded();
    await expect(page).toHaveTitle(/AirVoice Wireless/);
  });

  test('TC-002: navigation bar displays all required links', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.navPlans).toBeVisible();
    await expect(home.navPhones).toBeVisible();
    await expect(home.navCoverage).toBeVisible();
    await expect(home.navSupport).toBeVisible();
    await expect(home.navSignIn).toBeVisible();
  });

  test('TC-003: click "View All Plans" navigates to plans page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickViewAllPlans();
    await expect(page).toHaveURL(/\/plans/);
  });

  test('TC-004: click "Shop Phones" navigates to phones page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickShopPhones();
    await expect(page).toHaveURL(/\/smartphones|\/phones/);
  });

  test('TC-005: nav link "Plans" navigates to plans page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNavPlans();
    await expect(page).toHaveURL(/\/plans/);
  });

  test('TC-006: nav link "Sign in" navigates to sign-in page', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.clickNavSignIn();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('TC-007: "Discover Our Plans" section is visible', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.discoverPlansHeading).toBeVisible();
  });

  test('TC-008: newsletter form has email input and subscribe button', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await expect(home.newsletterEmailInput).toBeVisible();
    await expect(home.newsletterSubscribeButton).toBeVisible();
  });

  // Visual regression — run `npx playwright test --update-snapshots` once to create baseline
  test('TC-009: hero section matches visual snapshot', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectLoaded();
    await expect(page).toHaveScreenshot('home-hero.png', { fullPage: false });
  });

  test('TC-010: page passes accessibility audit', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectLoaded();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

});
