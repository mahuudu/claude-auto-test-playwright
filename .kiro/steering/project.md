---
inclusion: always
---

# E2E Test Automation — Project Context

This project auto-generates Playwright E2E tests from URLs using a 9-step pipeline.

## Tech stack
- Playwright (TypeScript) for E2E testing
- Next.js frontend at BASE_URL (see .env)
- Custom JSON reporter → `reports/latest.json`
- React report viewer at `report-viewer/` (Vite, port 5174)

## Directory structure
```
docs/specs/<feature>/<page>.spec.md          ← test spec
docs/test-cases/<feature>/<page>.test-cases.md
docs/ui-map/<feature>/<page>.ui-map.md       ← verified locators
tests/e2e/<feature>/<page>.spec.ts           ← Playwright test file
tests/e2e/pages/<feature>/<Page>Page.ts      ← Page Object Model
reports/latest.json                          ← latest run results
test-results/                                ← screenshots, videos
```

## Feature naming rules
- login / signup / forgot-password / otp / password → feature = `auth`
- URL `/plans` → feature = `plans`
- URL `/account/profile` → feature = `account`, page = `profile`
- URL root `/` → feature = `home`, page = `home`

## Locator priority (always follow this order)
1. `getByRole` with name
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `locator('[data-testid="..."]')` — last resort only

## Rules
- Never use XPath, complex CSS selectors, or `waitForTimeout()`
- Screenshots always captured (pass and fail) — path always in report
- Each test is independent — no shared state between tests
- POM locators declared in constructor, never inline in test files
- Test names start with TC-ID: `'TC-001: description'`
