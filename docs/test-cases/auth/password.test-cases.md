# Forgot Password — Manual Test Cases

## Meta
- Spec: docs/specs/auth/password.spec.md
- Created: 2026-05-14

## TC-001: Page loads with correct heading and form elements

### Happy path
- **Input:** Truy cập trực tiếp URL https://your-site.com/password
- **Steps:** Mở trang, quan sát UI
- **Expected:** Heading "Forgot Password" hiển thị, input email visible, nút "Send" visible, link "Back to login" visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Slow network | Trang load chậm | Skeleton/spinner hiển thị, form xuất hiện sau khi load xong |
| Direct URL access | /password | Trang load bình thường, không redirect |

### Failure classification guide
- `app bug` — UI/logic sai so với spec
- `test bug` — assertion hoặc flow test sai
- `selector issue` — locator không tìm thấy element
- `flaky` — pass/fail không nhất quán
- `environment issue` — mạng, server, config

---

## TC-002: Submit with valid email shows success feedback

### Happy path
- **Input:** Email hợp lệ: `test@example.com`
- **Steps:** Nhập email → nhấn Send
- **Expected:** Thông báo thành công xuất hiện (ví dụ: "Check your email" hoặc tương tự) hoặc redirect sang trang xác nhận

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Email không tồn tại trong hệ thống | `nonexistent@example.com` | Vẫn hiển thị thông báo thành công (không tiết lộ email có tồn tại hay không) |
| Email có chữ hoa | `TEST@EXAMPLE.COM` | Xử lý case-insensitive, gửi thành công |
| Email có khoảng trắng đầu/cuối | ` test@example.com ` | Trim và xử lý bình thường |

### Failure classification guide
- `app bug` — không hiển thị feedback sau khi submit thành công
- `test bug` — assertion sai về success message
- `selector issue` — không tìm thấy success message element
- `flaky` — network timeout gây ra fail không nhất quán
- `environment issue` — server không phản hồi

---

## TC-003: Submit with empty email shows validation error

### Happy path
- **Input:** Để trống trường email
- **Steps:** Không nhập gì → nhấn Send
- **Expected:** Thông báo lỗi "Email is required" hoặc tương tự xuất hiện ngay dưới input

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Chỉ có khoảng trắng | `   ` | Coi như empty, hiện lỗi validation |
| Tab qua field rồi bỏ trống | (focus rồi blur) | Có thể hiện lỗi inline ngay khi blur |

### Failure classification guide
- `app bug` — không hiện lỗi khi submit empty
- `test bug` — assertion sai về error message text
- `selector issue` — không tìm thấy error element
- `flaky` — timing issue với validation message
- `environment issue` — N/A

---

## TC-004: Submit with invalid email format shows validation error

### Happy path
- **Input:** Email sai định dạng: `notanemail`
- **Steps:** Nhập email sai định dạng → nhấn Send
- **Expected:** Thông báo lỗi định dạng email không hợp lệ

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Thiếu domain | `abc@` | Lỗi "Invalid email format" |
| Thiếu @ | `abcexample.com` | Lỗi "Invalid email format" |
| Domain không hợp lệ | `test@.com` | Lỗi "Invalid email format" |
| Chỉ có @ | `@` | Lỗi "Invalid email format" |

### Failure classification guide
- `app bug` — không validate định dạng email
- `test bug` — assertion sai về error message
- `selector issue` — không tìm thấy error element
- `flaky` — N/A
- `environment issue` — N/A

---

## TC-005: Back to login link navigates to sign-in page

### Happy path
- **Input:** Click link "Back to login"
- **Steps:** Nhấn link "Back to login"
- **Expected:** URL chuyển sang /sign-in hoặc trang đăng nhập

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click sau khi đã nhập email | Email đã nhập, click Back to login | Chuyển hướng bình thường, không cần confirm |
| Right-click → Open in new tab | Link | Mở trang sign-in trong tab mới |

### Failure classification guide
- `app bug` — link không điều hướng đúng
- `test bug` — assertion URL sai
- `selector issue` — không tìm thấy link element
- `flaky` — Next.js routing delay
- `environment issue` — N/A

---

## TC-006: Send button is visible and enabled

### Happy path
- **Input:** Trang load xong
- **Steps:** Quan sát nút Send
- **Expected:** Nút "Send" visible, không disabled, có màu cam (brand color)

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Trong khi đang submit | Sau khi click Send | Nút có thể bị disabled tạm thời để tránh double-submit |

### Failure classification guide
- `app bug` — nút bị disabled hoặc không hiển thị
- `test bug` — assertion sai về trạng thái nút
- `selector issue` — không tìm thấy button element
- `flaky` — N/A
- `environment issue` — N/A

---

## TC-007: Email input accepts text input

### Happy path
- **Input:** Gõ `user@airvoice.com` vào trường email
- **Steps:** Click vào input → gõ email
- **Expected:** Text hiển thị trong input, input có thể focus

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Paste email | Ctrl+V email vào input | Email được paste bình thường |
| Xóa nội dung | Backspace/Delete | Nội dung bị xóa bình thường |
| Max length | Email rất dài (>254 ký tự) | Bị giới hạn hoặc hiện lỗi |

### Failure classification guide
- `app bug` — input không nhận text
- `test bug` — fill() không hoạt động đúng
- `selector issue` — không tìm thấy input element
- `flaky` — N/A
- `environment issue` — N/A
