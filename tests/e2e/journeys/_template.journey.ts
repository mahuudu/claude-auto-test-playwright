// tests/e2e/journeys/_template.journey.ts
import { test, expect } from '@playwright/test';
// import { SomePage } from '../pages/some/SomePage';
// import { AnotherPage } from '../pages/another/AnotherPage';

// Journey tests use serial mode — steps depend on each other
test.describe.serial('Journey: <Journey Name>', () => {

  // If journey requires auth, uncomment:
  // test.use({ storageState: 'auth.json' });

  test('JT-001: <happy path description>', async ({ page }) => {
    // Step 1 — <Page 1>
    // const page1 = new SomePage(page);
    // await page1.goto();
    // await page1.expectLoaded();
    // await page1.clickSomeAction();

    // Step 2 — <Page 2>
    // const page2 = new AnotherPage(page);
    // await page2.expectLoaded();
    // await page2.fillForm({ field: 'value' });
    // await page2.submit();

    // Final assertion
    // await expect(page).toHaveURL(/\/expected-url/);
  });

  test('JT-002: <variant or failure path>', async ({ page }) => {
    // ...
  });

});
