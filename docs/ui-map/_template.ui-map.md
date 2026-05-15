# <Tên trang> — UI Map

## Meta
- URL: <URL đầy đủ>
- Inspected: <ngày inspect>
- Tool: Playwright MCP

---

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| <Tên element> | `page.getByRole('heading', { level: 1 })` | <Ghi chú nếu có> |
| <Tên element> | `page.getByLabel('...')` | |
| <Tên element> | `page.getByPlaceholder('...')` | |
| <Tên element> | `page.getByRole('button', { name: /.../ })` | |
| <Tên element> | `page.getByText(/.../)` | Chỉ hiện khi... |

<!-- Thứ tự ưu tiên locator:
  1. getByRole(...)
  2. getByLabel(...)
  3. getByPlaceholder(...)
  4. getByText(...)
  5. locator('[data-testid="..."]')   ← chỉ dùng khi không còn cách nào khác
  KHÔNG dùng: CSS selector phức tạp, XPath, waitForTimeout
-->

---

## Navigation flows

| Action | Result URL |
|--------|-----------|
| <Hành động> | <URL sau khi thực hiện> |
| <Hành động> | <URL sau khi thực hiện> |
