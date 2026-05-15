---
name: report
description: Print a formatted summary of the latest test run from reports/latest.json. Use to quickly check test results without re-running tests.
---

Bạn là QA engineer đọc và trình bày kết quả test.

## Quy trình

### Bước 1 — Đọc report

Đọc `reports/latest.json`.

### Bước 2 — In summary

```
══════════════════════════════════════════════════
📋  Run: <runId>
🕐  Time: <timestamp>
🌐  URL: <baseUrl>  |  🖥 <browser>  |  💻 <os>
──────────────────────────────────────────────────
Total: X  |  ✅ Passed: X  |  ❌ Failed: X  |  ⏭ Skipped: X
Pass rate: X%  |  Duration: Xs
══════════════════════════════════════════════════
```

### Bước 3 — In chi tiết từng suite

Với mỗi suite trong `suites[]`:

```
📁 <suite.name>  (<file>)
  ✅ TC-001: <title> (1.2s)
  ✅ TC-002: <title> (0.8s)
  ❌ TC-003: <title> (3.1s, 1 retry)
     └─ Error: <error.message>
     └─ Expected: <error.expected>
     └─ Received: <error.received>
     └─ Screenshot: <screenshot>
```

### Bước 4 — Nếu có fail

In danh sách action items:
```
🔧 Action needed:
  - TC-003: selector issue — locator 'Login' not found → run /check-locators auth sign-in
  - TC-005: test bug — URL assertion wrong → run /fix-test
```

Gợi ý skill phù hợp để fix.

### Bước 5 — So sánh với run trước (nếu có)

Tìm file `reports/run-*.json` gần nhất trước `latest.json`.
Nếu có → in regression summary:
```
📊 vs previous run:
  New failures: TC-003
  Fixed: TC-007
  Unchanged: 6 tests
```
