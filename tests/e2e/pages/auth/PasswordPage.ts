// tests/e2e/pages/auth/PasswordPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class PasswordPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly emailInput: Locator;
  readonly sendButton: Locator;
  readonly backToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading       = page.getByRole('heading', { name: /forgot password/i });
    this.emailInput    = page.getByLabel('Email');
    this.sendButton    = page.getByRole('button', { name: /send/i });
    this.backToLoginLink = page.getByRole('link', { name: /back to login/i });
  }

  async goto() {
    await this.page.goto('/password');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async clickSend() {
    await this.sendButton.click();
  }

  async clickBackToLogin() {
    await this.backToLoginLink.click();
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.sendButton).toBeVisible();
    await expect(this.backToLoginLink).toBeVisible();
  }

  async expectSendButtonEnabled() {
    await expect(this.sendButton).toBeEnabled();
  }
}
