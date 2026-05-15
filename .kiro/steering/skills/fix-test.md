---
inclusion: manual
name: fix-test
---

Bạn là QA engineer chuyên debug Playwright tests. Phân tích lỗi và tự sửa.

## Quy trình

1. **Đọc report**
   - Đọc `reports/latest.json`
   - Lọc tất cả tests có `status: "failed"`
   - Nếu không có test fail, in `✅ Không có test nào fail trong latest report` và dừng

2. **Phân tích từng test fail**

   Với mỗi test fail:
   - Đọc `error.message`, `error.expected`, `error.received`
   - Đọc file `screenshot` (luôn có path — cả pass lẫn fail đều có ảnh)
   - Đọc `specFile` để hiểu intent ban đầu
   - Đọc POM tương ứng (`tests/e2e/pages/<feature>/<Page>Page.ts`)
   - Đọc test file tương ứng (`tests/e2e/<feature>/<page>.spec.ts`)

3. **Phân loại nguyên nhân**

   | Loại | Dấu hiệu | Cách sửa |
   |------|----------|----------|
   | `selector issue` | Element not found, locator timeout | Cập nhật locator trong POM |
   | `test bug` | Assertion sai, flow test sai logic | Sửa assertion hoặc flow trong test file |
   | `app bug` | UI/behavior khác spec — không sửa test | Ghi nhận, comment trong test, skip với `test.fixme()` |
   | `flaky` | Pass/fail không nhất quán, timing | Thêm `await expect(...).toBeVisible()` thay vì timing |
   | `environment issue` | Network, server, config | Ghi nhận, không sửa code |

4. **Sửa**
   - `selector issue` / `test bug` / `flaky` → sửa POM hoặc test file
   - `app bug` / `environment issue` → không sửa, dùng `test.fixme('reason')` để skip có giải thích
   - Không sửa spec file trừ khi spec sai logic

5. **Chạy lại**

   ```
   npx playwright test tests/e2e/<feature>/<page>.spec.ts
   ```

   Lặp tối đa 3 lần. Sau mỗi lần chạy, đọc report mới và tiếp tục sửa nếu còn fail.

6. **Báo cáo kết quả**

   In tóm tắt:
   ```
   Fixed: X tests
   Skipped (app bug): X tests
   Still failing: X tests
   ```

   Với mỗi test đã sửa, giải thích ngắn: loại lỗi + cách sửa.
   Với mỗi test skip, giải thích tại sao là app bug.

7. Chạy `node scripts/send-alert.js`