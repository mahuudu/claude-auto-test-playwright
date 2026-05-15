---
name: update-spec
description: Re-crawl và cập nhật spec khi UI thay đổi, mà không tạo lại toàn bộ từ đầu. So sánh crawl mới với crawl cũ, chỉ patch những gì thay đổi. Dừng sau khi cập nhật spec để review — KHÔNG tự cập nhật test-cases hay chạy test. Arguments: <feature> <page>.
---

Bạn là QA automation engineer. Cập nhật spec dựa trên UI đã thay đổi — **không xóa** những gì vẫn còn đúng.

---

## Xác định feature, page, URL — giống /e2e-spec

Argument có thể là:
- `<feature> <page>` — ví dụ: `auth sign-in`
- `<page>` — feature suy từ URL path
- URL bắt đầu bằng `http` — dùng URL đó thay TARGET_URL
- (không arg) — dùng TARGET_URL từ `.env`

---

## Bước 1 — Crawl lại trang

Chạy: `TARGET_URL=<url> FEATURE=<feature> PAGE=<page> node scripts/crawl.js`

Sau khi crawl xong, đọc `docs/crawl/<feature>/<page>/screenshot.png` và `docs/crawl/<feature>/<page>/raw-html.txt`.

Cập nhật `docs/crawl/<feature>/<page>/crawl-data.json` với dữ liệu mới.

In: `✅ docs/crawl/<feature>/<page>/crawl-data.json (updated)`

---

## Bước 2 — So sánh với spec hiện có

Đọc `docs/specs/<feature>/<page>.spec.md` (nếu tồn tại).

So sánh crawl mới với spec cũ, xác định:

```
🔍 Phân tích thay đổi UI:

✅ Không thay đổi:
  - [các element/flow vẫn còn đúng]

⚠️  Thay đổi:
  - [element bị đổi tên/vị trí/behavior]

❌ Đã bị xóa:
  - [element/flow không còn tồn tại]

🆕 Mới thêm:
  - [element/flow mới cần test]
```

---

## Bước 3 — Cập nhật Spec

Patch `docs/specs/<feature>/<page>.spec.md`:

- **Giữ nguyên** các TC vẫn còn valid
- **Cập nhật** TC có thay đổi nhỏ (steps, expected result)
- **Đánh dấu** `[DEPRECATED]` các TC không còn applicable (không xóa ngay)
- **Thêm** TC mới cho feature/element mới

In: `✅ docs/specs/<feature>/<page>.spec.md (patched)`

---

## DỪNG — Chờ user review

Sau bước 3, in thông báo sau và **không làm gì thêm** — đặc biệt KHÔNG tự cập nhật test-cases hay chạy test:

```
─────────────────────────────────────────────────
⏸  UPDATE REVIEW CHECKPOINT

Spec đã được cập nhật. Hãy review trước khi tiếp tục:

  📄 docs/specs/<feature>/<page>.spec.md

Thay đổi:
  - X TC cập nhật
  - X TC thêm mới
  - X TC đánh dấu [DEPRECATED]

Bước tiếp theo (sau khi review xong):
  - Xóa/giữ các TC [DEPRECATED] trong spec
  - Cập nhật test data nếu cần: /update-data <feature> <page>
  - Rebuild (sẽ tự cập nhật test-cases + POM + test): /e2e-build <feature> <page>
─────────────────────────────────────────────────
```
