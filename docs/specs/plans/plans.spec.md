# Plans — Test Spec

## Meta
- URL: https://your-site.com/plans
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
Trang chọn plan prepaid — kiểm tra data plan tabs, duration selector, SIM type, phone number input, Buy Now CTA, và family plan section.

## Test Cases

### TC-001: Page loads with correct heading
- **Mục tiêu:** Xác nhận trang plans load thành công với heading đúng
- **Điều kiện:** Truy cập /plans
- **Các bước:**
  1. Mở https://your-site.com/plans
  2. Chờ trang load xong
- **Kết quả mong đợi:** Heading "Discover Flexible Plan Options Today" hiển thị
- **Priority:** High

### TC-002: Data plan tabs hiển thị và có thể chọn
- **Mục tiêu:** Xác nhận tất cả 8 data plan tabs đều hiển thị
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Quan sát data plan tabs
- **Kết quả mong đợi:** Các tab 1GB, 3GB, 6GB, 10GB, 12GB, 16GB, 25GB, Unlimited đều visible
- **Priority:** High

### TC-003: Chọn data plan tab cập nhật giá
- **Mục tiêu:** Xác nhận khi chọn tab khác, giá hiển thị thay đổi
- **Điều kiện:** Trang plans đã load, đang ở tab mặc định
- **Các bước:**
  1. Mở trang plans
  2. Click tab "3GB"
  3. Quan sát giá hiển thị
- **Kết quả mong đợi:** Tab "3GB" được chọn (active state), giá hiển thị tương ứng với plan 3GB
- **Priority:** High

### TC-004: SIM type selector hiển thị SIM Card và eSIM
- **Mục tiêu:** Xác nhận có thể chọn giữa SIM Card và eSIM
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Tìm SIM type selector
  3. Quan sát các option
- **Kết quả mong đợi:** Cả "SIM Card" và "eSIM" đều hiển thị và có thể chọn
- **Priority:** Medium

### TC-005: Phone number input nhận số điện thoại
- **Mục tiêu:** Xác nhận field phone number hiển thị và có thể nhập
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Tìm phone number input
  3. Nhập số điện thoại "(404) 404-4040"
- **Kết quả mong đợi:** Input nhận giá trị, không bị block
- **Priority:** Medium

### TC-006: Click "Buy now" thêm plan vào giỏ hàng
- **Mục tiêu:** Xác nhận Buy now button thêm plan vào cart — cart badge tăng lên, trang KHÔNG điều hướng
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Ghi nhận cart badge hiện tại (mặc định 0 hoặc không hiển thị)
  3. Click "Buy now"
- **Kết quả mong đợi:** Cart badge tăng lên 1, URL vẫn là /plans (không có navigation)
- **Priority:** High

### TC-006b: Click "Buy now" nhiều lần tăng cart badge theo từng lần
- **Mục tiêu:** Xác nhận mỗi lần click Buy now đều tăng cart badge thêm 1
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Click "Buy now" lần 1 — ghi nhận badge = 1
  3. Click "Buy now" lần 2 — ghi nhận badge = 2
- **Kết quả mong đợi:** Badge tăng theo mỗi lần click, URL không thay đổi
- **Priority:** Medium

### TC-007: Family plan section hiển thị discount tiers
- **Mục tiêu:** Xác nhận section "Save More As A Family!" hiển thị với các discount tiers
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Scroll đến section "Save More As A Family!"
- **Kết quả mong đợi:** Section heading hiển thị, có ít nhất 2 discount tier cards visible
- **Priority:** Medium

### TC-008: FAQ accordion mở/đóng khi click
- **Mục tiêu:** Xác nhận FAQ items có thể expand/collapse
- **Điều kiện:** Trang plans đã load
- **Các bước:**
  1. Mở trang plans
  2. Scroll đến section FAQs
  3. Click vào FAQ item đầu tiên
- **Kết quả mong đợi:** FAQ item expand, nội dung câu trả lời hiển thị
- **Priority:** Low
