// tests/e2e/auth/password.spec.ts
import { test, expect } from '@playwright/test';
import { PasswordPage } from '../pages/auth/PasswordPage';

test.describe('Forgot Password', () => {

  test('TC-001: page loads with correct heading and form elements', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.expectLoaded();
  });

  test('TC-002: submit with valid email shows success feedback', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.fillEmail('test@example.com');
    await passwordPage.clickSend();
    // After submitting a valid email, expect a success indicator (message or redirect)
    await expect(page.getByText(/check your email|sent|success|instructions/i).or(
      page.getByRole('heading', { name: /check your email|email sent/i })
    )).toBeVisible({ timeout: 10000 });
  });

  test('TC-003: submit with empty email shows validation error', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.clickSend();
    await expect(page.getByText(/required|please enter|email is required/i)).toBeVisible();
  });

  test('TC-004: submit with invalid email format shows validation error', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.fillEmail('notanemail');
    await passwordPage.clickSend();
    // App shows "Please enter your email" for both empty and invalid format (custom React validation)
    await expect(page.getByText(/please enter your email/i)).toBeVisible();
  });

  test('TC-005: back to login link navigates to sign-in page', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.clickBackToLogin();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('TC-006: send button is visible and enabled', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.expectSendButtonEnabled();
  });

  test('TC-007: email input accepts text input', async ({ page }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.fillEmail('user@airvoice.com');
    await expect(passwordPage.emailInput).toHaveValue('user@airvoice.com');
  });

});
