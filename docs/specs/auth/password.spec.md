# Forgot Password — Test Spec

## Meta
- URL: https://your-site.com/password
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
- Trang Forgot Password cho phép người dùng nhập email để nhận hướng dẫn đặt lại mật khẩu. Kiểm tra hiển thị form, validation, submit, và navigation.

## Test Cases

### TC-001: Page loads with correct heading and form elements
- **Mục tiêu:** Kiểm tra trang Forgot Password hiển thị đầy đủ các thành phần UI
- **Điều kiện:** Người dùng chưa đăng nhập, truy cập trực tiếp URL /password
- **Các bước:**
  1. Mở trình duyệt và truy cập https://your-site.com/password
  2. Quan sát các thành phần trên trang
- **Kết quả mong đợi:** Trang hiển thị heading "Forgot Password", input email, nút "Send", và link "Back to login"
- **Priority:** High

### TC-002: Submit with valid email shows success feedback
- **Mục tiêu:** Kiểm tra khi nhập email hợp lệ và nhấn Send, hệ thống phản hồi thành công
- **Điều kiện:** Trang Forgot Password đã load, email hợp lệ sẵn sàng nhập
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Nhập email hợp lệ vào ô email (ví dụ: test@example.com)
  3. Nhấn nút "Send"
- **Kết quả mong đợi:** Hiển thị thông báo thành công hoặc chuyển hướng xác nhận rằng email đã được gửi
- **Priority:** High

### TC-003: Submit with empty email shows validation error
- **Mục tiêu:** Kiểm tra validation khi để trống trường email
- **Điều kiện:** Trang Forgot Password đã load, trường email để trống
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Để trống trường email
  3. Nhấn nút "Send"
- **Kết quả mong đợi:** Hiển thị thông báo lỗi yêu cầu nhập email (ví dụ: "Email is required" hoặc tương tự)
- **Priority:** High

### TC-004: Submit with invalid email format shows validation error
- **Mục tiêu:** Kiểm tra validation khi nhập email sai định dạng
- **Điều kiện:** Trang Forgot Password đã load
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Nhập email sai định dạng (ví dụ: "notanemail", "abc@", "test@.com")
  3. Nhấn nút "Send"
- **Kết quả mong đợi:** Hiển thị thông báo lỗi định dạng email không hợp lệ
- **Priority:** High

### TC-005: Back to login link navigates to sign-in page
- **Mục tiêu:** Kiểm tra link "Back to login" điều hướng đúng về trang đăng nhập
- **Điều kiện:** Trang Forgot Password đã load
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Nhấn vào link "Back to login"
- **Kết quả mong đợi:** Trang chuyển hướng về /sign-in hoặc trang đăng nhập
- **Priority:** High

### TC-006: Send button is visible and enabled
- **Mục tiêu:** Kiểm tra nút Send hiển thị và có thể tương tác
- **Điều kiện:** Trang Forgot Password đã load
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Quan sát nút "Send"
- **Kết quả mong đợi:** Nút "Send" hiển thị, có màu nổi bật (cam/orange), và không bị disabled
- **Priority:** Medium

### TC-007: Email input accepts text input
- **Mục tiêu:** Kiểm tra trường email có thể nhập liệu bình thường
- **Điều kiện:** Trang Forgot Password đã load
- **Các bước:**
  1. Truy cập https://your-site.com/password
  2. Click vào trường email
  3. Gõ một địa chỉ email
- **Kết quả mong đợi:** Trường email nhận input và hiển thị text đã nhập
- **Priority:** Medium
