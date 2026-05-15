---
inclusion: manual
name: e2e-spec
---

Bạn là QA automation engineer. Chạy đúng 3 bước sau rồi **dừng lại** để user review.

---

## Xác định feature, page, URL — giống /e2e

Argument có thể là:
- `<feature> <page>` — ví dụ: `auth sign-in`
- `<page>` — feature suy từ URL path
- URL bắt đầu bằng `http` — dùng URL đó thay TARGET_URL
- (không arg) — dùng TARGET_URL từ `.env`

Quy tắc suy feature:
- Các page liên quan đến login/signup/forgot-password/otp/password → feature=`auth`
- URL `https://site.com/plans` → feature=`plans`, page=`plans`
- URL root `/` → feature=`home`, page=`home`

---

## Bước 1 — Crawl

Chạy: `TARGET_URL=<url> node scripts/crawl.js`

Nếu lỗi → báo lỗi và dừng.

Sau khi crawl xong, đọc `docs/screenshot.png` và `docs/raw-html.txt`.

Phân tích và tạo `docs/crawl-data.json` theo schema:

```json
{
  "crawledAt": "<ISO timestamp>",
  "url": "<url>",
  "title": "<tiêu đề trang>",
  "metaDescription": "<meta description nếu có>",
  "pageType": "landing | login | dashboard | product | blog | checkout | other",
  "purpose": "<mô tả ngắn mục đích trang (1-2 câu)>",
  "headings": [{ "level": "H1|H2|H3", "text": "..." }],
  "interactiveElements": {
    "buttons": [{ "text": "...", "purpose": "..." }],
    "links": [{ "text": "...", "href": "...", "purpose": "..." }],
    "inputs": [{ "type": "text|email|password|...", "label": "...", "placeholder": "..." }],
    "forms": [{ "purpose": "...", "fields": ["..."] }]
  },
  "keyFeatures": ["..."],
  "testableScenarios": ["..."],
  "potentialIssues": ["..."]
}
```

In: `✅ docs/crawl-data.json`

---

## Bước 2 — Sinh Spec

Đọc `docs/crawl-data.json`, tạo `docs/specs/<feature>/<page>.spec.md` theo template trong CLAUDE.md.

- 5–8 test cases thực tế
- Mỗi TC có đủ: Mục tiêu, Điều kiện, Các bước, Kết quả mong đợi, Priority

In: `✅ docs/specs/<feature>/<page>.spec.md`

---

## Bước 3 — Sinh Manual Test Cases

Đọc spec vừa tạo, tạo `docs/test-cases/<feature>/<page>.test-cases.md` theo template trong CLAUDE.md.

Mỗi TC có happy path + edge cases + failure classification guide.

In: `✅ docs/test-cases/<feature>/<page>.test-cases.md`

---

## DỪNG — Chờ user review

Sau bước 3, in thông báo sau và **không làm gì thêm**:

```
─────────────────────────────────────────────────
⏸  REVIEW CHECKPOINT

Spec và test cases đã được tạo. Hãy review và chỉnh sửa trước khi tiếp tục:

  📄 docs/specs/<feature>/<page>.spec.md
  📋 docs/test-cases/<feature>/<page>.test-cases.md

Bạn có thể:
  - Thêm / bớt / sửa TC trong spec
  - Điều chỉnh edge cases trong test-cases
  - Thêm test data cần thiết với /setup-data <feature> <page>

Khi đã sẵn sàng → chạy: /e2e-build <feature> <page>
─────────────────────────────────────────────────
```