# Auto E2E Test — Hướng dẫn sử dụng

> **Dành cho:** Người mới bắt đầu, chưa biết project này làm gì  
> **Mục tiêu:** Hiểu toàn bộ flow và biết cách tự tạo test cho một trang web bất kỳ

---

## 1. Project này làm gì?

Project này giúp bạn **tự động tạo Playwright E2E test** cho một trang web chỉ bằng cách cung cấp URL.

Thay vì ngồi tự viết test từ đầu, bạn chỉ cần:
1. Cấu hình URL trong file `.env.dev`
2. Gọi skill trong Claude Code
3. Claude tự chạy hết pipeline và sinh ra toàn bộ tài liệu + code test
4. Chạy test → xem kết quả → nhận alert Slack (nếu cấu hình)

Pipeline tổng thể:
```
crawl → spec → test-cases → ui-map → POM → test → run → json report → slack alert
```

---

## 2. Yêu cầu

| Công cụ | Phiên bản tối thiểu |
|---------|-------------------|
| Node.js | 18+ |
| Claude Code CLI | bất kỳ |
| Playwright MCP | xem bên dưới |

---

## 3. Cài đặt lần đầu

### Bước 1 — Cài dependencies

```bash
npm install
npx playwright install chromium
```

### Bước 2 — Thêm Playwright MCP vào Claude Code

```bash
claude mcp add playwright -- cmd /c npx -y @playwright/mcp@latest
```

Kiểm tra:
```bash
claude mcp list
```
Phải thấy `playwright` trong danh sách.

### Bước 3 — Cấu hình môi trường

Copy file mẫu và điền thông tin:

```bash
cp .env.example .env.dev
```

Mở `.env.dev` và điền:

```env
TARGET_URL=https://your-site.com/sign-in
BASE_URL=https://your-site.com/
TEST_USER_EMAIL=your-test-account@example.com
TEST_USER_PASSWORD=your-test-password
SLACK_WEBHOOK_URL=        # tuỳ chọn — để trống nếu không dùng Slack
```

> `ANTHROPIC_API_KEY` **không cần** — Claude Code đang chạy sẵn và tự phân tích trang.

---

## 4. Cấu trúc thư mục

Files được tổ chức theo **feature folder**. `<feature>` là tên domain (ví dụ: `auth`, `plans`, `checkout`).

```
claude-test/
│
├── .env.dev / .env.staging / .env.prod   ← Credentials theo môi trường (không commit)
├── .env.example                          ← Template — commit vào git
├── playwright.config.ts                  ← Cấu hình Playwright
│
├── scripts/
│   ├── crawl.js                ← Bước 1: Chụp ảnh + lấy HTML của trang web
│   ├── reporter.ts             ← Custom reporter → tạo reports/latest.json
│   ├── make-json-report.js     ← In tóm tắt kết quả ra màn hình
│   └── send-alert.js           ← Gửi kết quả lên Slack
│
├── docs/
│   ├── crawl/
│   │   └── <feature>/<page>/
│   │       ├── screenshot.png      ← Ảnh chụp trang
│   │       ├── raw-html.txt        ← HTML thô (20KB đầu)
│   │       └── crawl-data.json     ← Phân tích của Claude
│   ├── specs/
│   │   └── <feature>/<page>.spec.md        ← Đặc tả test
│   ├── test-cases/
│   │   └── <feature>/<page>.test-cases.md  ← Chi tiết từng test case
│   └── ui-map/
│       └── <feature>/<page>.ui-map.md      ← Bản đồ locator
│
├── tests/e2e/
│   ├── <feature>/
│   │   └── <page>.spec.ts          ← File test chạy được
│   ├── journeys/
│   │   └── <journey-name>.spec.ts  ← Multi-page journey tests
│   ├── pages/
│   │   └── <feature>/
│   │       └── <Page>Page.ts       ← Page Object Model
│   ├── fixtures/
│   │   └── index.ts                ← Shared fixtures (auth session)
│   ├── auth.setup.ts               ← Login 1 lần, lưu session
│   └── helpers.ts                  ← Utility functions dùng chung
│
├── reports/
│   ├── latest.json             ← Kết quả lần chạy mới nhất
│   └── run-<timestamp>.json    ← Lịch sử từng lần chạy
│
└── test-results/               ← Screenshot/video khi test fail (Playwright tạo)
```

---

## 5. Workflow

### Recommended workflow (có review trước khi build)

```
/e2e-spec <feature> <page>     ← bước 1–3: crawl + spec + test-cases, dừng để review
  → review + sửa spec/test-cases nếu cần
/setup-data <feature> <page>   ← nếu cần credentials/fixtures
/e2e-build <feature> <page>    ← bước 4–9: inspect + POM + test + run + report
```

### Quick workflow (không cần review)

```
/e2e <feature> <page>          ← full 9 bước tự động
```

### Journey workflow (multi-page flow)

```
# Bước 1: build từng page trước
/e2e-spec home home
/e2e-build home home
/e2e-spec plans plans
/e2e-build plans plans
/e2e-spec checkout checkout
/e2e-build checkout checkout

# Bước 2: tạo journey test
/e2e-journey purchase-flow home/home plans/plans checkout/checkout
```

---

## 6. Pipeline 9 bước — Chi tiết

| Bước | Việc làm | Output |
|------|----------|--------|
| 1 | Crawl trang, chụp screenshot, lưu HTML | `docs/crawl/<feature>/<page>/` |
| 2 | Claude phân tích → sinh spec | `docs/specs/<feature>/<page>.spec.md` |
| 3 | Sinh manual test cases chi tiết | `docs/test-cases/<feature>/<page>.test-cases.md` |
| 4 | Dùng Playwright MCP inspect UI thật | _(nội bộ)_ |
| 5 | Lưu locator map | `docs/ui-map/<feature>/<page>.ui-map.md` |
| 6 | Sinh Page Object Model | `tests/e2e/pages/<feature>/<Page>Page.ts` |
| 7 | Sinh test file | `tests/e2e/<feature>/<page>.spec.ts` |
| 8 | Chạy Playwright test | `reports/latest.json`, `playwright-report/` |
| 9 | In report, fix nếu fail, gửi Slack | console output + Slack (nếu có) |

> `/e2e-spec` dừng sau bước 3 để review. `/e2e-build` chạy bước 4–9.

---

## 7. Skills — Bảng tham khảo nhanh

| Skill | Khi nào dùng |
|-------|-------------|
| `/e2e <feature> <page>` | Full pipeline 9 bước tự động, không dừng |
| `/e2e-spec <feature> <page>` | Chỉ bước 1–3 (crawl + spec + test-cases), **dừng để review** |
| `/setup-data <feature> <page>` | Chuẩn bị credentials, fixtures, env vars trước khi build |
| `/e2e-build <feature> <page>` | Bước 4–9 từ spec đã review |
| `/e2e-run [feature] [page]` | Tìm và chạy test files đã có sẵn, sửa lỗi, báo cáo |
| `/e2e-journey <name> <f1>/<p1> ...` | Tạo và chạy journey test qua nhiều page |
| `/fix-test` | Sửa test đang fail từ latest report |
| `/add-tc <feature> <page>` | Thêm TC mới vào spec + test file có sẵn |
| `/update-spec <feature> <page>` | Re-crawl + patch spec khi UI thay đổi, **dừng để review** |
| `/update-data <feature> <page>` | Cập nhật credentials/fixtures khi test data thay đổi |
| `/check-locators <feature> <page>` | Kiểm tra locators sau khi UI thay đổi |
| `/smoke` | Chạy chỉ High priority tests (sanity check trước deploy) |
| `/report` | In kết quả run mới nhất |
| `/cleanup` | Dọn test-results, playwright-report, run reports cũ |

---

## 8. Khi test FAIL — Xử lý như thế nào?

1. **Đọc lỗi:** `/report` hoặc mở `reports/latest.json`
2. **Mở screenshot** nếu có (đường dẫn trong trường `screenshot`)
3. **Phân loại lỗi:**

| Loại lỗi | Dấu hiệu | Cách sửa |
|----------|----------|----------|
| `app bug` | App làm sai so với spec | Báo dev fix app |
| `test bug` | Assertion sai logic | Sửa file `*.spec.ts` |
| `selector issue` | Không tìm thấy element | Cập nhật locator trong `*Page.ts` |
| `flaky` | Lúc pass lúc fail không rõ lý do | Thêm wait hoặc retry |
| `environment issue` | Mạng lỗi, server down | Kiểm tra môi trường |

4. Dùng `/fix-test` để Claude tự phân tích và sửa
5. Hoặc sửa thủ công rồi chạy lại: `npx playwright test tests/e2e/<feature>/<page>.spec.ts`
6. Lặp đến khi `summary.failed === 0`
7. Gửi kết quả cuối: `npm run alert`

---

## 9. Multi-environment

| File | Mục đích |
|------|----------|
| `.env.dev` | Dev/local |
| `.env.staging` | Staging |
| `.env.prod` | Production |
| `.env.example` | Template — commit vào git, không có credentials thật |

Chạy với môi trường cụ thể:
```bash
ENV=staging npx playwright test
```

---

## 10. Auth session

`tests/e2e/auth.setup.ts` login 1 lần, lưu session vào `.auth/user.json`.
Các test cần đăng nhập dùng `testWithAuth` từ fixtures — không login lại mỗi test.

```typescript
import { testWithAuth as test, expect } from '../fixtures';

test('TC-001: dashboard loads', async ({ authenticatedPage: page }) => {
  await expect(page).not.toHaveURL(/\/sign-in/);
});
```

> `.auth/user.json` không được commit (đã có trong `.gitignore`).

---

## 11. Locator convention — Thứ tự ưu tiên

| Ưu tiên | Locator | Ví dụ |
|---------|---------|-------|
| 1 | `getByRole` | `page.getByRole('button', { name: 'Login' })` |
| 2 | `getByLabel` | `page.getByLabel('Email')` |
| 3 | `getByPlaceholder` | `page.getByPlaceholder('Enter email')` |
| 4 | `getByText` | `page.getByText('Forgot password')` |
| 5 (cuối cùng) | `data-testid` | `page.locator('[data-testid="submit-btn"]')` |

**Tuyệt đối không dùng:**
- CSS phức tạp: `.main > div:nth-child(2) > span`
- XPath
- `page.waitForTimeout(3000)`

---

## 12. Xử lý lỗi thường gặp

**`TARGET_URL chưa được set`**  
→ Kiểm tra file `.env.dev` có tồn tại và có giá trị `TARGET_URL`.

**`playwright` không có trong `claude mcp list`**  
→ Chạy lại: `claude mcp add playwright -- cmd /c npx -y @playwright/mcp@latest`

**Test fail sau khi retry**  
→ Đọc `reports/latest.json` và `test-results/` để xem screenshot + trace.

**`reports/latest.json` không tồn tại**  
→ Playwright chưa chạy xong hoặc bị lỗi trước khi reporter ghi file. Kiểm tra output terminal.

**Session hết hạn (test redirect về login)**  
→ Xóa `.auth/user.json` rồi chạy lại — auth.setup.ts sẽ login lại.

---

## 13. CI/CD — GitHub Actions

File: `.github/workflows/e2e.yml`

Triggers: push/PR to `main`, manual dispatch (chọn env: dev | staging).

Required GitHub secrets:
- `BASE_URL_dev`, `BASE_URL_staging`
- `TEST_USER_EMAIL_dev`, `TEST_USER_EMAIL_staging`
- `TEST_USER_PASSWORD_dev`, `TEST_USER_PASSWORD_staging`
- `SLACK_WEBHOOK_URL`

Artifacts (7 ngày): `test-results/`, `playwright-report/`, `reports/`

---

## 14. Tóm tắt lệnh hay dùng

| Lệnh | Làm gì |
|------|--------|
| `npm install` | Cài dependencies |
| `npx playwright install chromium` | Cài browser |
| `npx playwright test` | Chạy toàn bộ test |
| `npx playwright test tests/e2e/auth/sign-in.spec.ts` | Chạy 1 file test cụ thể |
| `npx playwright test --headed` | Chạy test với trình duyệt hiện ra màn hình |
| `ENV=staging npx playwright test` | Chạy với môi trường staging |
| `npx playwright test --update-snapshots` | Cập nhật visual regression baseline |
| `npm run report` | In tóm tắt kết quả ra terminal |
| `npm run alert` | Gửi kết quả lên Slack |
