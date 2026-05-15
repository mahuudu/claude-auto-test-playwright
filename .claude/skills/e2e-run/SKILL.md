---
name: e2e-run
description: Discover and run existing E2E tests by feature (or all features). Fixes failures, reports results. Use when tests are already built and you want to run them. Arguments: [feature] [page] — both optional.
---

Bạn là QA engineer. Tìm và chạy các test file đã có sẵn, phân tích kết quả, sửa lỗi, báo cáo.

---

## Xác định scope từ argument

| Argument | Scope |
|----------|-------|
| (không có) | Tất cả `tests/e2e/**/*.spec.ts` |
| `<feature>` | `tests/e2e/<feature>/*.spec.ts` |
| `<feature> <page>` | `tests/e2e/<feature>/<page>.spec.ts` |

Bỏ qua: `_template.spec.ts`, `auth.setup.ts`, `tests/e2e/journeys/` (trừ khi argument là `journeys`).

---

## Bước 1 — Tìm test files

Dùng Glob tìm spec files theo scope. In danh sách:

```
📋 Test files to run:
  tests/e2e/auth/sign-in.spec.ts
  tests/e2e/plans/plans.spec.ts
  tests/e2e/cart/cart.spec.ts
  tests/e2e/checkout/checkout.spec.ts
```

Nếu không tìm thấy file nào → in lỗi và gợi ý chạy `/e2e-build <feature> <page>` trước.

---

## Bước 2 — Chạy tests

Nếu scope là 1 file:
```
npx playwright test tests/e2e/<feature>/<page>.spec.ts --headed
```

Nếu scope là 1 feature (nhiều files):
```
npx playwright test tests/e2e/<feature>/ --headed
```

Nếu scope là tất cả:
```
npx playwright test --headed
```

---

## Bước 3 — Phân tích Report

Chạy: `node scripts/make-json-report.js`

In tóm tắt:
```
📊 Run Results
──────────────────────────────
Total: X | Passed: X | Failed: X | Pass rate: X%
```

Nếu `summary.failed === 0` → in `🎉 Tất cả test pass!`, chạy `node scripts/send-alert.js` và dừng.

---

## Bước 4 — Sửa lỗi (nếu có fail)

Với mỗi test fail trong `reports/latest.json`:

1. Đọc `error.message`, `error.expected`, `error.received`
2. Đọc file `screenshot` tương ứng (nếu có)
3. Đọc `specFile` để hiểu intent ban đầu
4. Đọc POM và test file liên quan
5. Phân loại:

| Loại | Dấu hiệu | Cách xử lý |
|------|----------|------------|
| `selector issue` | Element not found, locator timeout | Cập nhật locator trong POM |
| `test bug` | Assertion sai, flow test sai logic | Sửa assertion hoặc flow trong test file |
| `flaky` | Timing, race condition | Thêm `waitFor`, dùng `retryWithBackoff` từ `helpers.ts` |
| `app bug` | UI/behavior khác spec | Dùng `test.fixme('app bug: <mô tả>')` để skip có giải thích |
| `environment issue` | Network, server, config | Ghi nhận, không sửa code |

Không sửa spec file. Không sửa test-cases file.

---

## Bước 5 — Chạy lại

Sau khi sửa → quay lại Bước 2 với cùng scope. Lặp tối đa 3 lần.

Nếu sau 3 lần vẫn còn fail → dừng, báo cáo chi tiết.

---

## Bước 6 — Báo cáo cuối

In:
```
✅ Fixed: X tests
⚠️  Skipped (app bug): X tests  
❌ Still failing: X tests

<với mỗi test đã sửa: loại lỗi + cách sửa 1 dòng>
<với mỗi test skip: lý do app bug 1 dòng>
```

Chạy `node scripts/send-alert.js`
