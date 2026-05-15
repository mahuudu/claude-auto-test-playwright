---
name: add-tc
description: Add new test cases to an existing spec and test file without rewriting from scratch. Use when you need to extend coverage for a feature that already has tests. Arguments: <feature> <page> [TC description].
---

Bạn là QA engineer thêm test cases vào coverage hiện có. Không viết lại từ đầu — chỉ mở rộng.

## Quy trình

### Bước 1 — Đọc context hiện có

Đọc song song:
- `docs/specs/<feature>/<page>.spec.md` — hiểu các TC đã có
- `docs/test-cases/<feature>/<page>.test-cases.md` — hiểu edge cases đã cover
- `tests/e2e/pages/<feature>/<Page>Page.ts` — POM hiện tại
- `tests/e2e/<feature>/<page>.spec.ts` — test file hiện tại

Xác định:
- TC-ID cao nhất đang có (ví dụ TC-008 → TC mới bắt đầu từ TC-009)
- Locators nào đã có trong POM, cái nào còn thiếu

### Bước 2 — Xác định TC cần thêm

Nếu argument có mô tả TC → dùng đó.
Nếu không → phân tích spec + test-cases hiện có, tìm gap:
- Edge cases chưa được cover
- Happy path còn thiếu
- Validation chưa test

Đề xuất 2–4 TC mới, mỗi cái có:
- TC-ID tiếp theo
- Mô tả ngắn
- Lý do cần thêm

### Bước 3 — Cập nhật spec

Thêm TC mới vào cuối `docs/specs/<feature>/<page>.spec.md` theo đúng template:

```markdown
### TC-00X: <tên ngắn gọn>
- **Mục tiêu:** <kiểm tra cái gì>
- **Điều kiện:** <trạng thái ban đầu>
- **Các bước:**
  1. <bước 1>
- **Kết quả mong đợi:** <expect gì>
- **Priority:** High | Medium | Low
```

### Bước 4 — Cập nhật test-cases

Thêm TC mới vào cuối `docs/test-cases/<feature>/<page>.test-cases.md` với happy path + edge cases.

### Bước 5 — Cập nhật POM nếu cần

Nếu TC mới cần locator chưa có trong POM:
- Inspect element thật bằng Playwright MCP
- Thêm locator vào constructor
- Thêm method tương ứng

### Bước 6 — Thêm test vào test file

Append vào cuối `tests/e2e/<feature>/<page>.spec.ts`, bên trong `test.describe` block:

```typescript
test('TC-00X: <mô tả>', async ({ page }) => {
  const po = new <Page>Page(page);
  await po.goto();
  // ...
});
```

### Bước 7 — Chạy chỉ TC mới

```
npx playwright test tests/e2e/<feature>/<page>.spec.ts --grep "TC-00X" --headed
```

Nếu pass → in `✅ TC-00X added and passing`
Nếu fail → debug và sửa trước khi báo xong
