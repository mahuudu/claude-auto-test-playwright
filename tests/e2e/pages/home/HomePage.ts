// tests/e2e/pages/home/HomePage.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  readonly heroHeading: Locator;
  readonly navPlans: Locator;
  readonly navPhones: Locator;
  readonly navCoverage: Locator;
  readonly navSupport: Locator;
  readonly navSignIn: Locator;
  readonly viewAllPlansLink: Locator;
  readonly shopPhonesLink: Locator;
  readonly discoverPlansHeading: Locator;
  readonly newsletterEmailInput: Locator;
  readonly newsletterSubscribeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading             = page.getByRole('heading', { name: /Stop Overpaying/i });
    this.navPlans                = page.getByRole('link', { name: 'Plans', exact: true }).first();
    this.navPhones               = page.getByRole('link', { name: 'Phones', exact: true }).first();
    this.navCoverage             = page.getByRole('link', { name: 'Coverage', exact: true }).first();
    this.navSupport              = page.getByRole('link', { name: 'Support', exact: true }).first();
    this.navSignIn               = page.getByRole('link', { name: 'Sign in', exact: true }).first();
    this.viewAllPlansLink        = page.getByRole('link', { name: /Check Out Our other attractive plans/i });
    this.shopPhonesLink          = page.getByRole('link', { name: 'View more phones' });
    this.discoverPlansHeading    = page.getByRole('heading', { name: 'Discover Our Plans' });
    this.newsletterEmailInput    = page.getByPlaceholder('Enter your Email');
    this.newsletterSubscribeButton = page.getByRole('button', { name: 'Subscribe' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async expectLoaded() {
    await expect(this.heroHeading).toBeVisible();
  }

  async clickNavPlans() {
    await this.navPlans.click();
  }

  async clickNavPhones() {
    await this.navPhones.click();
  }

  async clickNavCoverage() {
    await this.navCoverage.click();
  }

  async clickNavSupport() {
    await this.navSupport.click();
  }

  async clickNavSignIn() {
    await this.navSignIn.click();
  }

  async clickViewAllPlans() {
    await this.viewAllPlansLink.click();
  }

  async clickShopPhones() {
    await this.shopPhonesLink.click();
  }

  async fillNewsletterEmail(email: string) {
    await this.newsletterEmailInput.fill(email);
  }

  async clickSubscribe() {
    await this.newsletterSubscribeButton.click();
  }
}
