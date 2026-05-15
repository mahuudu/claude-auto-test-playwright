---
inclusion: manual
name: e2e-journey
---

Bạn là QA automation engineer. Tạo và chạy journey test qua nhiều page theo thứ tự.

---

## Xác định journey từ argument

Format: `<journey-name> <feature1>/<page1> <feature2>/<page2> ...`

Ví dụ:
- `purchase-flow home/home plans/plans cart/cart checkout/checkout`
- `auth-flow home/home auth/sign-in`

Nếu không có argument → hỏi user: "Tên journey là gì? Các page theo thứ tự?"

---

## Kiểm tra điều kiện trước khi bắt đầu

Với mỗi `<feature>/<page>`, kiểm tra `tests/e2e/pages/<feature>/<Page>Page.ts` phải tồn tại.

Nếu thiếu POM → in lỗi và gợi ý chạy `/e2e-build <feature> <page>` trước. Liệt kê tất cả POM còn thiếu rồi dừng.

---

## Bước J1 — Tạo Journey Spec

Đọc từng POM để hiểu các method có sẵn. Tạo `docs/specs/journeys/<journey-name>.spec.md` theo "Journey spec template" trong CLAUDE.md.

- 2–4 journey test cases: happy path + auth variants (nếu có) + failure path

In: `✅ docs/specs/journeys/<journey-name>.spec.md`

---

## Bước J2 — Tạo Journey Test Cases

Tạo `docs/test-cases/journeys/<journey-name>.test-cases.md`.

Mỗi TC mô tả toàn bộ flow từ đầu đến cuối: data cần chuẩn bị, từng bước qua từng page, assertion tại mỗi checkpoint, failure classification guide.

In: `✅ docs/test-cases/journeys/<journey-name>.test-cases.md`

---

## Bước J3 — Tạo Journey Test File

Tạo `tests/e2e/journeys/<journey-name>.spec.ts` theo "Journey test file template" trong CLAUDE.md.

- Import tất cả POM cần thiết
- Dùng `test.describe.serial`
- Prefix `JT-` thay vì `TC-`

In: `✅ tests/e2e/journeys/<journey-name>.spec.ts`

---

## Bước J4 — Chạy Test

```
npx playwright test tests/e2e/journeys/<journey-name>.spec.ts
```

---

## Bước J5 — Phân tích Report và Alert

Chạy: `node scripts/make-json-report.js`

In tóm tắt: `Total: X | Passed: X | Failed: X | Pass rate: X%`

Nếu `summary.failed === 0` → in `🎉 Journey test pass!`, chạy `node scripts/send-alert.js` và dừng.

Nếu có test fail:
1. Đọc `error.message`, `error.expected`, `error.received` trong `reports/latest.json`
2. Đọc file `screenshot` tương ứng
3. Xác định fail ở page nào trong journey
4. Phân loại: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`
5. Sửa POM hoặc test file (không sửa spec)

Sau khi sửa → quay lại Bước J4. Lặp tối đa 3 lần. Nếu vẫn fail → báo cáo chi tiết, chạy `node scripts/send-alert.js` và dừng.
