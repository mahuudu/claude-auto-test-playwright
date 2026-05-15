---
name: setup-data
description: Set up test fixtures, credentials, and env vars needed before running tests. Use when tests require login, real data, or environment-specific config. Arguments: <feature> <page>.
---

Bạn là QA engineer chuẩn bị test data và credentials. Không chạy test — chỉ chuẩn bị data.

---

## Xác định feature và page từ argument

- `<feature> <page>` — ví dụ: `auth sign-in`, `checkout payment`
- `<page>` — feature suy từ URL trong `.env`

---

## Bước 1 — Đọc spec và test-cases

Đọc song song:
- `docs/specs/<feature>/<page>.spec.md`
- `docs/test-cases/<feature>/<page>.test-cases.md`

Tìm tất cả chỗ cần data thật:
- TC nào cần credentials (email, password, phone)
- TC nào cần dữ liệu có sẵn trong DB (account, order, plan)
- TC nào cần env vars đặc biệt
- TC nào cần mock/stub (OTP, payment, email delivery)

---

## Bước 2 — Kiểm tra fixtures hiện có

Đọc `tests/e2e/fixtures/index.ts` nếu tồn tại.

Kiểm tra `.env` — xem đã có `TEST_EMAIL`, `TEST_PASSWORD`, hay các biến test data chưa.

---

## Bước 3 — Xác định data còn thiếu

In danh sách:

```
📋 Data cần thiết cho <feature>/<page>:

✅ Đã có:
  - BASE_URL (https://...)

❌ Còn thiếu:
  - TEST_EMAIL     — dùng cho TC-002 (login với valid credentials)
  - TEST_PASSWORD  — dùng cho TC-002
  - TEST_PHONE     — dùng cho TC-003 (OTP login)
```

---

## Bước 4 — Hỏi user cung cấp data

In prompt sau và **dừng lại chờ user**:

```
─────────────────────────────────────────────────
⏸  DATA CHECKPOINT

Các TC sau cần data thật để chạy được:

  TC-002: Login với valid credentials
    → Cần: TEST_EMAIL, TEST_PASSWORD

  TC-003: OTP login
    → Cần: TEST_PHONE (số điện thoại nhận OTP)

Hãy cung cấp theo 1 trong 2 cách:

  1. Thêm vào .env:
     TEST_EMAIL=your@email.com
     TEST_PASSWORD=yourpassword
     TEST_PHONE=+1234567890

  2. Nhắn trực tiếp vào chat:
     "email: test@example.com, password: abc123"

Các TC không có data sẽ được đánh dấu test.skip() tự động.

Khi đã sẵn sàng → nhắn "done" hoặc cung cấp data ngay bây giờ.
─────────────────────────────────────────────────
```

---

## Bước 5 — Khi user cung cấp data

Nhận data từ user (qua chat hoặc .env đã được cập nhật).

### 5a — Cập nhật .env

Thêm các biến test vào `.env` (không ghi đè BASE_URL hay SLACK_WEBHOOK_URL):

```
# Test credentials
TEST_EMAIL=<email>
TEST_PASSWORD=<password>
TEST_PHONE=<phone>
```

### 5b — Cập nhật fixtures

Đọc hoặc tạo `tests/e2e/fixtures/index.ts`:

```typescript
// tests/e2e/fixtures/index.ts
import { test as base } from '@playwright/test';

export const testData = {
  validUser: {
    email:    process.env.TEST_EMAIL    ?? '',
    password: process.env.TEST_PASSWORD ?? '',
    phone:    process.env.TEST_PHONE    ?? '',
  },
} as const;

export { base as test };
```

### 5c — Đánh dấu TC không có data

Với mỗi TC cần data mà user không cung cấp, thêm `test.skip` vào test file nếu đã tồn tại:

```typescript
test.skip(!process.env.TEST_EMAIL, 'TEST_EMAIL not set — skipping credential tests');
```

---

## Bước 6 — Báo cáo

```
─────────────────────────────────────────────────
✅ Setup data hoàn tất

  .env đã cập nhật:
    TEST_EMAIL    ✅
    TEST_PASSWORD ✅
    TEST_PHONE    ❌ (không có — TC-003 sẽ bị skip)

  fixtures/index.ts ✅

  Sẵn sàng chạy: /e2e-build <feature> <page>
─────────────────────────────────────────────────
```
