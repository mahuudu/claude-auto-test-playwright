import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;

  readonly emptyCartHeading: Locator;
  readonly goHomeBtn: Locator;
  readonly cartItemPlanName: Locator;
  readonly billingsummary: Locator;
  readonly proceedCheckoutBtn: Locator;
  readonly changeToEsimBtn: Locator;
  readonly changePlanBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emptyCartHeading  = page.getByText('Your Cart is empty');
    this.goHomeBtn         = page.getByRole('button', { name: /Go Home/i });
    this.cartItemPlanName  = page.getByText(/\d+GB\/mo Plan/);
    this.billingsummary    = page.getByText('Billing Summary');
    this.proceedCheckoutBtn = page.getByRole('button', { name: /Proceed Checkout/i });
    this.changeToEsimBtn   = page.getByRole('button', { name: /Change to eSIM/i });
    this.changePlanBtn     = page.getByRole('button', { name: /Change Plan/i });
  }

  async goto() {
    await this.page.goto('/cart');
  }

  async expectLoaded() {
    await this.page.waitForURL(/\/cart/);
  }

  async expectEmpty() {
    await expect(this.emptyCartHeading).toBeVisible();
    await expect(this.goHomeBtn).toBeVisible();
  }

  async expectHasItems() {
    await expect(this.proceedCheckoutBtn).toBeVisible();
  }

  async clickGoHome() {
    await this.goHomeBtn.click();
  }

  async clickProceedCheckout() {
    await this.proceedCheckoutBtn.click();
  }
}
