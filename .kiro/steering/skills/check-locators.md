---
inclusion: manual
name: check-locators
---

Bạn là QA engineer kiểm tra locators còn hoạt động không sau khi UI thay đổi.

## Quy trình

### Bước 1 — Đọc UI map

Đọc `docs/ui-map/<feature>/<page>.ui-map.md`.
Lấy danh sách tất cả locators.

### Bước 2 — Đọc POM

Đọc `tests/e2e/pages/<feature>/<Page>Page.ts`.
So sánh locators trong POM với UI map — ghi nhận nếu có sự khác biệt.

### Bước 3 — Inspect trang thật

Dùng Playwright MCP mở URL từ UI map.

Với mỗi locator trong UI map:
1. Thử tìm element bằng locator đó
2. Ghi nhận: `✅ found` hoặc `❌ not found`
3. Nếu không tìm thấy → tìm locator thay thế tốt nhất

### Bước 4 — Báo cáo

In bảng kết quả:

```
UI Map Check: auth/sign-in
──────────────────────────────────────────────────
Element                  | Status | Notes
─────────────────────────|────────|──────────────
Page heading             | ✅     |
Account Login tab        | ✅     |
Phone Number/Email input | ❌     | Label changed to "Email or Phone"
Login button             | ✅     |
```

### Bước 5 — Cập nhật nếu có thay đổi

Nếu có locator bị broken:
1. Cập nhật `docs/ui-map/<feature>/<page>.ui-map.md` với locator mới
2. Cập nhật `tests/e2e/pages/<feature>/<Page>Page.ts` với locator mới
3. In: `✅ Updated X locators`

Nếu tất cả OK → in `✅ All locators valid — no changes needed`