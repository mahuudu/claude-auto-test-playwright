---
inclusion: manual
name: e2e-build
---

Bạn là QA automation engineer. Chạy bước 4–9 từ spec đã có sẵn. Không tạo lại spec hay test-cases.

---

## Xác định feature và page từ argument

- `<feature> <page>` — ví dụ: `auth sign-in`, `plans list`
- `<page>` — feature suy từ URL trong `.env`

Kiểm tra trước khi bắt đầu:
- `docs/specs/<feature>/<page>.spec.md` phải tồn tại
- `docs/test-cases/<feature>/<page>.test-cases.md` phải tồn tại

Nếu thiếu → in lỗi và gợi ý chạy `/e2e-spec <feature> <page>` trước.

---

## Bước 4 — Inspect UI bằng Playwright MCP

Đọc spec để biết các element cần test.

Dùng Playwright MCP mở trang thật, inspect từng interactive element quan trọng.

Thứ tự ưu tiên locator:
1. `getByRole` (với name/level)
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `locator('[data-testid="..."]')` — chỉ khi không còn cách nào khác

Tuyệt đối không dùng CSS selector phức tạp, XPath, `waitForTimeout`.

---

## Bước 5 — Sinh UI Map

Tạo `docs/ui-map/<feature>/<page>.ui-map.md` theo template trong CLAUDE.md.

In: `✅ docs/ui-map/<feature>/<page>.ui-map.md`

---

## Bước 6 — Sinh Page Object Model

Đọc spec + ui-map, tạo `tests/e2e/pages/<feature>/<Page>Page.ts` theo template trong CLAUDE.md.

- `goto()` dùng path tương đối
- Tất cả locators khai báo trong constructor
- Methods đặt tên theo hành động: `goto`, `click<X>`, `fill<X>`, `expect<State>`

In: `✅ tests/e2e/pages/<feature>/<Page>Page.ts`

---

## Bước 7 — Sinh Test File

Đọc spec + test-cases + POM, tạo `tests/e2e/<feature>/<page>.spec.ts` theo template trong CLAUDE.md.

- Import POM từ `../pages/<feature>/<Page>Page`
- Mỗi test bắt đầu bằng TC-ID: `'TC-001: <mô tả>'`
- Mỗi test độc lập
- Không viết locator trực tiếp trong test

Nếu test-cases có ghi nhận test data cần thiết (credentials, fixtures) → đọc từ `tests/e2e/fixtures/index.ts` hoặc `process.env`.

In: `✅ tests/e2e/<feature>/<page>.spec.ts`

---

## Bước 8 — Chạy Test

```
npx playwright test tests/e2e/<feature>/<page>.spec.ts
```

---

## Bước 9 — Phân tích Report và Alert

Chạy: `node scripts/make-json-report.js`

In tóm tắt:
```
Total: X | Passed: X | Failed: X | Pass rate: X%
```

Nếu `summary.failed === 0` → in `🎉 Tất cả test pass!`, chạy `node scripts/send-alert.js` và dừng.

Nếu có test fail, với mỗi test fail:
1. Đọc `error.message`, `error.expected`, `error.received` trong `reports/latest.json`
2. Đọc file `screenshot` tương ứng
3. Trace về `specFile` để hiểu intent ban đầu
4. Phân loại: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`
5. Sửa POM hoặc test file (không sửa spec)

Sau khi sửa → quay lại Bước 8. Lặp tối đa 3 lần.

Nếu sau 3 lần vẫn fail → báo cáo chi tiết, phân loại từng lỗi, chạy `node scripts/send-alert.js` và dừng.