---
name: e2e-journey
description: Create and run a multi-page journey test (e.g. home → plans → cart → checkout). Requires POMs for all pages to already exist. Arguments: <journey-name> <feature1>/<page1> <feature2>/<page2> ...
---

Bạn là QA automation engineer. Tạo và chạy journey test qua nhiều page theo thứ tự.

---

## Xác định journey từ argument

Format: `<journey-name> <feature1>/<page1> <feature2>/<page2> ...`

Ví dụ:
- `purchase-flow home/home plans/plans cart/cart checkout/checkout`
- `auth-flow home/home auth/sign-in`

Nếu không có argument → hỏi user: "Tên journey là gì? Các page theo thứ tự? (ví dụ: purchase-flow home/home plans/plans cart/cart checkout/checkout)"

---

## Kiểm tra điều kiện trước khi bắt đầu

Với mỗi `<feature>/<page>` trong danh sách, kiểm tra:
- `tests/e2e/pages/<feature>/<Page>Page.ts` phải tồn tại

Nếu thiếu POM nào → in lỗi:
```
❌ Thiếu POM cho: <feature>/<page>
   Chạy trước: /e2e-build <feature> <page>
```
Liệt kê tất cả POM còn thiếu rồi dừng.

---

## Bước J1 — Tạo Journey Spec

Tạo `docs/specs/journeys/<journey-name>.spec.md` theo template trong CLAUDE.md (phần "Journey spec template").

- Đọc từng POM để hiểu các method có sẵn
- Xác định data cần thiết (credentials, form fields)
- Tạo 2–4 journey test cases: happy path + auth variants (nếu có) + failure path

In: `✅ docs/specs/journeys/<journey-name>.spec.md`

---

## Bước J2 — Tạo Journey Test Cases

Tạo `docs/test-cases/journeys/<journey-name>.test-cases.md`.

Mỗi TC mô tả toàn bộ flow từ đầu đến cuối, bao gồm:
- Data cần chuẩn bị
- Từng bước qua từng page
- Assertion tại mỗi checkpoint
- Failure classification guide

In: `✅ docs/test-cases/journeys/<journey-name>.test-cases.md`

---

## Bước J3 — Tạo Journey Test File

Tạo `tests/e2e/journeys/<journey-name>.spec.ts` theo template trong CLAUDE.md (phần "Journey test file template").

- Import tất cả POM cần thiết — **trỏ đúng về folder feature gốc của từng page**:
  ```typescript
  import { HomePage }     from '../pages/home/HomePage';
  import { PlansPage }    from '../pages/plans/PlansPage';
  import { CartPage }     from '../pages/cart/CartPage';
  import { CheckoutPage } from '../pages/checkout/CheckoutPage';
  ```
- Mỗi test dùng prefix `JT-` thay vì `TC-`
- Tests trong journey KHÔNG độc lập — chúng chain state qua các page
- Dùng `test.describe.serial` để đảm bảo thứ tự chạy

In: `✅ tests/e2e/journeys/<journey-name>.spec.ts`

---

## Bước J4 — Chạy Test

```
npx playwright test tests/e2e/journeys/<journey-name>.spec.ts --headed
```

---

## Bước J5 — Phân tích Report và Alert

Chạy: `node scripts/make-json-report.js`

In tóm tắt:
```
Total: X | Passed: X | Failed: X | Pass rate: X%
```

Nếu `summary.failed === 0` → in `🎉 Journey test pass!`, chạy `node scripts/send-alert.js` và dừng.

Nếu có test fail:
1. Đọc `error.message`, `error.expected`, `error.received` trong `reports/latest.json`
2. Đọc file `screenshot` tương ứng
3. Xác định fail ở page nào trong journey
4. Phân loại: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`
5. Sửa POM hoặc test file (không sửa spec)

Sau khi sửa → quay lại Bước J4. Lặp tối đa 3 lần.

Nếu sau 3 lần vẫn fail → báo cáo chi tiết, phân loại từng lỗi, chạy `node scripts/send-alert.js` và dừng.
