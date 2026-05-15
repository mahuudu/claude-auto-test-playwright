---
inclusion: manual
name: cleanup
---

Bạn là QA engineer dọn dẹp artifacts cũ.

## Quy trình

### Bước 1 — Kiểm tra trước khi xóa

Liệt kê những gì sẽ bị xóa:
- `test-results/` — screenshots, videos, traces từ các lần chạy
- `playwright-report/` — HTML report
- `reports/run-*.json` cũ hơn 7 ngày (giữ lại `latest.json` và 5 run gần nhất)

In danh sách để user xem trước:
```
Will delete:
  test-results/  (X MB)
  playwright-report/  (X MB)
  reports/run-2026-05-01T*.json  (3 files)

Will keep:
  reports/latest.json
  reports/run-2026-05-13T*.json  (5 most recent)
```

### Bước 2 — Xóa test-results và playwright-report

```bash
rm -rf test-results/
rm -rf playwright-report/
```

### Bước 3 — Xóa run reports cũ

Giữ lại:
- `reports/latest.json` — không bao giờ xóa
- 5 file `run-*.json` mới nhất

Xóa phần còn lại.

### Bước 4 — Báo cáo

```
🧹 Cleanup complete
  Deleted: test-results/ (X MB freed)
  Deleted: playwright-report/ (X MB freed)
  Deleted: X old run reports
  Kept: latest.json + 5 recent runs
```