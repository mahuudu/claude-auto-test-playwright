# Cart — Test Spec

## Meta
- URL: https://your-site.com/cart
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
- Trang giỏ hàng hiển thị trạng thái empty khi chưa có item
- Flow thêm plan từ trang /plans vào giỏ hàng rồi kiểm tra cart
- Xóa item khỏi giỏ hàng
- Điều hướng từ cart sang checkout
- Cart icon badge trên header đồng bộ với số lượng item

## Test Cases

### TC-001: Hiển thị empty state khi giỏ hàng trống
- **Mục tiêu:** Kiểm tra trang cart hiển thị đúng khi không có item nào
- **Điều kiện:** Chưa thêm bất kỳ item nào vào giỏ hàng
- **Các bước:**
  1. Truy cập https://your-site.com/cart
  2. Quan sát nội dung trang
- **Kết quả mong đợi:** Hiển thị icon giỏ hàng trống, text "Your Cart is empty", subtext "Looks like you haven't added anything to your cart yet", nút "Go Home"
- **Priority:** High

### TC-002: Thêm plan từ trang Plans vào giỏ hàng
- **Mục tiêu:** Kiểm tra flow thêm plan từ /plans và xác nhận item xuất hiện trong cart
- **Điều kiện:** Giỏ hàng đang trống
- **Các bước:**
  1. Truy cập https://your-site.com/plans
  2. Chọn một plan bất kỳ
  3. Click nút thêm vào giỏ hàng (Add to Cart / Get This Plan)
  4. Điều hướng đến https://your-site.com/cart
- **Kết quả mong đợi:** Cart hiển thị plan vừa thêm với tên plan, giá, và tổng tiền; không còn hiển thị empty state
- **Priority:** High

### TC-003: Cart icon badge cập nhật sau khi thêm plan
- **Mục tiêu:** Kiểm tra số lượng trên cart icon header đồng bộ sau khi thêm item
- **Điều kiện:** Giỏ hàng đang trống (badge = 0 hoặc không hiển thị)
- **Các bước:**
  1. Truy cập https://your-site.com/plans
  2. Thêm một plan vào giỏ hàng
  3. Quan sát cart icon trên header
- **Kết quả mong đợi:** Cart icon hiển thị badge với số lượng = 1
- **Priority:** High

### TC-004: Xóa item khỏi giỏ hàng
- **Mục tiêu:** Kiểm tra chức năng xóa item và cart trở về empty state
- **Điều kiện:** Giỏ hàng có ít nhất 1 item (đã thêm plan từ /plans)
- **Các bước:**
  1. Truy cập https://your-site.com/cart
  2. Click nút xóa (Remove / Delete) trên item
  3. Xác nhận xóa nếu có dialog
- **Kết quả mong đợi:** Item bị xóa khỏi danh sách, cart hiển thị lại empty state "Your Cart is empty"
- **Priority:** High

### TC-005: Điều hướng sang trang Checkout từ cart có item
- **Mục tiêu:** Kiểm tra nút Proceed to Checkout dẫn đến trang checkout
- **Điều kiện:** Giỏ hàng có ít nhất 1 item
- **Các bước:**
  1. Truy cập https://your-site.com/cart
  2. Click nút "Proceed to Checkout" hoặc "Checkout"
- **Kết quả mong đợi:** Điều hướng đến trang checkout (URL chứa /checkout)
- **Priority:** High

### TC-006: Nút "Go Home" từ empty cart điều hướng về trang chủ
- **Mục tiêu:** Kiểm tra nút Go Home hoạt động đúng
- **Điều kiện:** Giỏ hàng trống
- **Các bước:**
  1. Truy cập https://your-site.com/cart
  2. Click nút "Go Home"
- **Kết quả mong đợi:** Điều hướng về trang chủ (URL = https://your-site.com/)
- **Priority:** Medium

### TC-007: Breadcrumb hiển thị đúng trên trang cart
- **Mục tiêu:** Kiểm tra breadcrumb navigation hiển thị đúng
- **Điều kiện:** Truy cập trang cart (bất kể có item hay không)
- **Các bước:**
  1. Truy cập https://your-site.com/cart
  2. Quan sát breadcrumb phía trên nội dung trang
- **Kết quả mong đợi:** Breadcrumb hiển thị "Home > Shopping Cart"
- **Priority:** Low

### TC-008: Thông tin plan trong cart hiển thị đầy đủ
- **Mục tiêu:** Kiểm tra chi tiết item trong cart hiển thị đúng (tên, giá, mô tả)
- **Điều kiện:** Giỏ hàng có 1 plan đã thêm từ /plans
- **Các bước:**
  1. Thêm plan từ https://your-site.com/plans
  2. Truy cập https://your-site.com/cart
  3. Quan sát thông tin plan được hiển thị
- **Kết quả mong đợi:** Hiển thị đúng tên plan, giá, và tổng tiền khớp với thông tin trên trang plans
- **Priority:** High
