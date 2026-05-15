# Checkout Flow — Manual Test Cases

## Meta
- Spec: docs/specs/checkout/checkout.spec.md
- Created: 2026-05-14

---

## TC-001: Chọn plan và thêm vào giỏ hàng thành công

### Happy path
- **Input:** Data: 10GB, Duration: 1 tháng, SIM: SIM Card
- **Steps:**
  1. Mở https://your-site.com/plans
  2. Click tab "10GB"
  3. Click "1 Month"
  4. Click "SIM Card"
  5. Click "Buy Now"
- **Expected:** URL chuyển sang /cart; plan "10GB/mo Plan" hiển thị trong giỏ hàng

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Chọn plan nhỏ nhất | 1GB, 1 tháng | Thêm vào cart thành công |
| Chọn plan lớn nhất | Unlimited, 1 tháng | Thêm vào cart thành công |

### Failure classification guide
- `app bug` — Click Buy Now nhưng không chuyển sang /cart
- `selector issue` — Tab data amount không click được
- `flaky` — Đôi khi chuyển trang, đôi khi không

---

## TC-002: Giỏ hàng hiển thị đúng thông tin plan đã chọn

### Happy path
- **Input:** Plan đã thêm từ TC-001 (10GB, 1 tháng, SIM Card)
- **Steps:**
  1. Sau khi Buy Now, quan sát trang /cart
  2. Kiểm tra tên plan, nút Proceed Checkout
- **Expected:** Text khớp pattern `/\d+GB\/mo Plan/`; nút "Proceed Checkout" visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Truy cập cart trực tiếp không có plan | URL /cart trực tiếp | Hiển thị "Your Cart is empty" + "Go Home" |

### Failure classification guide
- `app bug` — Giá trong cart khác giá trên trang Plans
- `selector issue` — Không tìm thấy element hiển thị thông tin plan

---

## TC-003: Hoàn thành checkout với Stripe card hợp lệ

### Form fields (theo thứ tự trên màn hình)
1. First Name
2. Last Name
3. Email Address
4. Phone Number (format: XXX-XXX-XXXX)
5. Create Account Password
6. Zip Code
7. Address (có autocomplete — phải click suggestion)
8. Apt, suite, unit, etc *(optional)*
9. *(Stripe iframe)* Card Number: `4242 4242 4242 4242`
10. *(Stripe iframe)* Expiration Date: `MM / YY`
11. *(Stripe iframe)* Security Code: `CVC`

### Happy path
- **Input:**
  - First Name: "ma" | Last Name: "du"
  - Email: "dma+400@softel.vn" | Phone: "232-131-2312"
  - Password: "7777777777" | Zip: "77099"
  - Address: "8811 Boone Rd, Houston, TX"
  - Card: "4242 4242 4242 4242" | Expiry: "12/26" | CVC: "123"
- **Steps:**
  1. Từ /cart, click "Proceed Checkout"
  2. Điền billing form theo thứ tự
  3. Click suggestion autocomplete cho address
  4. Trong section "Payment Option", click accordion button "Card" (role=button, data-value="card", aria-expanded="false") để mở Stripe card inputs
  5. Đợi Stripe card input iframes load (card number input visible)
  6. Điền card details trong Stripe iframe
  7. Verify "Your card number is incomplete." KHÔNG hiển thị
  8. Click "Place Order"
- **Expected:** URL chuyển sang /confirmation hoặc /success

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Email không hợp lệ | "notanemail" | Lỗi validation trước khi đến Stripe |
| Phone không đủ số | "123" | Lỗi validation |
| Password quá ngắn | "123" | Lỗi yêu cầu độ dài tối thiểu |
| Stripe chưa load | Click Place Order ngay | Stripe báo card incomplete |
| Apt/suite để trống | (để trống) | Cho phép submit (optional) |

### Failure classification guide
- `app bug` — Submit thành công nhưng không chuyển trang xác nhận
- `test bug` — Không click autocomplete suggestion; Stripe fill không thực thi
- `selector issue` — Không tìm thấy Stripe iframe inputs
- `environment issue` — Stripe API timeout; payment gateway không phản hồi

---

## [DEPRECATED] TC-004: Chọn eSIM hiển thị bước xác minh IMEI

### Happy path
- **Input:** Data: 6GB, Duration: 1 tháng, SIM: eSIM
- **Steps:**
  1. Mở /plans
  2. Chọn 6GB, 1 tháng
  3. Click "eSIM"
- **Expected:** Section "Verify your device" xuất hiện; input IMEI visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Đổi từ eSIM sang SIM Card | Click SIM Card sau khi đã chọn eSIM | IMEI section ẩn đi |

### Failure classification guide
- `app bug` — Click eSIM nhưng IMEI input không xuất hiện
- `selector issue` — Button eSIM không tìm thấy

---

## TC-005: Chọn plan 3 tháng và kiểm tra giá discount

### Happy path
- **Input:** Data: 10GB, Duration: 3 tháng, SIM: SIM Card
- **Steps:**
  1. Mở /plans, chọn 10GB, click "3 Months", click "Buy Now"
- **Expected:** Cart hiển thị plan; Billing Summary visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| So sánh giá 1 tháng vs 3 tháng | Chọn lần lượt | Giá/tháng của 3 tháng thấp hơn |

### Failure classification guide
- `app bug` — Giá không thay đổi khi chọn duration khác

---

## TC-006: Giữ số điện thoại cũ (number portability)

### Happy path
- **Input:** Số điện thoại: "2125559876"
- **Steps:**
  1. Mở /plans, chọn plan bất kỳ
  2. Nhập "2125559876" vào trường "Want to keep your phone number?"
  3. Click "Buy Now"
- **Expected:** Cart hiển thị plan thành công

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Bỏ trống | (để trống) | Cho phép tiếp tục (optional) |

### Failure classification guide
- `selector issue` — Input field không tìm thấy

---

## TC-007: Giỏ hàng trống khi truy cập trực tiếp /cart

### Happy path
- **Input:** Không có plan trong giỏ
- **Steps:** Mở trực tiếp https://your-site.com/cart
- **Expected:** Text "Your Cart is empty"; nút "Go Home" visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click "Go Home" | Click button | Chuyển về trang chủ (/) |

### Failure classification guide
- `app bug` — Trang /cart crash hoặc redirect sai

---

## TC-008: Validation form checkout — bỏ trống trường bắt buộc

### Happy path
- **Input:** Tất cả trường để trống
- **Steps:**
  1. Vào trang checkout (sau khi có plan trong cart)
  2. Không điền gì, click "Place Order"
- **Expected:** Lỗi validation hiển thị; URL vẫn là /checkout

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Chỉ bỏ trống Email | Điền đủ trừ email | Lỗi chỉ hiện ở trường email |
| Whitespace only | "   " trong First Name | Coi như trống, hiện lỗi |

### Failure classification guide
- `app bug` — Form submit được dù thiếu trường bắt buộc
- `selector issue` — Không tìm thấy error message elements

---

## TC-009: Stripe payment với thẻ bị từ chối

### Happy path (decline scenario)
- **Input:**
  - Billing form: giống TC-003
  - Card Number: "4000 0000 0000 0002" (Stripe test — always declined)
  - Expiry: "12/26" | CVC: "123"
- **Steps:**
  1. Hoàn thành billing form
  2. Trong section "Payment Option", click accordion button "Card" (role=button, data-value="card")
  3. Đợi Stripe card input iframes load
  4. Điền card bị từ chối
  5. Click "Place Order"
- **Expected:** Thông báo lỗi từ Stripe hiển thị; URL vẫn là /checkout

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Card number không đủ 16 số | "4242 4242" | Stripe báo lỗi format |
| Expiry đã hết hạn | "01/20" | Stripe báo expiration error |
| CVC sai độ dài | "12" | Stripe báo lỗi CVC |

### Failure classification guide
- `app bug` — Thẻ bị từ chối nhưng app vẫn chuyển trang thành công
- `test bug` — Assertion sai error message pattern
- `selector issue` — Stripe iframe inputs không điền được
- `environment issue` — Stripe test mode không hoạt động
