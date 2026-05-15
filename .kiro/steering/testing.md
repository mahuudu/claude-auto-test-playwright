---
inclusion: fileMatch
fileMatch: "tests/e2e/**/*.spec.ts,tests/e2e/pages/**/*.ts"
---

# Playwright Test & POM Conventions

## Page Object Model (tests/e2e/pages/<feature>/<Page>Page.ts)
- One class per page
- All locators declared in constructor — never inline in tests
- Methods named by action: `goto()`, `click<X>()`, `fill<X>()`, `expect<State>()`
- `goto()` uses relative path — baseURL set in playwright.config.ts
- No `expect()` calls in constructor

## Test file (tests/e2e/<feature>/<page>.spec.ts)
- Import POM from `../pages/<feature>/<Page>Page`
- Test names: `'TC-001: description'`
- Each test is fully independent
- No `waitForTimeout()` — use `expect(...).toBeVisible()` or `waitFor()`
- No locators written directly in test file

## Running tests
```
npx playwright test tests/e2e/<feature>/<page>.spec.ts
npx playwright test tests/e2e/<feature>/<page>.spec.ts --grep "TC-001"
```

## After test run
```
node scripts/make-json-report.js   ← print summary
node scripts/send-alert.js         ← send Slack alert (if SLACK_WEBHOOK_URL set)
```
Report always saved to `reports/latest.json` and `reports/run-<timestamp>.json`.
