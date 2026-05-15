// tests/e2e/pages/auth/SignInPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class SignInPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly accountLoginTab: Locator;
  readonly otpLoginTab: Locator;
  readonly phoneEmailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly forgotPasswordLink: Locator;
  readonly loginButton: Locator;
  readonly googleButton: Locator;
  readonly facebookButton: Locator;
  readonly appleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading            = page.getByRole('heading', { level: 1 });
    this.accountLoginTab    = page.getByRole('tab', { name: 'Account Login' });
    this.otpLoginTab        = page.getByRole('tab', { name: 'OTP Login' });
    this.phoneEmailInput    = page.getByLabel('Phone Number/Email');
    this.passwordInput      = page.getByLabel('Password');
    this.rememberMeCheckbox = page.getByLabel('Remember me');
    this.forgotPasswordLink = page.getByRole('link', { name: /Forgot password/i });
    this.loginButton        = page.getByRole('button', { name: 'Login' });
    this.googleButton       = page.getByRole('button', { name: 'Google' });
    this.facebookButton     = page.getByRole('button', { name: 'Facebook' });
    this.appleButton        = page.getByRole('button', { name: 'Apple' });
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  async fillCredentials(phoneOrEmail: string, password: string) {
    await this.phoneEmailInput.fill(phoneOrEmail);
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(phoneOrEmail: string, password: string) {
    await this.fillCredentials(phoneOrEmail, password);
    await this.clickLogin();
  }

  async switchToOtpTab() {
    await this.otpLoginTab.click();
  }

  async switchToAccountTab() {
    await this.accountLoginTab.click();
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async expectAccountTabActive() {
    await expect(this.accountLoginTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectOtpTabActive() {
    await expect(this.otpLoginTab).toHaveAttribute('aria-selected', 'true');
  }

  async expectErrorVisible() {
    await expect(
      this.page.getByRole('alert').or(this.page.getByText(/invalid|incorrect|wrong|error/i))
    ).toBeVisible();
  }
}
