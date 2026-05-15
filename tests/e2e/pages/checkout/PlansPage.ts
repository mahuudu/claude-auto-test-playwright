import { Page, Locator, expect } from '@playwright/test';

export class PlansPage {
  readonly page: Page;

  readonly data1GBTab: Locator;
  readonly data3GBTab: Locator;
  readonly data6GBTab: Locator;
  readonly data10GBTab: Locator;
  readonly data12GBTab: Locator;
  readonly data16GBTab: Locator;
  readonly data25GBTab: Locator;
  readonly dataUnlimitedTab: Locator;
  readonly duration1MonthBtn: Locator;
  readonly duration3MonthsBtn: Locator;
  readonly duration6MonthsBtn: Locator;
  readonly simCardBtn: Locator;
  readonly esimBtn: Locator;
  readonly keepNumberToggle: Locator;
  readonly phoneNumberInput: Locator;
  readonly imeiInput: Locator;
  readonly buyNowBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.data1GBTab        = page.getByRole('tab', { name: '1GB' });
    this.data3GBTab        = page.getByRole('tab', { name: '3GB' });
    this.data6GBTab        = page.getByRole('tab', { name: '6GB', exact: true });
    this.data10GBTab       = page.getByRole('tab', { name: '10GB' });
    this.data12GBTab       = page.getByRole('tab', { name: '12GB' });
    this.data16GBTab       = page.getByRole('tab', { name: '16GB' });
    this.data25GBTab       = page.getByRole('tab', { name: '25GB' });
    this.dataUnlimitedTab  = page.getByRole('tab', { name: 'Unlimited' });
    this.duration1MonthBtn  = page.getByRole('button', { name: /1 Month/i }).first();
    this.duration3MonthsBtn = page.getByRole('button', { name: /3 Months/i }).first();
    this.duration6MonthsBtn = page.getByRole('button', { name: /6 Months/i }).first();
    this.simCardBtn        = page.getByRole('button', { name: /SIM Card/i }).first();
    this.esimBtn           = page.getByRole('button', { name: /eSIM/i }).first();
    this.keepNumberToggle  = page.getByText('Want to keep your phone number?');
    this.phoneNumberInput  = page.getByPlaceholder('Enter your phone number');
    this.imeiInput         = page.getByPlaceholder('Enter your IMEI number (14 to 16 digits)');
    this.buyNowBtn         = page.locator('button:has-text("Buy now")').first();
  }

  async goto() {
    await this.page.goto('/plans');
  }

  async selectDataPlan(amount: '1GB' | '3GB' | '6GB' | '10GB' | '12GB' | '16GB' | '25GB' | 'Unlimited') {
    const tabMap: Record<string, Locator> = {
      '1GB': this.data1GBTab,
      '3GB': this.data3GBTab,
      '6GB': this.data6GBTab,
      '10GB': this.data10GBTab,
      '12GB': this.data12GBTab,
      '16GB': this.data16GBTab,
      '25GB': this.data25GBTab,
      'Unlimited': this.dataUnlimitedTab,
    };
    await tabMap[amount].click();
  }

  async selectDuration(months: 1 | 3 | 6 | 12) {
    const durationMap: Record<number, Locator> = {
      1: this.duration1MonthBtn,
      3: this.duration3MonthsBtn,
      6: this.duration6MonthsBtn,
    };
    await durationMap[months].click();
  }

  async selectSimCard() {
    await this.simCardBtn.click();
  }

  async selectEsim(imei: string = '356661399035673') {
    await this.esimBtn.click();
    await this.imeiInput.waitFor({ state: 'visible' });
    await this.imeiInput.fill(imei);
  }

  async fillKeepNumber(phoneNumber: string, accountNumber = '123456789', pinNumber = '1234') {
    // Only click toggle if the input isn't already visible (avoid toggling OFF)
    const inputVisible = await this.phoneNumberInput.isVisible().catch(() => false);
    if (!inputVisible) {
      await this.keepNumberToggle.click();
    }
    await this.phoneNumberInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.phoneNumberInput.fill(phoneNumber);

    // Account Number and Pin Number are required for portability
    const accountInput = this.page.getByPlaceholder(/account number/i);
    const pinInput = this.page.getByPlaceholder(/pin number/i);
    if (await accountInput.isVisible().catch(() => false)) {
      await accountInput.fill(accountNumber);
    }
    if (await pinInput.isVisible().catch(() => false)) {
      await pinInput.fill(pinNumber);
    }
  }

  async clickBuyNow() {
    await this.buyNowBtn.waitFor({ state: 'visible' });
    await expect(this.buyNowBtn).toBeEnabled({ timeout: 10000 });

    // Retry up to 3 times — app may show "Reservation Failed: Phone number is already taken"
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.buyNowBtn.click();

      // Wait briefly for either navigation to /cart or a reservation failure modal
      const cartNav = this.page.waitForURL(/\/cart/, { timeout: 8000 }).then(() => 'cart').catch(() => null);
      const modal = this.page.getByText(/reservation failed/i).waitFor({ state: 'visible', timeout: 3000 }).then(() => 'modal').catch(() => null);

      const result = await Promise.race([cartNav, modal]);
      if (result === 'cart') return;

      // Modal appeared — click "Select Another" to get a new number and retry
      const selectAnother = this.page.getByRole('button', { name: /select another/i });
      if (await selectAnother.isVisible({ timeout: 2000 }).catch(() => false)) {
        await selectAnother.click();
        await this.buyNowBtn.waitFor({ state: 'visible', timeout: 5000 });
      }
    }

    // Final attempt — let the caller handle any remaining error
    await this.buyNowBtn.click();
  }

  async expectLoaded() {
    await this.page.waitForURL(/\/plans/);
    await this.data1GBTab.waitFor({ state: 'visible' });
  }
}
