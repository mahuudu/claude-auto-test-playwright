// tests/e2e/auth/sign-in.spec.ts
import { test, expect } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import { SignInPage } from '../pages/auth/SignInPage';

test.describe('Sign In', () => {

  test('TC-001: trang sign-in load thành công với form đăng nhập', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.expectLoaded();
    await expect(page).toHaveTitle(/AirVoice/i);
    await expect(signIn.phoneEmailInput).toBeVisible();
    await expect(signIn.passwordInput).toBeVisible();
  });

  test('TC-002: tab "Account Login" active mặc định', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.expectAccountTabActive();
    await expect(signIn.phoneEmailInput).toBeVisible();
    await expect(signIn.passwordInput).toBeVisible();
  });

  test('TC-003: chuyển sang tab "OTP Login"', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.switchToOtpTab();
    await signIn.expectOtpTabActive();
  });

  test('TC-004: login với thông tin hợp lệ điều hướng đến dashboard', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.login('dma+199@softel.vn', '123456789');
    await expect(page).not.toHaveURL(/\/sign-in/);
  });

  test('TC-005: login với password sai hiển thị lỗi', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.login('user@example.com', 'wrongpassword123');
    await signIn.expectErrorVisible();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('TC-006: login với fields trống hiển thị validation', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.clickLogin();
    await expect(page).toHaveURL(/\/sign-in/);
  });

  test('TC-007: click "Forgot password?" điều hướng đến trang reset password', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.clickForgotPassword();
    await expect(page).not.toHaveURL(/\/sign-in/);
  });

  test('TC-008: social login buttons hiển thị đầy đủ', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await expect(signIn.googleButton).toBeVisible();
    await expect(signIn.facebookButton).toBeVisible();
    await expect(signIn.appleButton).toBeVisible();
  });

  test('TC-009: page passes accessibility audit', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.expectLoaded();
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

});
