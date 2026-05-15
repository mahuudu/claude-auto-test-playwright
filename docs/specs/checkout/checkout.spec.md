# Checkout Flow — Test Spec

## Meta
- URL: https://your-site.com/plans → /cart → /checkout
- Created: 2026-05-14
- Priority: High

## Phạm vi kiểm tra
Flow mua hàng end-to-end: chọn plan → thêm vào giỏ → điền billing form → nhập thẻ Stripe → Place Order. Checkout không thể truy cập trực tiếp — phải đi qua Plans → Cart.

## Test Cases

### TC-001: Chọn plan và thêm vào giỏ hàng thành công
- **Mục tiêu:** Xác nhận người dùng có thể chọn plan và chuyển sang trang Cart
- **Điều kiện:** Truy cập trang /plans, chưa có gì trong giỏ
- **Các bước:**
  1. Mở https://your-site.com/plans
  2. Chọn mức data (ví dụ: 10GB)
  3. Chọn thời hạn 1 tháng
  4. Chọn loại SIM: SIM Card
  5. Click "Buy Now"
- **Kết quả mong đợi:** Chuyển sang trang /cart, hiển thị plan vừa chọn trong giỏ hàng
- **Priority:** High

### TC-002: Giỏ hàng hiển thị đúng thông tin plan đã chọn
- **Mục tiêu:** Xác nhận Cart hiển thị đúng tên plan và nút Proceed Checkout
- **Điều kiện:** Đã thêm plan vào giỏ từ TC-001
- **Các bước:**
  1. Sau khi click Buy Now, quan sát trang /cart
  2. Kiểm tra tên plan, giá tiền hiển thị
  3. Kiểm tra nút "Proceed Checkout" hiển thị
- **Kết quả mong đợi:** Thông tin plan hiển thị đúng; nút Proceed Checkout visible
- **Priority:** High

### TC-003: Hoàn thành checkout với Stripe card hợp lệ
- **Mục tiêu:** Xác nhận toàn bộ flow: billing form → Stripe card → Place Order → confirmation
- **Điều kiện:** Có plan trong giỏ hàng, đang ở trang /cart
- **Các bước:**
  1. Click "Proceed Checkout"
  2. Điền First Name: "ma"
  3. Điền Last Name: "du"
  4. Điền Email Address: "dma+400@softel.vn"
  5. Điền Phone Number: "232-131-2312"
  6. Điền Create Account Password: "7777777777"
  7. Điền Zip Code: "77099"
  8. Điền Address: "8811 Boone Rd" → chọn suggestion "8811 Boone Rd, Houston, TX"
  9. Để trống Apt, suite, unit, etc
  10. Trong section "Payment Option", click accordion button "Card" (role=button, data-value=card) để mở Stripe card inputs
  11. Đợi Stripe card input iframes load (card number input xuất hiện)
  12. Điền Card Number: "4242 4242 4242 4242"
  12. Điền Expiration Date: "12/26"
  13. Điền Security Code: "123"
  14. Click "Place Order"
- **Kết quả mong đợi:** Chuyển sang trang xác nhận (/confirmation hoặc /success)
- **Priority:** High

### [DEPRECATED] TC-004: Chọn eSIM hiển thị bước xác minh IMEI
- **Mục tiêu:** Xác nhận chọn eSIM mở ra trường nhập IMEI
- **Điều kiện:** Truy cập trang /plans
- **Các bước:**
  1. Mở https://your-site.com/plans
  2. Chọn mức data bất kỳ
  3. Click "eSIM"
- **Kết quả mong đợi:** Hiển thị section "Verify your device" và input IMEI
- **Priority:** Medium

### TC-005: Chọn plan 3 tháng và kiểm tra giá discount
- **Mục tiêu:** Xác nhận giá discount được áp dụng khi chọn thời hạn dài hơn
- **Điều kiện:** Truy cập trang /plans
- **Các bước:**
  1. Mở https://your-site.com/plans
  2. Chọn mức data 10GB
  3. Click "3 Months"
  4. Click "Buy Now"
- **Kết quả mong đợi:** Cart hiển thị plan 3 tháng; Billing Summary visible
- **Priority:** Medium

### TC-006: Giữ số điện thoại cũ (number portability)
- **Mục tiêu:** Xác nhận trường nhập số điện thoại cũ hoạt động
- **Điều kiện:** Truy cập trang /plans
- **Các bước:**
  1. Mở https://your-site.com/plans
  2. Chọn plan bất kỳ
  3. Nhập số điện thoại vào trường "Want to keep your phone number?"
  4. Click "Buy Now"
- **Kết quả mong đợi:** Cart hiển thị plan đã chọn thành công
- **Priority:** Medium

### TC-007: Giỏ hàng trống khi truy cập trực tiếp /cart
- **Mục tiêu:** Xác nhận trạng thái empty cart hiển thị đúng
- **Điều kiện:** Truy cập /cart mà không thêm plan
- **Các bước:**
  1. Mở trực tiếp https://your-site.com/cart
- **Kết quả mong đợi:** Hiển thị "Your Cart is empty" và nút "Go Home"
- **Priority:** Low

### TC-008: Validation form checkout — bỏ trống trường bắt buộc
- **Mục tiêu:** Xác nhận form checkout báo lỗi khi thiếu thông tin bắt buộc
- **Điều kiện:** Đang ở trang /checkout với plan trong giỏ
- **Các bước:**
  1. Vào trang checkout
  2. Để trống tất cả các trường
  3. Click "Place Order"
- **Kết quả mong đợi:** Hiển thị lỗi validation; form không submit; URL vẫn là /checkout
- **Priority:** High

### TC-009: Stripe payment với thẻ bị từ chối
- **Mục tiêu:** Xác nhận Stripe báo lỗi khi thẻ bị từ chối
- **Điều kiện:** Đã điền đầy đủ billing form, Stripe iframe đã load
- **Các bước:**
  1. Hoàn thành billing form (giống TC-003 bước 1–9)
  2. Trong section "Payment Option", click accordion button "Card" (role=button, data-value=card)
  3. Đợi Stripe card input iframes load
  4. Điền Card Number: "4000 0000 0000 0002" (Stripe test card — always declined)
  4. Điền Expiration Date: "12/26"
  5. Điền Security Code: "123"
  6. Click "Place Order"
- **Kết quả mong đợi:** Hiển thị thông báo lỗi từ Stripe; URL vẫn là /checkout
- **Priority:** Medium
