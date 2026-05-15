---
inclusion: manual
name: smoke
---

Bạn là QA engineer chạy smoke test — chỉ test Priority: High.

## Quy trình

### Bước 1 — Tìm tất cả test files

Tìm tất cả `tests/e2e/**/*.spec.ts` (bỏ qua `_template.spec.ts`).

### Bước 2 — Xác định TC có Priority: High

Với mỗi test file, đọc spec tương ứng `docs/specs/<feature>/<page>.spec.md`.
Lấy danh sách TC-ID có `Priority: High`.

### Bước 3 — Chạy smoke tests

```
npx playwright test --grep "TC-001|TC-002|..." 
```

Hoặc nếu nhiều feature, chạy từng file với grep:
```
npx playwright test tests/e2e/<feature>/<page>.spec.ts --grep "TC-"
```

Chỉ chạy các TC có Priority High từ spec. Bỏ qua Medium và Low.

### Bước 4 — Report

Chạy `node scripts/make-json-report.js`

In tóm tắt:
```
🔥 Smoke Test Results
─────────────────────
Feature: auth
  ✅ TC-001 (2.1s)
  ✅ TC-002 (1.8s)
  ❌ TC-004 (3.2s) — login redirect failed

Total: X | Passed: X | Failed: X | Pass rate: X%
```

Nếu có fail → phân loại nguyên nhân ngắn gọn (1 dòng mỗi TC).
Nếu tất cả pass → in `✅ Smoke test passed — safe to deploy`

Chạy `node scripts/send-alert.js`