// tests/e2e/pages/plans/PlansPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class PlansPage {
  readonly page: Page;

  readonly heading: Locator;
  readonly tab1GB: Locator;
  readonly tab3GB: Locator;
  readonly tab6GB: Locator;
  readonly tab10GB: Locator;
  readonly tabUnlimited: Locator;
  readonly simCardOption: Locator;
  readonly esimOption: Locator;
  readonly phoneNumberInput: Locator;
  readonly buyNowButton: Locator;
  readonly familyPlanHeading: Locator;
  readonly faqHeading: Locator;
  readonly firstFaqItem: Locator;

  constructor(page: Page) {
    this.page              = page;
    this.heading           = page.getByRole('heading', { name: /Discover Flexible Plan Options Today/i });
    this.tab1GB            = page.getByRole('tab', { name: /1GB/i });
    this.tab3GB            = page.getByRole('tab', { name: /3GB/i });
    this.tab6GB            = page.getByRole('tab', { name: /^6GB$/ });
    this.tab10GB           = page.getByRole('tab', { name: /10GB/i });
    this.tabUnlimited      = page.getByRole('tab', { name: /Unlimited/i });
    this.simCardOption     = page.getByRole('button', { name: /SIM Card/i }).first();
    this.esimOption        = page.getByRole('button', { name: /eSIM/i }).first();
    this.phoneNumberInput  = page.getByPlaceholder('(###) ###-####');
    this.buyNowButton      = page.getByText('Buy now', { exact: true });
    this.familyPlanHeading = page.getByRole('heading', { name: /Save More As A Family/i });
    this.faqHeading        = page.getByRole('heading', { name: /FAQs/i });
    this.firstFaqItem      = page.getByRole('button', { name: 'Do I have AirVoice coverage in my area?' });
  }

  async goto() {
    await this.page.goto('/plans');
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async clickTab1GB() {
    await this.tab1GB.click();
  }

  async clickTab3GB() {
    await this.tab3GB.click();
  }

  async clickTab6GB() {
    await this.tab6GB.click();
  }

  async clickTab10GB() {
    await this.tab10GB.click();
  }

  async clickTabUnlimited() {
    await this.tabUnlimited.click();
  }

  async selectSimCard() {
    await this.simCardOption.click();
  }

  async selectEsim() {
    await this.esimOption.click();
  }

  async fillPhoneNumber(number: string) {
    await this.phoneNumberInput.fill(number);
  }

  async clickBuyNow() {
    await this.buyNowButton.click();
  }

  async clickFirstFaq() {
    await this.firstFaqItem.click();
  }
}
