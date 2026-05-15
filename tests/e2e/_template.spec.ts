// tests/e2e/_template.spec.ts
// Đây là template — copy file này, đổi tên thành <page>.spec.ts và điền vào

import { test, expect } from '@playwright/test';
import { TemplatePage } from './pages/_TemplatePage';

test.describe('<Tên trang — ví dụ: Sign In>', () => {

  // TC-001: Luôn bắt đầu bằng TC-ID
  test('TC-001: <mô tả ngắn — ví dụ: trang load thành công>', async ({ page }) => {
    const templatePage = new TemplatePage(page);
    await templatePage.goto();
    await templatePage.expectLoaded();
    // Thêm assertion nếu cần:
    // await expect(page).toHaveTitle(/Tên trang/);
  });

  test('TC-002: <mô tả ngắn>', async ({ page }) => {
    const templatePage = new TemplatePage(page);
    await templatePage.goto();
    // Thực hiện action:
    // await templatePage.clickSomeButton();
    // Kiểm tra kết quả:
    // await expect(page).toHaveURL(/\/expected-path/);
  });

  test('TC-003: <mô tả ngắn>', async ({ page }) => {
    const templatePage = new TemplatePage(page);
    await templatePage.goto();
    // ...
  });

});

// Quy tắc:
// - Mỗi test độc lập — không dùng biến/state từ test trước
// - Không dùng waitForTimeout() — dùng expect().toBeVisible() hoặc waitFor()
// - Không viết locator trực tiếp trong test — dùng Page Object
// - Tên test bắt đầu bằng TC-ID: 'TC-001: <mô tả>'
