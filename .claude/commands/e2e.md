Bạn là QA automation engineer. Khi được gọi, hãy chạy đúng 9 bước sau theo thứ tự. Không bỏ bước, không hỏi lại — tự quyết định và tiến hành.

---

## Xác định feature và page từ argument

Argument có thể là:
- `/e2e <feature> <page>` — ví dụ: `/e2e auth sign-in`, `/e2e plans list`
- `/e2e <page>` — feature suy từ URL path segment đầu tiên
- `/e2e` — feature và page đều suy từ TARGET_URL trong .env

Quy tắc suy:
- URL `https://site.com/sign-in` → feature=`auth`, page=`sign-in`
- URL `https://site.com/plans` → feature=`plans`, page=`plans`
- URL `https://site.com/account/profile` → feature=`account`, page=`profile`
- URL root `/` → feature=`home`, page=`home`
- Các page liên quan đến login/signup/forgot-password/otp → feature=`auth`

Sau khi xác định, dùng nhất quán trong toàn bộ pipeline:
- Docs: `docs/specs/<feature>/<page>.spec.md`, `docs/test-cases/<feature>/<page>.test-cases.md`, `docs/ui-map/<feature>/<page>.ui-map.md`
- POM: `tests/e2e/pages/<feature>/<Page>Page.ts`
- Test: `tests/e2e/<feature>/<page>.spec.ts`

---

## Bước 1 — Crawl

Nếu argument chứa URL (bắt đầu bằng `http`), dùng URL đó. Ngược lại dùng TARGET_URL từ `.env`.

Chạy: `TARGET_URL=<url> FEATURE=<feature> PAGE=<page> node scripts/crawl.js`

Nếu lệnh thành công, tiếp tục ngay bước phân tích bên dưới.
Nếu lỗi, báo lỗi và dừng.

**Sau khi crawl xong — Claude tự phân tích:**

Đọc `docs/crawl/<feature>/<page>/screenshot.png` (ảnh) và `docs/crawl/<feature>/<page>/raw-html.txt` (HTML).

Phân tích trang và tạo `docs/crawl/<feature>/<page>/crawl-data.json` theo đúng schema sau (JSON thuần, không có markdown):

```json
{
  "crawledAt": "<ISO timestamp>",
  "url": "<TARGET_URL>",
  "title": "<tiêu đề trang>",
  "metaDescription": "<meta description nếu có>",
  "pageType": "landing | login | dashboard | product | blog | checkout | other",
  "purpose": "<mô tả ngắn mục đích trang (1-2 câu)>",
  "headings": [{ "level": "H1|H2|H3", "text": "..." }],
  "interactiveElements": {
    "buttons": [{ "text": "...", "purpose": "..." }],
    "links": [{ "text": "...", "href": "...", "purpose": "..." }],
    "inputs": [{ "type": "text|email|password|...", "label": "...", "placeholder": "..." }],
    "forms": [{ "purpose": "...", "fields": ["..."] }]
  },
  "keyFeatures": ["..."],
  "testableScenarios": ["..."],
  "potentialIssues": ["..."]
}
```

Ghi file xong, in: `✅ docs/crawl/<feature>/<page>/crawl-data.json`

---

## Bước 2 — Sinh Spec

Đọc `docs/crawl/<feature>/<page>/crawl-data.json`.

Dựa vào `pageType`, `purpose`, `interactiveElements`, `testableScenarios`, viết file spec theo đúng template trong CLAUDE.md (phần "Bước 2 · Spec template").

- Tên file: `docs/specs/<feature>/<page>.spec.md`
- Tạo 5–8 test cases thực tế: page load, interactive elements chính, navigation, form validation nếu có
- Mỗi TC phải có đủ: Mục tiêu, Điều kiện, Các bước, Kết quả mong đợi, Priority

Ghi file xong, in: `✅ docs/specs/<feature>/<page>.spec.md`

---

## Bước 3 — Sinh Manual Test Cases

Đọc `docs/specs/<feature>/<page>.spec.md` vừa tạo.

Mở rộng mỗi TC thành test case chi tiết hơn, bao gồm cả happy path và edge case.

- Tên file: `docs/test-cases/<feature>/<page>.test-cases.md`
- Format: dùng đúng template trong CLAUDE.md (phần "Bước 3 · Test Cases template")

Ghi file xong, in: `✅ docs/test-cases/<feature>/<page>.test-cases.md`

---

## Bước 4 — Inspect UI bằng Playwright MCP

Dùng Playwright MCP để mở trang thật và inspect các element tương ứng với từng TC trong spec.

Nếu cần chụp screenshot trong quá trình inspect, lưu vào `docs/crawl/<feature>/<page>/` (cùng thư mục với crawl data). Không lưu screenshot vào `docs/` trực tiếp.

Với mỗi interactive element quan trọng:
1. Tìm locator tốt nhất theo thứ tự ưu tiên: `getByRole` → `getByLabel` → `getByPlaceholder` → `getByText` → `[data-testid]`
2. Ghi lại locator đã verify

Tuyệt đối không dùng CSS selector phức tạp, XPath, hay `waitForTimeout`.

---

## Bước 5 — Sinh UI Map

Dựa vào kết quả inspect ở bước 4, tạo file UI map.

- Tên file: `docs/ui-map/<feature>/<page>.ui-map.md`
- Format: dùng đúng template trong CLAUDE.md (phần "Bước 5 · UI Map template")

Ghi file xong, in: `✅ docs/ui-map/<feature>/<page>.ui-map.md`

---

## Bước 6 — Sinh Page Object Model

Đọc `docs/specs/<feature>/<page>.spec.md` + `docs/ui-map/<feature>/<page>.ui-map.md`.

Viết POM theo đúng template trong CLAUDE.md (phần "Bước 6 · Page Object template").

- Tên file: `tests/e2e/pages/<feature>/<Page>Page.ts`
- `goto()` dùng path tương đối — baseURL đã set trong playwright.config.ts
- Dùng đúng locators từ UI map

Ghi file xong, in: `✅ tests/e2e/pages/<feature>/<Page>Page.ts`

---

## Bước 7 — Sinh Test File

Đọc spec + test-cases + POM vừa tạo.

Viết test file theo đúng template trong CLAUDE.md (phần "Bước 7 · Test file template").

- Tên file: `tests/e2e/<feature>/<page>.spec.ts`
- Import POM từ `../pages/<feature>/<Page>Page`
- Mỗi test bắt đầu bằng TC-ID: `'TC-001: <mô tả>'`
- Mỗi test độc lập
- Import Page Object, không viết locator trực tiếp trong test

Ghi file xong, in: `✅ tests/e2e/<feature>/<page>.spec.ts`

---

## Bước 8 — Chạy Test

Chạy: `npx playwright test tests/e2e/<feature>/<page>.spec.ts`

---

## Bước 9 — Phân tích Report và Alert

Chạy: `node scripts/make-json-report.js`

In tóm tắt:
```
Total: X | Passed: X | Failed: X | Pass rate: X%
```

Nếu `summary.failed === 0`: in `🎉 Tất cả test pass!` rồi chạy `node scripts/send-alert.js` và dừng.

Nếu có test fail, với mỗi test fail:
1. Đọc `error.message`, `error.expected`, `error.received` trong `reports/latest.json`
2. Đọc file `screenshot` tương ứng (luôn có — cả pass lẫn fail đều có ảnh)
3. Trace về `specFile` để hiểu intent ban đầu
4. Xác định nguyên nhân: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`
5. Sửa POM hoặc test file (không sửa spec trừ khi spec sai logic)

Sau khi sửa, quay lại Bước 8. Lặp tối đa 3 lần.
Nếu sau 3 lần vẫn fail, báo cáo chi tiết lỗi còn lại, phân loại từng lỗi, rồi chạy `node scripts/send-alert.js` và dừng.
