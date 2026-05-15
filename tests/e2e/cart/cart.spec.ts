// tests/e2e/cart/cart.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { CartPage } from '../pages/cart/CartPage';
import { PlansPage } from '../pages/plans/PlansPage';

async function addPlanToCart(page: any) {
  const plans = new PlansPage(page);
  await plans.goto();
  await plans.expectLoaded();
  await page.getByText('Buy now').first().click();
  // Wait for navigation to cart after adding plan
  await page.waitForURL(/\/cart/);
}

test.describe('Cart', () => {

  test('TC-001: empty state hiển thị đúng khi giỏ hàng trống', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectEmptyState();
  });

  test('TC-002: thêm plan từ trang Plans vào giỏ hàng', async ({ page }) => {
    const cart = new CartPage(page);
    await addPlanToCart(page);
    await cart.expectHasItems();
  });

  test('TC-003: cart icon badge cập nhật sau khi thêm plan', async ({ page }) => {
    const cart = new CartPage(page);
    await addPlanToCart(page);
    const count = await cart.getCartIconBadgeCount();
    expect(parseInt(count)).toBeGreaterThanOrEqual(1);
  });

  test('TC-004: xóa item khỏi giỏ hàng trở về empty state', async ({ page }) => {
    const cart = new CartPage(page);
    await addPlanToCart(page);
    await cart.expectHasItems();
    await cart.clickRemoveItem();
    await cart.expectEmptyState();
  });

  test('TC-005: Proceed Checkout điều hướng sang trang checkout', async ({ page }) => {
    const cart = new CartPage(page);
    await addPlanToCart(page);
    await cart.expectHasItems();
    await cart.clickProceedCheckout();
    await expect(page).toHaveURL(/checkout/);
  });

  test('TC-006: nút Go Home từ empty cart điều hướng về trang chủ', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectEmptyState();
    await cart.clickGoHome();
    await expect(page).toHaveURL(/^https:\/\/airvoice\.hthdev\.com\/?$/);
  });

  test('TC-007: breadcrumb Shopping Cart hiển thị đúng', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await expect(cart.breadcrumbShoppingCart).toBeVisible();
  });

  test('TC-008: thông tin plan trong cart hiển thị đầy đủ', async ({ page }) => {
    const cart = new CartPage(page);
    await addPlanToCart(page);
    await cart.expectHasItems();
    await expect(cart.billingSummaryHeading).toBeVisible();
    await expect(cart.estimatedTotalText).toBeVisible();
    // Plan name visible
    await expect(page.getByText(/1GB\/mo Plan/i)).toBeVisible();
  });

  test('TC-009: empty cart matches visual snapshot', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectEmptyState();
    await expect(page).toHaveScreenshot('cart-empty.png', { fullPage: false });
  });

  test('TC-010: empty cart page passes accessibility audit', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.goto();
    await cart.expectEmptyState();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

});
