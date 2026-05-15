# Plans — Manual Test Cases

## Meta
- Spec: docs/specs/plans/plans.spec.md
- Created: 2026-05-14

---

## TC-001: Page loads with correct heading

### Happy path
- **Input:** Truy cập https://your-site.com/plans
- **Steps:** Mở URL, chờ trang load
- **Expected:** Heading "Discover Flexible Plan Options Today" visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Direct URL | Nhập /plans trực tiếp | Load đúng, không redirect |
| Slow network | Throttle 3G | Trang vẫn load, heading hiển thị |

### Failure classification guide
- `app bug` — Heading sai hoặc không hiển thị
- `selector issue` — Locator heading không match do text thay đổi
- `flaky` — Trang load không ổn định

---

## TC-002: Data plan tabs hiển thị và có thể chọn

### Happy path
- **Input:** Trang plans đã load
- **Steps:** Quan sát data plan tabs
- **Expected:** Tất cả 8 tabs visible: 1GB, 3GB, 6GB, 10GB, 12GB, 16GB, 25GB, Unlimited

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Mobile viewport | Resize < 768px | Tabs vẫn hiển thị, có thể scroll ngang |
| Tab count | Đếm số tab | Đúng 8 tabs |

### Failure classification guide
- `app bug` — Thiếu tab hoặc tab không hiển thị
- `selector issue` — Tab text khác với expected (ví dụ "1 GB" thay vì "1GB")

---

## TC-003: Chọn data plan tab cập nhật giá

### Happy path
- **Input:** Click tab "3GB"
- **Steps:** Mở trang → click "3GB" tab
- **Expected:** Tab "3GB" active, giá hiển thị tương ứng

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click tab đang active | Click lại tab đang chọn | Không thay đổi, vẫn active |
| Click Unlimited | Click tab "Unlimited" | Giá Unlimited hiển thị |

### Failure classification guide
- `app bug` — Giá không cập nhật sau khi chọn tab
- `test bug` — Assertion giá quá strict (giá có thể thay đổi)
- `selector issue` — Tab không tìm thấy

---

## TC-004: SIM type selector hiển thị SIM Card và eSIM

### Happy path
- **Input:** Trang plans đã load
- **Steps:** Tìm SIM type selector, quan sát options
- **Expected:** "SIM Card" và "eSIM" đều visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click eSIM | Chọn eSIM option | eSIM được chọn (active state) |
| Click SIM Card | Chọn SIM Card option | SIM Card được chọn |

### Failure classification guide
- `app bug` — Một trong hai option không hiển thị
- `selector issue` — Label text khác với expected

---

## TC-005: Phone number input nhận số điện thoại

### Happy path
- **Input:** "(404) 404-4040"
- **Steps:** Tìm phone number input → nhập số
- **Expected:** Input nhận giá trị

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Empty | Bỏ trống | Không có lỗi khi chỉ xem, lỗi khi submit |
| Invalid format | "12345" | Validation error hoặc format tự động |
| Valid format | "(404) 404-4040" | Nhận giá trị bình thường |

### Failure classification guide
- `app bug` — Input không nhận giá trị hoặc bị block
- `selector issue` — Placeholder text khác với expected

---

## TC-006: Click "Buy now" thêm plan vào giỏ hàng

### Happy path
- **Input:** Trang plans đã load, plan mặc định đang được chọn
- **Steps:** Mở trang → click "Buy now"
- **Expected:** Cart badge (aria-label chứa "cart") tăng lên 1, URL vẫn là /plans

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click lần 2 | Click Buy now thêm lần nữa | Cart badge tăng lên 2 |
| Click lần 3 | Click Buy now lần 3 | Cart badge tăng lên 3 |
| Chưa đăng nhập | Click Buy now khi chưa login | Badge vẫn tăng (guest cart) hoặc redirect /sign-in |

### Failure classification guide
- `app bug` — Badge không tăng sau khi click
- `test bug` — Assertion kiểm tra URL thay vì badge (Buy now KHÔNG navigate)
- `selector issue` — Cart badge locator không tìm thấy
- `environment issue` — Cart API không phản hồi

---

## TC-006b: Click "Buy now" nhiều lần tăng cart badge theo từng lần

### Happy path
- **Input:** Click Buy now 2 lần liên tiếp
- **Steps:** Mở trang → click Buy now lần 1 → ghi nhận badge → click lần 2
- **Expected:** Badge = 1 sau lần 1, badge = 2 sau lần 2, URL không đổi

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click nhanh liên tiếp | Double-click | Badge tăng đúng số lần, không bị race condition |

### Failure classification guide
- `app bug` — Badge không tăng đúng số lần
- `flaky` — Race condition khi click nhanh

---

## TC-007: Family plan section hiển thị discount tiers

### Happy path
- **Input:** Scroll đến "Save More As A Family!" section
- **Steps:** Mở trang → scroll đến family section
- **Expected:** Heading visible, ít nhất 2 discount tier cards hiển thị

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click "Get My Family Plan" | Click CTA button | Dẫn đến family plan page hoặc scroll đến form |

### Failure classification guide
- `app bug` — Section không hiển thị
- `selector issue` — Heading text khác với expected

---

## TC-008: FAQ accordion mở/đóng khi click

### Happy path
- **Input:** Click FAQ item đầu tiên
- **Steps:** Scroll đến FAQs → click item đầu tiên
- **Expected:** Nội dung câu trả lời expand và visible

### Edge cases
| Case | Input | Expected |
|------|-------|----------|
| Click lần 2 | Click item đang mở | Collapse lại |
| Click item khác | Click item thứ 2 khi item 1 đang mở | Item 2 mở, item 1 có thể đóng hoặc vẫn mở |

### Failure classification guide
- `app bug` — Accordion không expand/collapse
- `selector issue` — FAQ item không tìm thấy
- `test bug` — Assertion về visibility sau animation chưa xong
