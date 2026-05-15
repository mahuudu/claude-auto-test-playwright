// tests/e2e/pages/cart/CartPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  // Empty state
  readonly emptyHeading: Locator;
  readonly emptySubtext: Locator;
  readonly goHomeButton: Locator;

  // Cart with items
  readonly orderReviewHeading: Locator;
  readonly itemsCountText: Locator;
  readonly removeItemButton: Locator;
  readonly changePlanButton: Locator;
  readonly changeToEsimButton: Locator;
  readonly billingSummaryHeading: Locator;
  readonly estimatedTotalText: Locator;
  readonly proceedCheckoutButton: Locator;

  // Shared
  readonly breadcrumbShoppingCart: Locator;
  readonly cartIconHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Empty state
    this.emptyHeading      = page.getByRole('heading', { name: /your cart is empty/i });
    this.emptySubtext      = page.getByText(/haven.*added anything/i);
    this.goHomeButton      = page.getByRole('link', { name: /go home/i });

    // Cart with items
    this.orderReviewHeading   = page.getByRole('heading', { name: /order review/i });
    this.itemsCountText       = page.getByText(/\d+ item.*in cart/i);
    this.removeItemButton     = page.locator('button.MuiIconButton-root').first();
    this.changePlanButton     = page.getByRole('button', { name: 'Change Plan' });
    this.changeToEsimButton   = page.getByRole('button', { name: 'Change to eSIM' });
    this.billingSummaryHeading = page.getByRole('heading', { name: /billing summary/i });
    this.estimatedTotalText   = page.getByText(/estimated total/i);
    this.proceedCheckoutButton = page.getByRole('button', { name: /proceed checkout/i });

    // Shared
    this.breadcrumbShoppingCart = page.getByRole('link', { name: 'Shopping Cart' }).first();
    this.cartIconHeader         = page.getByRole('link', { name: /shopping cart with/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async expectEmptyState() {
    await expect(this.emptyHeading).toBeVisible();
    await expect(this.emptySubtext).toBeVisible();
    await expect(this.goHomeButton).toBeVisible();
  }

  async expectHasItems() {
    await expect(this.orderReviewHeading).toBeVisible();
    await expect(this.itemsCountText).toBeVisible();
  }

  async clickGoHome() {
    await this.goHomeButton.click();
  }

  async clickRemoveItem() {
    await this.removeItemButton.click();
  }

  async clickProceedCheckout() {
    await this.proceedCheckoutButton.click();
  }

  async clickChangePlan() {
    await this.changePlanButton.click();
  }

  async getCartIconBadgeCount(): Promise<string> {
    const ariaLabel = await this.cartIconHeader.getAttribute('aria-label');
    const match = ariaLabel?.match(/(\d+)/);
    return match ? match[1] : '0';
  }
}
