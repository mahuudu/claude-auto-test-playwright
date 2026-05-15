---
name: update-data
description: Cập nhật credentials, fixtures, và env vars khi test data đã thay đổi (password đổi, account bị xóa, v.v.) mà không cần chạy lại toàn bộ pipeline. Arguments: <feature> <page>.
---

Bạn là QA engineer cập nhật test data. Không chạy test — chỉ cập nhật data.

---

## Xác định feature và page từ argument

- `<feature> <page>` — ví dụ: `auth sign-in`, `checkout payment`
- `<page>` — feature suy từ URL trong `.env`

---

## Bước 1 — Đọc data hiện tại

Đọc song song:
- `.env.dev` (hoặc `.env` nếu không có) — tìm các biến `TEST_*`
- `tests/e2e/fixtures/test-data/users.ts` — xem user structure hiện tại
- `docs/specs/<feature>/<page>.spec.md` — xem TC nào cần data gì

In snapshot data hiện tại:

```
📋 Test data hiện tại cho <feature>/<page>:

  TEST_USER_EMAIL    = dma+199@softel.vn  ← TC-004, TC-005
  TEST_USER_PASSWORD = ***                ← TC-004
```

---

## Bước 2 — Cập nhật data

Dựa trên thông tin user cung cấp trong argument hoặc chat, cập nhật:

**Nếu thay đổi credentials** → cập nhật `.env.dev` (và `.env.staging` / `.env.prod` nếu cần):
```
TEST_USER_EMAIL=<email mới>
TEST_USER_PASSWORD=<password mới>
```

**Nếu thêm loại user mới** → cập nhật `tests/e2e/fixtures/test-data/users.ts`:
```typescript
export const users = {
  standard: { ... },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || '',
    password: process.env.TEST_ADMIN_PASSWORD || '',
  },
} as const;
```

Chỉ sửa những gì user yêu cầu — không đụng BASE_URL, SLACK_WEBHOOK_URL hay biến khác.

---

## Bước 3 — Kiểm tra test.skip còn hợp lệ

Đọc test file `tests/e2e/<feature>/<page>.spec.ts` nếu tồn tại.

Nếu có `test.skip()` liên quan đến data vừa cập nhật → đề xuất bỏ skip và hỏi confirm trước khi sửa:

```
⚠️  TC có thể bỏ skip sau khi update data:

  TC-003: test.skip(!process.env.TEST_PHONE, ...)
    → TEST_PHONE đã được set. Bỏ skip? (y/n)
```

---

## Bước 4 — Báo cáo

```
─────────────────────────────────────────────────
✅ Update data hoàn tất

  .env.dev đã cập nhật:
    TEST_USER_EMAIL    ✅
    TEST_USER_PASSWORD ✅

  Sẵn sàng chạy lại: /e2e-build <feature> <page>
─────────────────────────────────────────────────
```
