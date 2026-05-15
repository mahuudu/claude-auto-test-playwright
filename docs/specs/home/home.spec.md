# Home — Test Spec

## Meta
- URL: https://your-site.com/
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
Trang chủ AirVoice Wireless — kiểm tra hero section, navigation, các CTA chính, sections nội dung, và newsletter form.

## Test Cases

### TC-001: Page loads with correct title and hero section
- **Mục tiêu:** Xác nhận trang chủ load thành công với title và hero heading đúng
- **Điều kiện:** Người dùng chưa đăng nhập, truy cập URL gốc
- **Các bước:**
  1. Mở https://your-site.com/
  2. Chờ trang load xong
- **Kết quả mong đợi:** Title là "AirVoice Wireless | #1 PrePaid Plans and Phones", hero heading "Stop Overpaying. Start Saving with AirVoice." hiển thị
- **Priority:** High

### TC-002: Navigation bar hiển thị đầy đủ các links
- **Mục tiêu:** Xác nhận nav bar có đủ Plans, Phones, Coverage, Support, Sign In
- **Điều kiện:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Quan sát navigation bar
- **Kết quả mong đợi:** Các link Plans, Phones, Coverage, Support, Sign In đều hiển thị trong nav
- **Priority:** High

### TC-003: Click "View All Plans" điều hướng đến trang plans
- **Mục tiêu:** Xác nhận CTA "View All Plans" dẫn đến /plans
- **Điều kiện:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Click button/link "View All Plans"
- **Kết quả mong đợi:** URL chuyển sang /plans (hoặc có chứa /plans)
- **Priority:** High

### TC-004: Click "Shop Phones" điều hướng đến trang phones
- **Mục tiêu:** Xác nhận CTA "Shop Phones" dẫn đến /phones
- **Điều kiện:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Click button/link "Shop Phones"
- **Kết quả mong đợi:** URL chuyển sang /phones (hoặc có chứa /phones)
- **Priority:** Medium

### TC-005: Click nav link "Plans" điều hướng đúng
- **Mục tiêu:** Xác nhận nav link Plans hoạt động
- **Điều kiện:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Click "Plans" trong navigation
- **Kết quả mong đợi:** URL chuyển sang /plans
- **Priority:** High

### TC-006: Click nav link "Sign In" điều hướng đến trang đăng nhập
- **Mục tiêu:** Xác nhận nav link Sign In dẫn đến /sign-in
- **Điều kiện:** Trang chủ đã load, chưa đăng nhập
- **Các bước:**
  1. Mở trang chủ
  2. Click "Sign In" trong navigation
- **Kết quả mong đợi:** URL chuyển sang /sign-in
- **Priority:** High

### TC-007: Section "Discover Our Plans" hiển thị các plan cards
- **Mục tiêu:** Xác nhận section plans hiển thị ít nhất 1 plan card với thông tin giá
- **Điều kiện:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Scroll đến section "Discover Our Plans"
- **Kết quả mong đợi:** Section heading hiển thị, có ít nhất 1 plan card với giá tiền
- **Priority:** Medium

### TC-008: Newsletter form nhận email và có nút Subscribe
- **Mục tiêu:** Xác nhận newsletter form hiển thị đúng với input email và nút Subscribe
- **Điều kin:** Trang chủ đã load
- **Các bước:**
  1. Mở trang chủ
  2. Scroll đến cuối trang, tìm newsletter section
  3. Quan sát form
- **Kết quả mong đợi:** Input email và button "Subscribe" đều hiển thị và có thể tương tác
- **Priority:** Low
