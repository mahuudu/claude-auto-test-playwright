// tests/e2e/plans/plans.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { PlansPage } from '../pages/plans/PlansPage';

test.describe('Plans', () => {

  test('TC-001: page loads with correct heading', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await plans.expectLoaded();
  });

  test('TC-002: data plan tabs are all visible', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await expect(plans.tab1GB).toBeVisible();
    await expect(plans.tab3GB).toBeVisible();
    await expect(plans.tab6GB).toBeVisible();
    await expect(plans.tab10GB).toBeVisible();
    await expect(plans.tabUnlimited).toBeVisible();
  });

  test('TC-003: selecting 3GB tab activates it', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await plans.clickTab3GB();
    await expect(plans.tab3GB).toHaveAttribute('aria-selected', 'true');
  });

  test('TC-004: SIM Card and eSIM options are visible', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await expect(plans.simCardOption).toBeVisible();
    await expect(plans.esimOption).toBeVisible();
  });

  test('TC-005: phone number widget is visible on the page', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    // Phone number is a multi-field widget — verify the section label is visible
    await expect(page.getByText('Your Phone Number')).toBeVisible();
  });

  test('TC-006: Buy Now adds plan to cart (badge increases, URL stays)', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await plans.clickBuyNow();
    await expect(page).toHaveURL(/\/plans/);
    const cartBadge = page.locator('a[aria-label*="Shopping cart"] .MuiBadge-badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

  test('TC-007: family plan section is visible', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await expect(plans.familyPlanHeading).toBeVisible();
  });

  test('TC-008: FAQ accordion expands on click', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await expect(plans.faqHeading).toBeVisible();
    await plans.clickFirstFaq();
    await expect(plans.firstFaqItem).toHaveAttribute('aria-expanded', 'true');
  });

  test('TC-009: page passes accessibility audit', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await plans.expectLoaded();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('TC-010: plans page matches visual snapshot', async ({ page }) => {
    const plans = new PlansPage(page);
    await plans.goto();
    await plans.expectLoaded();
    await expect(page).toHaveScreenshot('plans-page.png', { fullPage: false });
  });

});
