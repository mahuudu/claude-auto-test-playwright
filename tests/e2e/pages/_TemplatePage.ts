// tests/e2e/pages/_TemplatePage.ts
// Đây là template — copy file này, đổi tên thành <PageName>Page.ts và điền vào

import { Page, Locator, expect } from '@playwright/test';

export class TemplatePage {
  readonly page: Page;

  // --- Khai báo tất cả locators ở đây ---
  // Lấy từ docs/ui-map/<page>.ui-map.md
  readonly heading: Locator;
  readonly someButton: Locator;
  readonly someInput: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Điền locator thật từ UI map vào đây
    this.heading      = page.getByRole('heading', { level: 1 });
    this.someButton   = page.getByRole('button', { name: /button name/i });
    this.someInput    = page.getByLabel('Label name');
    this.errorMessage = page.getByText(/error text/i);
  }

  // goto() — luôn dùng path tương đối, baseURL đã set trong playwright.config.ts
  async goto() {
    await this.page.goto('/path-to-page');
  }

  // Các action methods — đặt tên theo hành động: click<X>, fill<X>, submit<X>
  async clickSomeButton() {
    await this.someButton.click();
  }

  async fillSomeInput(value: string) {
    await this.someInput.fill(value);
  }

  // Assertion methods — đặt tên theo trạng thái: expect<State>
  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }

  async expectErrorVisible() {
    await expect(this.errorMessage).toBeVisible();
  }
}
