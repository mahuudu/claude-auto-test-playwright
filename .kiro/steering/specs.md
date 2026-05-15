---
inclusion: fileMatch
fileMatch: "docs/specs/**/*.spec.md,docs/test-cases/**/*.test-cases.md,docs/ui-map/**/*.ui-map.md"
---

# Spec & Test Case Conventions

## Spec format (docs/specs/<feature>/<page>.spec.md)
Each TC must have:
- **Mục tiêu:** what is being tested
- **Điều kiện:** initial state
- **Các bước:** numbered steps
- **Kết quả mong đợi:** expected result
- **Priority:** High | Medium | Low

## Test case format (docs/test-cases/<feature>/<page>.test-cases.md)
Each TC must have:
- Happy path with input, steps, expected
- Edge cases table (empty, invalid format, max length)
- Failure classification: `app bug` | `test bug` | `selector issue` | `flaky` | `environment issue`

## UI Map format (docs/ui-map/<feature>/<page>.ui-map.md)
- Table with Element, Locator, Notes columns
- Navigation flows table
- All locators must be verified against the live page
