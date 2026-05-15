# Home — Manual Test Cases

## Meta
- Spec: docs/specs/home/home.spec.md
- Created: 2026-05-14

---

## TC-001: Page loads with correct title and hero section

### Happy path
- **Input:** Truy cập https://your-site.com/
- **Steps:** Mở URL, chờ trang load
- **Expected:** Title = "AirVoice Wireless | #1 PrePaid Plans and Phones", H1 "Stop Overpaying. Start Saving with AirVoice." visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Slow network | Throttle 3G | Trang vẫn load, không bị blank trắng |
| Direct URL | Nhập URL trực tiếp vào address bar | Load đúng, không redirect |

### Failure classification guide
- `app bug` — Title sai hoặc H1 không hiển thị
- `selector issue` — Locator heading không tìm thấy do Next.js hydration chưa xong
- `flaky` — Trang load không ổn định do server

---

## TC-002: Navigation bar hiển thị đầy đủ các links

### Happy path
- **Input:** Trang chủ đã load
- **Steps:** Quan sát nav bar ở top
- **Expected:** Plans, Phones, Coverage, Support, Sign In đều visible trong nav

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Mobile viewport | Resize < 768px | Nav có thể collapse thành hamburger menu |

### Failure classification guide
- `app bug` — Thiếu link trong nav
- `selector issue` — Nav links không tìm thấy bằng getByRole

---

## TC-003: Click "View All Plans" điều hướng đến trang plans

### Happy path
- **Input:** Click button "View All Plans" trên trang chủ
- **Steps:** Mở trang chủ → click "View All Plans"
- **Expected:** URL chứa /plans, trang plans load

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Multiple "View All Plans" | Có thể có nhiều button cùng text | Click button đầu tiên, vẫn dẫn đến /plans |

### Failure classification guide
- `app bug` — Click không dẫn đến /plans
- `selector issue` — Không tìm thấy button do text khác (ví dụ "View Plans")
- `test bug` — URL assertion quá strict

---

## TC-004: Click "Shop Phones" điều hướng đến trang phones

### Happy path
- **Input:** Click button/link "Shop Phones"
- **Steps:** Mở trang chủ → click "Shop Phones"
- **Expected:** URL chứa /phones

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Multiple "Shop Phones" | Có thể có nhiều link | Click đầu tiên, vẫn dẫn đến /phones |

### Failure classification guide
- `app bug` — Không dẫn đến /phones
- `selector issue` — Text button khác với expected

---

## TC-005: Click nav link "Plans" điều hướng đúng

### Happy path
- **Input:** Click "Plans" trong navigation
- **Steps:** Mở trang chủ → click nav link "Plans"
- **Expected:** URL chứa /plans

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Hover state | Hover trước khi click | Không ảnh hưởng đến navigation |

### Failure classification guide
- `app bug` — Nav link dẫn đến URL sai
- `selector issue` — getByRole('link', { name: 'Plans' }) match nhiều element

---

## TC-006: Click nav link "Sign In" điều hướng đến trang đăng nhập

### Happy path
- **Input:** Click "Sign In" trong navigation
- **Steps:** Mở trang chủ → click "Sign In"
- **Expected:** URL chứa /sign-in

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Đã đăng nhập | User đã có session | "Sign In" có thể thay bằng tên user hoặc "My Account" |

### Failure classification guide
- `app bug` — Không dẫn đến /sign-in
- `test bug` — Test không xử lý trường hợp đã đăng nhập

---

## TC-007: Section "Discover Our Plans" hiển thị các plan cards

### Happy path
- **Input:** Scroll đến section plans
- **Steps:** Mở trang chủ → scroll đến "Discover Our Plans"
- **Expected:** Heading "Discover Our Plans" visible, ít nhất 1 plan card với giá hiển thị

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| API chậm | Plans load từ API | Có loading state hoặc skeleton, sau đó hiện plans |
| Không có plans | API trả về rỗng | Hiển thị empty state hoặc fallback |

### Failure classification guide
- `app bug` — Section không hiển thị hoặc plans không load
- `environment issue` — API backend không phản hồi
- `flaky` — Plans load không ổn định

---

## TC-008: Newsletter form nhận email và có nút Subscribe

### Happy path
- **Input:** Scroll đến newsletter section, nhập email hợp lệ
- **Steps:** Mở trang chủ → scroll đến cuối → tìm newsletter form → quan sát
- **Expected:** Input email và button "Subscribe" visible và enabled

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Empty submit | Click Subscribe không nhập email | Validation error hoặc không submit |
| Invalid email | "notanemail" | Validation error |
| Valid email | "test@example.com" | Form submit, success message |

### Failure classification guide
- `app bug` — Form không hiển thị hoặc Subscribe không hoạt động
- `selector issue` — Input email không tìm thấy bằng getByPlaceholder/getByLabel
- `test bug` — Assertion quá strict về success message
