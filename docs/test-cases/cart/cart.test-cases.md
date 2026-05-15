# Cart — Manual Test Cases

## Meta
- Spec: docs/specs/cart/cart.spec.md
- Created: 2026-05-14

---

## TC-001: Hiển thị empty state khi giỏ hàng trống

### Happy path
- **Input:** Truy cập /cart khi session không có item nào
- **Steps:** Mở https://your-site.com/cart
- **Expected:** Icon giỏ hàng trống hiển thị, heading "Your Cart is empty", subtext "Looks like you haven't added anything to your cart yet", nút "Go Home" màu cam

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Reload trang | F5 trên /cart | Vẫn hiển thị empty state, không bị lỗi |
| Truy cập trực tiếp qua URL | Paste URL /cart vào browser | Empty state hiển thị đúng |
| Sau khi xóa hết item | Xóa item cuối cùng | Chuyển sang empty state ngay lập tức |

### Failure classification guide
- `app bug` — Empty state không hiển thị dù không có item
- `test bug` — Assertion sai locator của heading/subtext
- `selector issue` — Locator "Your Cart is empty" không tìm thấy
- `flaky` — Trang load chậm, empty state chưa render kịp
- `environment issue` — Session cookie cũ còn item từ lần trước

---

## TC-002: Thêm plan từ trang Plans vào giỏ hàng

### Happy path
- **Input:** Chọn một plan bất kỳ trên trang /plans, click Add to Cart
- **Steps:**
  1. Mở https://your-site.com/plans
  2. Chọn plan (ví dụ: plan đầu tiên trong danh sách)
  3. Click nút "Add to Cart" hoặc "Get This Plan"
  4. Điều hướng đến /cart
- **Expected:** Cart hiển thị plan vừa chọn, không còn empty state

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Thêm cùng plan 2 lần | Click Add to Cart 2 lần cho cùng 1 plan | Số lượng tăng lên 2 HOẶC chỉ giữ 1 (tùy business logic) |
| Thêm plan khi chưa đăng nhập | Guest user thêm plan | Cho phép thêm vào cart hoặc redirect đến sign-in |
| Thêm nhiều plan khác nhau | Thêm 2 plan khác loại | Cả 2 plan xuất hiện trong cart |

### Failure classification guide
- `app bug` — Nút Add to Cart không phản hồi, hoặc item không xuất hiện trong cart
- `test bug` — Flow điều hướng sai, không đến đúng trang plans
- `selector issue` — Không tìm thấy nút Add to Cart trên plans page
- `flaky` — Cart update bất đồng bộ, cần chờ network request hoàn thành
- `environment issue` — Plans page không load được do API lỗi

---

## TC-003: Cart icon badge cập nhật sau khi thêm plan

### Happy path
- **Input:** Thêm 1 plan từ /plans
- **Steps:**
  1. Mở /plans
  2. Thêm 1 plan vào cart
  3. Quan sát cart icon trên header
- **Expected:** Badge trên cart icon hiển thị số "1"

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Badge khi cart trống | Không có item | Badge không hiển thị hoặc hiển thị "0" |
| Thêm 2 items | Thêm 2 plan khác nhau | Badge hiển thị "2" |
| Reload trang sau khi thêm | F5 sau khi thêm plan | Badge vẫn giữ nguyên số lượng |

### Failure classification guide
- `app bug` — Badge không cập nhật sau khi thêm item
- `test bug` — Assertion badge count sai
- `selector issue` — Không tìm thấy cart icon badge element
- `flaky` — Badge update delay do state management async
- `environment issue` — LocalStorage/cookie bị clear giữa chừng

---

## TC-004: Xóa item khỏi giỏ hàng

### Happy path
- **Input:** Cart có 1 plan, click nút xóa
- **Steps:**
  1. Thêm plan từ /plans
  2. Vào /cart
  3. Click nút Remove/Delete trên item
  4. Xác nhận nếu có dialog
- **Expected:** Item biến mất, cart hiển thị empty state

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Xóa 1 trong 2 items | Cart có 2 items, xóa 1 | Còn lại 1 item, tổng tiền cập nhật |
| Xóa item cuối | Cart có 1 item, xóa | Empty state hiển thị |
| Cancel xóa (nếu có confirm dialog) | Click xóa rồi cancel | Item vẫn còn trong cart |

### Failure classification guide
- `app bug` — Item không bị xóa sau khi click Remove, hoặc tổng tiền không cập nhật
- `test bug` — Assertion sau khi xóa kiểm tra sai element
- `selector issue` — Không tìm thấy nút Remove/Delete
- `flaky` — Animation xóa item chưa xong, assertion chạy quá sớm
- `environment issue` — API xóa item bị lỗi 500

---

## TC-005: Điều hướng sang trang Checkout từ cart có item

### Happy path
- **Input:** Cart có 1 plan, click Proceed to Checkout
- **Steps:**
  1. Thêm plan từ /plans
  2. Vào /cart
  3. Click nút "Proceed to Checkout" hoặc "Checkout"
- **Expected:** URL chuyển sang /checkout hoặc URL chứa "checkout"

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Checkout khi chưa đăng nhập | Guest user click Checkout | Redirect đến /sign-in hoặc cho phép guest checkout |
| Checkout khi đã đăng nhập | Logged-in user click Checkout | Chuyển thẳng đến /checkout |

### Failure classification guide
- `app bug` — Nút Checkout không hoạt động hoặc redirect sai URL
- `test bug` — URL assertion pattern sai
- `selector issue` — Không tìm thấy nút Checkout
- `flaky` — Redirect chậm, assertion URL chạy trước khi navigation hoàn thành
- `environment issue` — Auth service không phản hồi

---

## TC-006: Nút "Go Home" từ empty cart điều hướng về trang chủ

### Happy path
- **Input:** Cart trống, click "Go Home"
- **Steps:**
  1. Vào /cart (không có item)
  2. Click nút "Go Home"
- **Expected:** URL chuyển về https://your-site.com/

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click Go Home nhiều lần | Double click | Chỉ navigate 1 lần, không bị lỗi |

### Failure classification guide
- `app bug` — Nút Go Home không navigate hoặc navigate sai URL
- `test bug` — URL assertion quá strict (trailing slash)
- `selector issue` — Không tìm thấy nút "Go Home"
- `flaky` — Navigation chậm
- `environment issue` — Không liên quan

---

## TC-007: Breadcrumb hiển thị đúng trên trang cart

### Happy path
- **Input:** Truy cập /cart
- **Steps:** Mở https://your-site.com/cart, quan sát breadcrumb
- **Expected:** Breadcrumb hiển thị "Home > Shopping Cart" (hoặc icon home + "Shopping Cart")

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Cart có item | Cart với 1 plan | Breadcrumb vẫn hiển thị đúng |
| Cart trống | Không có item | Breadcrumb hiển thị đúng |

### Failure classification guide
- `app bug` — Breadcrumb hiển thị sai text hoặc không hiển thị
- `test bug` — Assertion text breadcrumb không khớp (case sensitive)
- `selector issue` — Không tìm thấy breadcrumb element
- `flaky` — Không liên quan
- `environment issue` — Không liên quan

---

## TC-008: Thông tin plan trong cart hiển thị đầy đủ

### Happy path
- **Input:** Thêm plan từ /plans, vào /cart
- **Steps:**
  1. Ghi nhớ tên và giá plan trên trang /plans
  2. Click Add to Cart
  3. Vào /cart
  4. So sánh thông tin hiển thị
- **Expected:** Tên plan, giá khớp với thông tin trên trang /plans; tổng tiền = giá plan

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Plan có giá $0 hoặc free trial | Thêm plan miễn phí | Hiển thị $0.00 hoặc "Free", không bị lỗi |
| Plan có tên dài | Plan name > 50 ký tự | Tên hiển thị đầy đủ hoặc truncate có tooltip |

### Failure classification guide
- `app bug` — Giá hoặc tên plan trong cart khác với trang plans
- `test bug` — So sánh giá sai format (string vs number)
- `selector issue` — Không tìm thấy element hiển thị tên/giá plan
- `flaky` — Data load async, plan info chưa render kịp
- `environment issue` — API plans trả về data khác nhau giữa 2 request
