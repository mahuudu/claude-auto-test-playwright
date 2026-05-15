# Sign In — Test Spec

## Meta
- URL: https://your-site.com/sign-in
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
- Trang đăng nhập AirVoice Wireless. Kiểm tra form login (email/phone + password), chuyển tab OTP, validation, forgot password, và social login buttons.

## Test Cases

### TC-001: Trang sign-in load thành công với form đăng nhập
- **Mục tiêu:** Xác nhận trang load đúng, hiển thị heading và form login
- **Điều kiện:** Truy cập URL /sign-in, không cần đăng nhập
- **Các bước:**
  1. Mở trình duyệt và truy cập https://your-site.com/sign-in
  2. Chờ trang load hoàn tất
- **Kết quả mong đợi:** Heading "Connect to Your World." hiển thị, form login với input Phone/Email và Password hiển thị, button "Login" hiển thị
- **Priority:** High

### TC-002: Tab "Account Login" active mặc định
- **Mục tiêu:** Xác nhận tab Account Login được chọn mặc định khi vào trang
- **Điều kiện:** Trang sign-in đã load
- **Các bước:**
  1. Truy cập trang sign-in
  2. Quan sát trạng thái các tab
- **Kết quả mong đợi:** Tab "Account Login" active, form hiển thị input Phone Number/Email và Password
- **Priority:** High

### TC-003: Chuyển sang tab "OTP Login"
- **Mục tiêu:** Xác nhận click tab OTP Login chuyển sang form OTP
- **Điều kiện:** Trang sign-in đã load, tab Account Login đang active
- **Các bước:**
  1. Truy cập trang sign-in
  2. Click tab "OTP Login"
- **Kết quả mong đợi:** Tab OTP Login active, form thay đổi (hiển thị input phone number cho OTP)
- **Priority:** Medium

### TC-004: Login với thông tin hợp lệ điều hướng đến dashboard
- **Mục tiêu:** Xác nhận đăng nhập thành công với credentials hợp lệ
- **Điều kiện:** Có tài khoản test hợp lệ
- **Các bước:**
  1. Truy cập trang sign-in
  2. Nhập phone/email hợp lệ vào input Phone Number/Email
  3. Nhập password đúng vào input Password
  4. Click button "Login"
- **Kết quả mong đợi:** Redirect đến trang dashboard hoặc account, URL thay đổi khỏi /sign-in
- **Priority:** High

### TC-005: Login với password sai hiển thị lỗi
- **Mục tiêu:** Xác nhận hệ thống hiển thị thông báo lỗi khi password không đúng
- **Điều kiện:** Trang sign-in đã load
- **Các bước:**
  1. Truy cập trang sign-in
  2. Nhập email/phone hợp lệ
  3. Nhập password sai
  4. Click button "Login"
- **Kết quả mong đợi:** Hiển thị thông báo lỗi (ví dụ: "Invalid credentials" hoặc tương tự), không redirect
- **Priority:** High

### TC-006: Login với fields trống hiển thị validation
- **Mục tiêu:** Xác nhận form không cho submit khi để trống fields bắt buộc
- **Điều kiện:** Trang sign-in đã load
- **Các bước:**
  1. Truy cập trang sign-in
  2. Để trống cả Phone/Email và Password
  3. Click button "Login"
- **Kết quả mong đợi:** Hiển thị lỗi validation trên các field trống, không submit form
- **Priority:** High

### TC-007: Click "Forgot password?" điều hướng đến trang reset password
- **Mục tiêu:** Xác nhận link Forgot password dẫn đến trang đặt lại mật khẩu
- **Điều kiện:** Trang sign-in đã load
- **Các bước:**
  1. Truy cập trang sign-in
  2. Click link "Forgot password?"
- **Kết quả mong đợi:** Điều hướng đến trang forgot/reset password, URL thay đổi
- **Priority:** Medium

### TC-008: Social login buttons hiển thị đầy đủ
- **Mục tiêu:** Xác nhận 3 nút social login (Google, Facebook, Apple) đều hiển thị
- **Điều kiện:** Trang sign-in đã load
- **Các bước:**
  1. Truy cập trang sign-in
  2. Quan sát khu vực "With social"
- **Kết quả mong đợi:** Cả 3 button Google, Facebook, Apple đều hiển thị và có thể click
- **Priority:** Medium
