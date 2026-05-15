---
name: e2e-build
description: Run steps 4–9 of the E2E pipeline (inspect → ui-map → POM → test → run → report) from an existing reviewed spec. Use after /e2e-spec and after you have reviewed the spec and test cases. Arguments: <feature> <page>.
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

Nếu cần chụp screenshot trong quá trình inspect, lưu vào `docs/crawl/<feature>/<page>/` (cùng thư mục với crawl data). Không lưu screenshot vào `docs/` trực tiếp.

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

**Trước khi tạo mới**, kiểm tra POM đã tồn tại chưa trong toàn bộ `tests/e2e/pages/`:

```
# Ví dụ: đang build feature=checkout, cần CartPage và PlansPage
→ Tìm tests/e2e/pages/cart/CartPage.ts      ← nếu có, REUSE, không tạo lại
→ Tìm tests/e2e/pages/plans/PlansPage.ts    ← nếu có, REUSE, không tạo lại
→ Tìm tests/e2e/pages/checkout/CheckoutPage.ts ← chưa có → tạo mới
```

Nếu POM đã tồn tại ở feature khác → **dùng lại**, ghi nhớ path gốc để dùng ở Bước 7.

Chỉ tạo POM mới cho page chưa có. Tạo vào đúng folder theo feature của page đó:
- `tests/e2e/pages/<feature-của-page>/<Page>Page.ts`
- Không tạo vào folder của feature đang build nếu page đó thuộc feature khác

- `goto()` dùng path tương đối
- Tất cả locators khai báo trong constructor
- Methods đặt tên theo hành động: `goto`, `click<X>`, `fill<X>`, `expect<State>`

In:
```
✅ tests/e2e/pages/<feature>/<Page>Page.ts  ← (mới tạo)
♻️  tests/e2e/pages/<other>/OtherPage.ts   ← (tái sử dụng, không thay đổi)
```

---

## Bước 7 — Sinh Test File

Đọc spec + test-cases + POM, tạo `tests/e2e/<feature>/<page>.spec.ts` theo template trong CLAUDE.md.

Import path **phải trỏ đúng vào folder gốc của POM** (theo ghi nhận từ Bước 6):

```typescript
// ✅ Đúng — trỏ về folder feature của page đó
import { PlansPage }   from '../pages/plans/PlansPage';
import { CartPage }    from '../pages/cart/CartPage';
import { CheckoutPage } from '../pages/checkout/CheckoutPage';

// ❌ Sai — không tạo bản copy vào folder đang build
import { CartPage } from '../pages/checkout/CartPage';
```

- Mỗi test bắt đầu bằng TC-ID: `'TC-001: <mô tả>'`
- Mỗi test độc lập
- Không viết locator trực tiếp trong test

Nếu test-cases có ghi nhận test data cần thiết (credentials, fixtures) → đọc từ `tests/e2e/fixtures/index.ts` hoặc `process.env`.

In: `✅ tests/e2e/<feature>/<page>.spec.ts`

---

## Bước 8 — Chạy Test

- Hỏi trước khi chạy test: Y/N
```
npx playwright test tests/e2e/<feature>/<page>.spec.ts --headed
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
