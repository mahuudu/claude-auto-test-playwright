# Sign In — Manual Test Cases

## Meta
- Spec: docs/specs/sign-in.spec.md
- Created: 2026-05-14

## TC-001: Trang sign-in load thành công với form đăng nhập

### Happy path
- **Input:** Truy cập https://your-site.com/sign-in
- **Steps:** Mở URL, chờ networkidle
- **Expected:** Heading "Connect to Your World." visible, input Phone Number/Email visible, input Password visible, button "Login" visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Slow network | Throttle 3G | Form vẫn load, không bị broken layout |
| Direct URL access | Paste URL vào address bar | Không redirect về homepage |

### Failure classification guide
- `app bug` — Trang trả về 404 hoặc redirect sai
- `test bug` — Locator heading sai
- `environment issue` — Server không phản hồi

---

## TC-002: Tab "Account Login" active mặc định

### Happy path
- **Input:** Không có — chỉ quan sát trạng thái UI
- **Steps:** Truy cập /sign-in, không click gì
- **Expected:** Tab "Account Login" có trạng thái active/selected, form hiển thị Phone Number/Email + Password inputs

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Reload trang | F5 sau khi đã switch tab | Tab Account Login vẫn active (không nhớ tab trước) |

### Failure classification guide
- `app bug` — Tab OTP active mặc định thay vì Account Login
- `selector issue` — Không tìm được tab element

---

## TC-003: Chuyển sang tab "OTP Login"

### Happy path
- **Input:** Click tab "OTP Login"
- **Steps:** Truy cập /sign-in → click "OTP Login" tab
- **Expected:** Tab OTP Login active, form thay đổi nội dung (input phone cho OTP xuất hiện, password input ẩn đi)

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click lại Account Login | Click "Account Login" sau khi đã ở OTP | Quay lại form email/password |
| Click nhiều lần | Click OTP → Account → OTP | Form luôn đúng với tab đang active |

### Failure classification guide
- `app bug` — Form không thay đổi khi switch tab
- `selector issue` — Không tìm được tab button
- `flaky` — Tab switch animation gây race condition

---

## TC-004: Login với thông tin hợp lệ điều hướng đến dashboard

### Happy path
- **Input:** Email/phone hợp lệ + password đúng
- **Steps:** Nhập credentials → click Login → chờ redirect
- **Expected:** URL thay đổi khỏi /sign-in (ví dụ: /dashboard hoặc /account), trang account hiển thị

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Phone number format | +1XXXXXXXXXX | Login thành công |
| Email format | user@example.com | Login thành công |
| Remember me checked | Tick checkbox trước khi login | Session được lưu lâu hơn |

### Failure classification guide
- `app bug` — Login thành công nhưng không redirect
- `test bug` — Credentials test không hợp lệ
- `environment issue` — API auth server không phản hồi

---

## TC-005: Login với password sai hiển thị lỗi

### Happy path
- **Input:** Email hợp lệ + password sai ("wrongpassword123")
- **Steps:** Nhập email đúng, password sai → click Login
- **Expected:** Error message hiển thị (text chứa "invalid", "incorrect", hoặc tương tự), URL vẫn là /sign-in

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Email không tồn tại | notexist@test.com + any password | Error message hiển thị |
| Password đúng format nhưng sai | ValidFormat1! | Error message, không redirect |
| Nhiều lần sai liên tiếp | 5 lần sai | Có thể bị rate limit hoặc captcha |

### Failure classification guide
- `app bug` — Login thành công dù password sai
- `app bug` — Không hiển thị error message
- `test bug` — Assertion text error message không khớp

---

## TC-006: Login với fields trống hiển thị validation

### Happy path
- **Input:** Để trống cả 2 fields
- **Steps:** Không nhập gì → click Login
- **Expected:** Validation error hiển thị trên ít nhất 1 field, form không submit

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Chỉ trống Email | Password có giá trị, Email trống | Lỗi validation trên Email field |
| Chỉ trống Password | Email có giá trị, Password trống | Lỗi validation trên Password field |
| Whitespace only | "   " trong Email | Treated as empty, hiện lỗi |

### Failure classification guide
- `app bug` — Form submit với fields trống
- `app bug` — Không hiển thị validation message
- `test bug` — Assertion sai về error message text

---

## TC-007: Click "Forgot password?" điều hướng đến trang reset password

### Happy path
- **Input:** Click link "Forgot password?"
- **Steps:** Truy cập /sign-in → click "Forgot password?"
- **Expected:** URL thay đổi (ví dụ: /forgot-password hoặc /reset-password), trang reset hiển thị

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click sau khi nhập email | Nhập email trước rồi click | Điều hướng vẫn hoạt động |

### Failure classification guide
- `app bug` — Link không điều hướng
- `selector issue` — Không tìm được link "Forgot password?"

---

## TC-008: Social login buttons hiển thị đầy đủ

### Happy path
- **Input:** Không có — chỉ quan sát UI
- **Steps:** Truy cập /sign-in, scroll nếu cần
- **Expected:** 3 buttons Google, Facebook, Apple đều visible trong section "With social"

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Mobile viewport | 375px width | Buttons vẫn hiển thị, không bị overflow |
| Click Google button | Click button Google | Redirect hoặc popup OAuth Google (không test full flow) |

### Failure classification guide
- `app bug` — Một trong 3 buttons không hiển thị
- `selector issue` — Locator button không tìm thấy
- `environment issue` — OAuth provider không load được icon
