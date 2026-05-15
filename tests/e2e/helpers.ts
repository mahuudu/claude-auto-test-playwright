import { Page, Locator } from '@playwright/test';

/**
 * Retry an async operation with exponential backoff.
 * Use for flaky interactions (network-dependent UI, animations).
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 500,
): Promise<T> {
  let lastError: Error = new Error('retryWithBackoff: no attempts made');
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err as Error;
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, initialDelay * Math.pow(2, i)));
      }
    }
  }
  throw lastError;
}

/**
 * Wait for a condition to become true, polling at a fixed interval.
 * Throws if the condition is not met within timeoutMs.
 */
export async function waitUntil(
  condition: () => Promise<boolean>,
  timeoutMs = 20000,
  intervalMs = 400,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await condition()) return;
    await new Promise(r => setTimeout(r, intervalMs));
  }
  throw new Error(`waitUntil: condition not met within ${timeoutMs}ms`);
}

/**
 * Click a locator with automatic visibility wait and retry.
 */
export async function safeClick(locator: Locator, maxRetries = 3): Promise<void> {
  await retryWithBackoff(async () => {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }, maxRetries);
}

/**
 * Fill a locator, optionally clearing first or using slow key-by-key typing.
 */
export async function safeType(
  locator: Locator,
  text: string,
  options: { clear?: boolean; delay?: number } = {},
): Promise<void> {
  await locator.waitFor({ state: 'visible' });
  if (options.clear) await locator.clear();
  if (options.delay) {
    await locator.pressSequentially(text, { delay: options.delay });
  } else {
    await locator.fill(text);
  }
}

/**
 * Click the first visible cookie/consent banner accept button.
 * Safe to call even if no banner is present.
 */
export async function handleCookieBanner(page: Page): Promise<void> {
  const selectors = [
    'button:has-text("Accept")',
    'button:has-text("Accept All")',
    'button:has-text("I agree")',
    'button:has-text("OK")',
    '[aria-label*="accept" i]',
  ];
  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click();
        return;
      }
    } catch { /* not found — try next */ }
  }
}
