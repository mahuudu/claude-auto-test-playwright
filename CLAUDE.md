# CLAUDE.md — Auto Test Project

## Mục tiêu
Tự động sinh Playwright E2E tests từ URL theo pipeline:
`crawl → spec → test-cases → ui-map → page object → test → run → json report → slack alert`

---

## Cấu trúc thư mục — không được thay đổi

Files được tổ chức theo **feature folder**. `<feature>` là tên domain (ví dụ: `auth`, `plans`, `phones`, `checkout`). Lấy từ argument khi gọi `/e2e <feature> <page>`, hoặc suy ra từ URL path nếu không có argument.

```
project/
├── docs/
│   ├── crawl/
│   │   └── <feature>/
│   │       └── <page>/
│   │           ├── screenshot.png             ← ảnh chụp toàn trang khi crawl
│   │           ├── raw-html.txt               ← HTML thô (20KB đầu)
│   │           └── crawl-data.json            ← output phân tích của Claude
│   ├── specs/
│   │   ├── <feature>/
│   │   │   └── <page>.spec.md             ← đặc tả test (tạo ở bước 2)
│   │   └── journeys/
│   │       └── <journey-name>.spec.md     ← journey spec (tạo bởi /e2e-journey)
│   ├── test-cases/
│   │   ├── <feature>/
│   │   │   └── <page>.test-cases.md       ← manual test cases chi tiết (bước 3)
│   │   └── journeys/
│   │       └── <journey-name>.test-cases.md
│   └── ui-map/
│       └── <feature>/
│           └── <page>.ui-map.md           ← locator map từ Playwright MCP (bước 5)
├── tests/
│   └── e2e/
│       ├── <feature>/
│       │   └── <page>.spec.ts             ← test files theo feature
│       ├── journeys/
│       │   └── <journey-name>.spec.ts     ← multi-page journey tests
│       ├── pages/
│       │   └── <feature>/
│       │       └── <Page>Page.ts          ← Page Object Model theo feature
│       ├── fixtures/
│       │   └── index.ts                   ← shared fixtures
│       └── _template.spec.ts              ← template (không xóa)
├── scripts/
│   ├── crawl.js                           ← crawl URL → docs/crawl/<feature>/<page>/
│   ├── make-json-report.js                ← in tóm tắt từ reports/latest.json
│   ├── send-alert.js                      ← gửi Slack alert
│   └── reporter.ts                        ← custom Playwright reporter
├── reports/
│   ├── latest.json                        ← luôn là kết quả run mới nhất
│   └── run-<timestamp>.json               ← lưu lịch sử từng run
├── test-results/                          ← Playwright tạo tự động (screenshot, video, trace)
├── playwright-report/                     ← Playwright HTML report
├── playwright.config.ts
├── .env
└── CLAUDE.md
```

### Quy tắc xác định `<feature>` và `<page>`

| Argument | feature | page |
|----------|---------|------|
| `/e2e auth sign-in` | `auth` | `sign-in` |
| `/e2e plans` | `plans` | `plans` (lấy từ URL path) |
| `/e2e` (không arg) | suy từ URL path segment đầu tiên | suy từ URL path segment cuối |

Ví dụ URL `https://site.com/account/profile` → feature=`account`, page=`profile`
URL root `/` → feature=`home`, page=`home`

---

## Skills — dùng skill phù hợp với từng giai đoạn

| Skill | Khi nào dùng |
|-------|-------------|
| `/e2e <feature> <page>` | Full pipeline 9 bước tự động, không dừng |
| `/e2e-spec <feature> <page>` | Chỉ bước 1–3 (crawl + spec + test-cases), **dừng để review** |
| `/setup-data <feature> <page>` | Chuẩn bị credentials, fixtures, env vars trước khi build |
| `/e2e-build <feature> <page>` | Bước 4–9 từ spec đã review (inspect → POM → test → run → report) |
| `/e2e-run [feature] [page]` | Tìm và chạy test files đã có sẵn theo feature (hoặc tất cả), sửa lỗi, báo cáo |
| `/e2e-journey <name> <f1>/<p1> <f2>/<p2> ...` | Tạo và chạy journey test qua nhiều page (yêu cầu POMs đã có) |
| `/fix-test` | Sửa test đang fail từ latest report |
| `/add-tc <feature> <page>` | Thêm TC mới vào spec + test file có sẵn |
| `/update-spec <feature> <page>` | Re-crawl + patch **chỉ spec** khi UI thay đổi, **dừng để review** — KHÔNG tự cập nhật test-cases hay chạy test |
| `/update-data <feature> <page>` | Cập nhật credentials, fixtures, env vars khi test data thay đổi |
| `/check-locators <feature> <page>` | Kiểm tra locators sau khi UI thay đổi |
| `/smoke` | Chạy chỉ High priority tests (sanity check trước deploy) |
| `/report` | In kết quả run mới nhất |
| `/cleanup` | Dọn test-results, playwright-report, run reports cũ |

### Recommended workflow (có review)

```
/e2e-spec <feature> <page>     ← bước 1–3, dừng để review
  → review + sửa spec/test-cases
/setup-data <feature> <page>   ← nếu cần credentials/fixtures
/e2e-build <feature> <page>    ← bước 4–9, chạy và fix
```

### Quick workflow (không cần review)

```
/e2e <feature> <page>          ← full 9 bước tự động
```

### Journey workflow (multi-page flow)

```
# Bước 1: build từng page trước
/e2e-spec home home            ← crawl + spec + test-cases
/e2e-build home home           ← inspect + POM + test + run
/e2e-spec plans plans
/e2e-build plans plans
/e2e-spec cart cart
/e2e-build cart cart
/e2e-spec checkout checkout
/e2e-build checkout checkout

# Bước 2: tạo journey test
/e2e-journey purchase-flow home/home plans/plans cart/cart checkout/checkout
```

---

## Workflow chi tiết — 9 bước

```
1. crawl        TARGET_URL=<url> FEATURE=<feature> PAGE=<page> node scripts/crawl.js
                → docs/crawl/<feature>/<page>/screenshot.png + raw-html.txt
                Claude đọc ảnh + HTML → tự viết docs/crawl/<feature>/<page>/crawl-data.json
2. spec         đọc docs/crawl/<feature>/<page>/crawl-data.json → tạo docs/specs/<feature>/<page>.spec.md
3. test-cases   đọc spec → tạo docs/test-cases/<feature>/<page>.test-cases.md
                ⏸ /e2e-spec dừng ở đây để review
4. inspect      dùng Playwright MCP inspect UI thật
5. ui-map       lưu locators → docs/ui-map/<feature>/<page>.ui-map.md
6. pom          đọc spec + ui-map → tạo tests/e2e/pages/<feature>/<Page>Page.ts
7. test         đọc spec + test-cases + POM → tạo tests/e2e/<feature>/<page>.spec.ts
8. run          npx playwright test tests/e2e/<feature>/<page>.spec.ts
9. report       node scripts/make-json-report.js → fix nếu fail → node scripts/send-alert.js
```

---

## Bước 2 · Spec template — luôn dùng đúng format này

```markdown
# <Page Name> — Test Spec

## Meta
- URL: <full url>
- Created: <date>
- Priority: High | Medium | Low

## Phạm vi kiểm tra
- <mô tả ngắn page này làm gì>

## Test Cases

### TC-001: <tên ngắn gọn>
- **Mục tiêu:** <kiểm tra cái gì>
- **Điều kiện:** <trạng thái ban đầu>
- **Các bước:**
  1. <bước 1>
  2. <bước 2>
- **Kết quả mong đợi:** <expect gì>
- **Priority:** High | Medium | Low

### TC-002: ...
```

Mỗi page/feature = 1 file spec. Ví dụ:
- `docs/specs/auth/sign-in.spec.md`
- `docs/specs/auth/forgot-password.spec.md`
- `docs/specs/plans/plans.spec.md`
- `docs/specs/checkout/checkout.spec.md`

Crawl data tương ứng nằm ở:
- `docs/crawl/auth/sign-in/crawl-data.json`
- `docs/crawl/plans/plans/crawl-data.json`

---

## Bước 3 · Test Cases template — luôn dùng đúng format này

```markdown
# <Page Name> — Manual Test Cases

## Meta
- Spec: docs/specs/<feature>/<page>.spec.md
- Created: <date>

## TC-001: <tên ngắn gọn>

### Happy path
- **Input:** <dữ liệu hợp lệ>
- **Steps:** <các bước>
- **Expected:** <kết quả mong đợi>

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Empty field | (bỏ trống) | Hiện lỗi validation |
| Invalid format | abc@  | "Email không hợp lệ" |
| Max length | 256 ký tự | Bị giới hạn hoặc báo lỗi |

### Failure classification guide
- `app bug` — UI/logic sai so với spec
- `test bug` — assertion hoặc flow test sai
- `selector issue` — locator không tìm thấy element
- `flaky` — pass/fail không nhất quán
- `environment issue` — mạng, server, config

## TC-002: ...
```

---

## Bước 5 · UI Map template — luôn dùng đúng format này

```markdown
# <Page Name> — UI Map

## Meta
- URL: <full url>
- Inspected: <date>
- Tool: Playwright MCP

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { level: 1 })` | |
| Login button | `page.getByRole('link', { name: /login/i })` | |
| Email input | `page.getByLabel('Email')` | |
| Password input | `page.getByPlaceholder('Enter password')` | |
| Submit button | `page.getByRole('button', { name: /sign in/i })` | |
| Error message | `page.getByText(/invalid credentials/i)` | Chỉ hiện khi login fail |

## Navigation flows

| Action | Result URL |
|--------|-----------|
| Click Login | /login |
| Submit valid form | /dashboard |
| Submit invalid form | /login (stay) |
```

---

## Bước 6 · Page Object template — luôn dùng đúng format này

```typescript
// tests/e2e/pages/auth/SignInPage.ts
import { Page, Locator, expect } from '@playwright/test';

export class SignInPage {
  readonly page: Page;

  // Locators — khai báo hết ở đây, không viết inline trong test
  readonly heading: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading     = page.getByRole('heading', { level: 1 });
    this.loginButton = page.getByRole('button', { name: /login/i });
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async expectLoaded() {
    await expect(this.heading).toBeVisible();
  }
}
```

Quy tắc:
- 1 class = 1 page
- File đặt trong `tests/e2e/pages/<feature>/<Page>Page.ts`
- Tất cả locators khai báo trong constructor, lấy từ `docs/ui-map/<feature>/<page>.ui-map.md`
- Methods đặt tên theo hành động: `goto`, `click<X>`, `fill<X>`, `expect<State>`
- Không viết `expect()` trong constructor, chỉ trong methods

---

## Bước 7 · Test file template — luôn dùng đúng format này

```typescript
// tests/e2e/auth/sign-in.spec.ts
import { test, expect } from '@playwright/test';
import { SignInPage } from '../pages/auth/SignInPage';

test.describe('Sign In', () => {

  test('TC-001: page loads with correct title', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.expectLoaded();
    await expect(page).toHaveTitle(/Your Site Name/);
  });

  test('TC-002: login button navigates to login page', async ({ page }) => {
    const signIn = new SignInPage(page);
    await signIn.goto();
    await signIn.clickLogin();
    await expect(page).toHaveURL(/\/login/);
  });

});
```

Quy tắc:
- File đặt trong `tests/e2e/<feature>/<page>.spec.ts`
- Import POM từ `../pages/<feature>/<Page>Page`
- Tên test bắt đầu bằng TC-ID: `'TC-001: <mô tả>'`
- Mỗi test độc lập — không phụ thuộc test trước
- Không dùng `waitForTimeout()` — dùng `expect().toBeVisible()` hoặc `waitFor()`
- Import Page Object, không viết locator trực tiếp trong test

---

## Journey spec template — dùng cho /e2e-journey

```markdown
# <Journey Name> — Journey Spec

## Meta
- Journey: <journey-name>
- Pages: <feature1>/<page1> → <feature2>/<page2> → ...
- Created: <date>
- Priority: High

## Mô tả flow
<Mô tả ngắn toàn bộ hành trình người dùng>

## Test Data
- Account: <email / guest>
- Plan: <tên plan nếu có>
- Form fields: <các trường cần điền>

## Journey Test Cases

### JT-001: <happy path>
- **Mục tiêu:** Hoàn thành toàn bộ flow từ <page đầu> đến <page cuối>
- **Điều kiện:** <trạng thái ban đầu, đã login hay chưa>
- **Các bước:**
  1. Mở <page1>, kiểm tra <element>
  2. Click <action>, chuyển sang <page2>
  3. ...
- **Kết quả mong đợi:** <URL cuối, message xác nhận, v.v.>
- **Priority:** High

### JT-002: <auth variant hoặc failure path>
...
```

---

## Journey test file template — dùng cho /e2e-journey

```typescript
// tests/e2e/journeys/purchase-flow.spec.ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/home/HomePage';
import { PlansPage } from '../pages/plans/PlansPage';
import { CartPage } from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';

// serial: tests trong journey chạy theo thứ tự, không song song
test.describe.serial('Purchase Flow', () => {

  test('JT-001: complete purchase flow as guest', async ({ page }) => {
    const home = new HomePage(page);
    const plans = new PlansPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await home.goto();
    await home.expectLoaded();

    await home.clickPlans();
    await plans.expectLoaded();
    await plans.selectPlan('Basic');

    await cart.expectLoaded();
    await cart.proceedToCheckout();

    await checkout.expectLoaded();
    await checkout.fillForm({ name: 'Test User', email: 'test@example.com' });
    await checkout.submit();

    await expect(page).toHaveURL(/\/confirmation|\/success/);
  });

  test('JT-002: purchase flow requires login when not authenticated', async ({ page }) => {
    // ...
  });

});
```

Quy tắc journey test:
- File đặt trong `tests/e2e/journeys/<journey-name>.spec.ts`
- Dùng `test.describe.serial` — tests KHÔNG độc lập, chạy theo thứ tự
- Prefix `JT-` thay vì `TC-`
- Import tất cả POM cần thiết
- Không viết locator trực tiếp trong test

---

## Bước 9 · JSON Report schema — đây là format của reports/latest.json

```json
{
  "runId": "run-20260513-093000",
  "timestamp": "2026-05-13T09:30:00.000Z",
  "environment": {
    "baseUrl": "https://your-site.com",
    "browser": "chromium",
    "os": "darwin"
  },
  "summary": {
    "total": 12,
    "passed": 10,
    "failed": 2,
    "skipped": 0,
    "duration": 45230,
    "passRate": "83.3%"
  },
  "suites": [
    {
      "name": "Sign In",
      "file": "tests/e2e/auth/sign-in.spec.ts",
      "specFile": "docs/specs/auth/sign-in.spec.md",
      "tests": [
        {
          "id": "TC-001",
          "title": "page loads with correct title",
          "status": "passed",
          "duration": 1240,
          "retries": 0,
          "screenshot": "test-results/TC-001-sign-in.png",
          "error": null
        },
        {
          "id": "TC-002",
          "title": "login button navigates to login page",
          "status": "failed",
          "duration": 3100,
          "retries": 1,
          "screenshot": "test-results/TC-002-failed.png",
          "error": {
            "message": "Expected URL to contain '/login'",
            "expected": "/login",
            "received": "/auth/signin"
          }
        }
      ]
    }
  ]
}
```

Trường quan trọng:
- `runId` → so sánh lịch sử các run
- `specFile` → trace ngược từ test fail về spec gốc (`docs/specs/<feature>/`)
- `screenshot` → **luôn có path** (cả pass lẫn fail), không bao giờ null
- `error.expected` / `error.received` → đủ data để tự fix

---

## Locator convention — theo thứ tự ưu tiên

```
1. getByRole('button', { name: '...' })
2. getByLabel('...')
3. getByPlaceholder('...')
4. getByText('...')
5. locator('[data-testid="..."]')   ← chỉ dùng khi không còn cách nào khác
```

Tuyệt đối không dùng:
- CSS selector phức tạp: `.main > div:nth-child(2) > span`
- XPath
- `page.waitForTimeout()`

---

## playwright.config.ts — cấu hình hiện tại

```typescript
// ENV flag chọn file .env: ENV=dev (default) | staging | prod
// Chạy: ENV=staging npx playwright test
import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${env}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') }); // fallback

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  globalSetup: './tests/globalSetup.ts',
  reporter: [
    ['./scripts/reporter.ts'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'on',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  retries: 1,
  projects: [
    { name: 'setup', testMatch: '**/auth.setup.ts' },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  ],
});
```

---

## Environment — multi-env

Dùng file `.env.<env>` thay vì `.env` trực tiếp:

| File | Mục đích |
|------|----------|
| `.env.dev` | Dev/local (có sẵn credentials) |
| `.env.staging` | Staging (điền trước khi dùng) |
| `.env.prod` | Production (điền trước khi dùng) |
| `.env.example` | Template — commit vào git, không có credentials thật |
| `.env` | Fallback legacy — không override nếu `.env.<env>` đã load |

```
TARGET_URL=https://your-site.com/sign-in
BASE_URL=https://your-site.com/
TEST_USER_EMAIL=your-test-account@example.com
TEST_USER_PASSWORD=your-test-password
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...   ← tuỳ chọn
```

---

## Auth session — storageState

`tests/e2e/auth.setup.ts` login 1 lần, lưu session vào `.auth/user.json`.
`tests/e2e/fixtures/auth.fixture.ts` tái dùng session đó — không login lại mỗi test.

```
.auth/user.json   ← KHÔNG commit (đã có trong .gitignore)
```

Khi cần test với user đã đăng nhập, import `testWithAuth` từ fixtures:

```typescript
import { testWithAuth as test, expect } from '../fixtures';

test('TC-001: dashboard loads', async ({ authenticatedPage: page }) => {
  await expect(page).not.toHaveURL(/\/sign-in/);
});
```

---

## Test data & fixtures convention

Test accounts được định nghĩa trong `tests/e2e/fixtures/test-data/users.ts`:

```typescript
export const users = {
  standard: {
    email: process.env.TEST_USER_EMAIL || 'fallback@example.com',
    password: process.env.TEST_USER_PASSWORD || 'fallback-password',
  },
  invalid: { email: 'user@example.com', password: 'wrongpassword123' },
};
```

Quy tắc:
- Thêm loại user mới vào `users.ts`, không hardcode trong test file
- Credentials thật đặt trong `.env.dev` / `.env.staging` (không commit)
- **Không có automated teardown** — side effects (đơn hàng test, user test) phải cleanup thủ công
- Nếu test tạo dữ liệu thật trên staging, ghi chú rõ trong test file để cleanup sau

---

## Reporter contract — KHÔNG tái tạo các file này

`scripts/reporter.ts`, `scripts/send-alert.js`, `scripts/make-json-report.js` đã được implement đầy đủ.
**Không viết lại.** Nếu có lỗi, đọc file trước rồi chỉ patch phần bị lỗi.

Schema của `reports/latest.json`:

```json
{
  "runId": "run-2026-05-14T04-15-55",
  "timestamp": "<ISO 8601>",
  "environment": { "baseUrl": "", "browser": "chromium", "os": "win32" },
  "summary": {
    "total": 0, "passed": 0, "failed": 0, "skipped": 0,
    "duration": 0, "passRate": "0%"
  },
  "suites": [{
    "name": "<describe block name>",
    "file": "tests/e2e/<feature>/<page>.spec.ts",
    "specFile": "docs/specs/<feature>/<page>.spec.md",
    "tests": [{
      "id": "TC-001",
      "title": "TC-001: description",
      "status": "passed|failed|skipped|timedOut",
      "duration": 2079,
      "retries": 0,
      "screenshot": "test-results/.../test-finished-1.png",
      "error": { "message": "", "expected": "", "received": "" }
    }]
  }]
}
```

---

## crawl-data.json schema — luôn dùng đúng shape này

`scripts/crawl.js` tự động tạo skeleton. Claude điền vào các trường phân tích.
Schema TypeScript canonical: `scripts/crawl-data.types.ts`.

```json
{
  "crawledAt": "<ISO 8601>",
  "url": "<full url>",
  "title": "<document.title>",
  "metaDescription": "",
  "pageType": "landing|login|dashboard|product|blog|checkout|other",
  "purpose": "",
  "headings": [{ "level": "H1", "text": "" }],
  "interactiveElements": {
    "buttons": [{ "text": "", "purpose": "" }],
    "links": [{ "text": "", "href": "", "purpose": "" }],
    "inputs": [{ "type": "", "label": "", "placeholder": "" }],
    "forms": [{ "purpose": "", "fields": [] }]
  },
  "keyFeatures": [],
  "testableScenarios": [],
  "potentialIssues": []
}
```

---

## CI/CD — GitHub Actions

File: `.github/workflows/e2e.yml`

Triggers: push/PR to `main`, manual dispatch (chọn env: dev | staging).

Required GitHub secrets:
- `BASE_URL_dev`, `BASE_URL_staging`
- `TEST_USER_EMAIL_dev`, `TEST_USER_EMAIL_staging`
- `TEST_USER_PASSWORD_dev`, `TEST_USER_PASSWORD_staging`
- `SLACK_WEBHOOK_URL`

Artifacts (7 ngày): `test-results/`, `playwright-report/`, `reports/`

---

## Shared helpers — tests/e2e/helpers.ts

Utility functions dùng chung cho tất cả test files. Import từ `../helpers` (relative từ spec file).

| Function | Dùng khi |
|----------|----------|
| `retryWithBackoff(fn, maxRetries, initialDelay)` | Retry async operation với exponential backoff — flaky clicks, network-dependent UI |
| `waitUntil(condition, timeoutMs, intervalMs)` | Poll cho đến khi condition trả về true — thay thế `waitForTimeout` |
| `safeClick(locator, maxRetries)` | Click với auto visibility wait + retry |
| `safeType(locator, text, { clear, delay })` | Fill input, optionally clear trước hoặc type chậm |
| `handleCookieBanner(page)` | Click accept button của cookie banner nếu có — safe nếu không có banner |

```typescript
import { retryWithBackoff, waitUntil, safeClick, safeType } from '../../helpers';

// Thay vì waitForTimeout:
await waitUntil(async () => {
  const id = await page.evaluate(() => document.activeElement?.id ?? '');
  return id !== 'email';
}, 3000);

// Thay vì manual retry loop:
await retryWithBackoff(async () => {
  await locator.click();
  if (!(await locator.isVisible())) throw new Error('not visible');
}, 3, 500);
```

---

## Accessibility testing — AxeBuilder

Mỗi page quan trọng nên có 1 TC accessibility. Dùng `@axe-core/playwright`.

```typescript
import { AxeBuilder } from '@axe-core/playwright';

test('TC-00X: page passes accessibility audit', async ({ page }) => {
  // goto + expectLoaded trước
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

Nếu app có violations thật (không phải test bug) → dùng `.exclude()` để bỏ qua element cụ thể và ghi chú lý do:

```typescript
const results = await new AxeBuilder({ page })
  .exclude('#third-party-widget') // third-party, không kiểm soát được
  .analyze();
```

Pages đã có accessibility TC: `home`, `plans`, `auth/sign-in`, `cart`, `checkout`.

---

## Visual regression — toHaveScreenshot

Dùng để catch UI regressions không có assertion rõ ràng.

```typescript
// Lần đầu chạy — tạo baseline:
// npx playwright test --update-snapshots

test('TC-00X: hero section matches visual snapshot', async ({ page }) => {
  await home.goto();
  await home.expectLoaded();
  await expect(page).toHaveScreenshot('home-hero.png', { fullPage: false });
});
```

Config trong `playwright.config.ts`:
```typescript
expect: {
  toHaveScreenshot: {
    maxDiffPixels: 100,   // cho phép tối đa 100 pixel khác
    threshold: 0.2,       // 20% color difference per pixel
    animations: 'disabled',
  },
}
```

Snapshots lưu tại: `tests/e2e/<feature>/<page>.spec.ts-snapshots/`

Khi UI thay đổi có chủ ý → chạy `npx playwright test --update-snapshots` để cập nhật baseline.

Pages đã có visual snapshot: `home` (hero), `plans` (full page), `cart` (empty state).

---

## Khi được yêu cầu "tạo test cho URL X"

Làm đúng 9 bước theo thứ tự. Sau bước 9 nếu có test fail:
1. Đọc `error.message` + `error.expected` + `error.received` trong `reports/latest.json`
2. Mở file `screenshot` tương ứng nếu có
3. Trace về `specFile` (`docs/specs/`) để hiểu intent ban đầu
4. Phân loại lỗi: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`
5. Sửa Page Object hoặc test file
6. Chạy lại `npx playwright test`
7. Lặp đến khi `summary.failed === 0`
8. Chạy `node scripts/send-alert.js` để gửi kết quả cuối cùng
