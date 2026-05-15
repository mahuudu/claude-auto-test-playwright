import { Page, Locator, expect } from '@playwright/test';
import { retryWithBackoff, waitUntil } from '../../helpers';

export class CheckoutPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly zipCodeInput: Locator;
  readonly addressInput: Locator;
  readonly aptSuiteInput: Locator;
  readonly placeOrderBtn: Locator;
  readonly backBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput  = page.locator('#last_name');
    this.emailInput     = page.locator('#email');
    this.phoneInput     = page.locator('#phone_number');
    this.passwordInput  = page.getByPlaceholder('Create Account Password *');
    this.zipCodeInput   = page.locator('#zip_code');
    this.addressInput   = page.locator('#streetAddress');
    this.aptSuiteInput  = page.locator('#unit_free_text');
    this.placeOrderBtn  = page.getByRole('button', { name: /Place Order/i });
    this.backBtn        = page.getByRole('button', { name: /back/i });
  }

  async expectLoaded() {
    await this.page.waitForURL(/\/checkout/);
    await expect(this.firstNameInput).toBeVisible();
  }

  async fillForm(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    zipCode: string;
    address: string;
    aptSuite?: string;
  }) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.phoneInput.fill(data.phone);
    await this.passwordInput.fill(data.password);
    await this.zipCodeInput.fill(data.zipCode);

    // Fill email with retry — check both focus AND inline error text.
    // "Email is already registered or Invalid" appears even when Tab moves focus away.
    let currentEmail = data.email;
    for (let attempt = 0; attempt < 5; attempt++) {
      await this.emailInput.click({ clickCount: 3 });
      await this.emailInput.fill(currentEmail);
      await this.emailInput.press('Tab');

      // Wait for server-side async validation round-trip
      await this.page.waitForTimeout(2000);

      const emailError = this.page.getByText(/already registered|invalid/i).first();
      const hasError = await emailError.isVisible().catch(() => false);
      if (!hasError) break;

      currentEmail = currentEmail.replace(/\+(\d+)@/, (_, n) => `+${parseInt(n) + 1}@`);
    }

    // Click address field — retry if email validation steals focus back.
    await retryWithBackoff(async () => {
      // Bail early if email still has an error (focus will snap back)
      const emailError = this.page.getByText(/already registered|invalid/i).first();
      if (await emailError.isVisible().catch(() => false)) {
        throw new Error('Email still has validation error — cannot focus address');
      }
      await this.addressInput.click();
      await this.page.waitForTimeout(300);
      const id = await this.page.evaluate(() => (document.activeElement as HTMLElement)?.id ?? '');
      if (id !== 'streetAddress') throw new Error('Address input not focused');
    }, 5, 500);

    await this.addressInput.fill('');
    await this.addressInput.pressSequentially(data.address, { delay: 60 });

    // Wait for Google Places API suggestions
    await this.page.waitForTimeout(1500);
    const suggestion = this.page.locator('[role="option"]').first();
    try {
      await suggestion.waitFor({ state: 'visible', timeout: 6000 });
      await suggestion.click();
      await this.page.waitForTimeout(500);
    } catch {
      // No suggestion — address stays as typed
    }

    if (data.aptSuite) {
      await this.aptSuiteInput.fill(data.aptSuite);
    }
  }

  async fillStripeCard(data: { cardNumber: string; expiry: string; cvc: string }) {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Stripe Payment Element unlocks after billing form is valid.
    // Poll across all Stripe iframes until the Card accordion button appears and click it.
    let accordionClicked = false;
    await waitUntil(async () => {
      const count = await this.page.locator('iframe[src*="stripe.com"]').count();
      for (let i = 0; i < count; i++) {
        try {
          const btn = this.page.frameLocator('iframe[src*="stripe.com"]').nth(i)
            .locator('[role="button"][data-value="card"]');
          if (await btn.count() > 0 && await btn.isVisible()) {
            await btn.click();
            accordionClicked = true;
            return true;
          }
        } catch { /* iframe not ready yet */ }
      }
      return false;
    }, 20000).catch(() => {
      throw new Error(
        `Card accordion not found after 20s. Stripe may still show "Complete your information above".`
      );
    });

    if (!accordionClicked) {
      throw new Error('Card accordion not clicked.');
    }

    // Wait for Stripe to render the card number input after accordion opens.
    await waitUntil(async () => {
      for (const frame of this.page.frames()) {
        try {
          if (await frame.locator('input[placeholder="1234 1234 1234 1234"]').count() > 0) return true;
        } catch { /* frame detached */ }
      }
      return false;
    }, 15000).catch(() => {
      throw new Error('Stripe card input not found after 15s.');
    });

    // Fill each Stripe field in whichever frame contains it
    for (const frame of this.page.frames()) {
      try {
        const cardInput   = frame.locator('input[placeholder="1234 1234 1234 1234"]');
        const expiryInput = frame.locator('input[placeholder="MM / YY"]');
        const cvcInput    = frame.locator('input[placeholder="CVC"]');
        if (await cardInput.count() > 0)   { await cardInput.click(); await cardInput.fill(data.cardNumber); }
        if (await expiryInput.count() > 0) { await expiryInput.click(); await expiryInput.fill(data.expiry); }
        if (await cvcInput.count() > 0)    { await cvcInput.click(); await cvcInput.fill(data.cvc); }
      } catch { /* frame detached */ }
    }
  }

  async clickPlaceOrder() {
    await this.placeOrderBtn.click();
  }

  async clickBack() {
    await this.backBtn.click();
  }

  async expectValidationErrors() {
    await expect(this.placeOrderBtn).toBeVisible();
    await expect(this.page).toHaveURL(/\/checkout/);
  }

  async expectStripeError() {
    const pageError = this.page.getByText(/declined|card was declined|payment failed/i);
    await expect(pageError).toBeVisible({ timeout: 10000 });
  }
}
