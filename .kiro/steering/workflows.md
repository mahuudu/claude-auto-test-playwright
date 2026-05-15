---
inclusion: always
---

# Available Workflows & Skills

## Recommended workflow (with review checkpoint)
```
/e2e-spec <feature> <page>     ← steps 1–3: crawl + spec + test-cases, then STOP
  → review and edit docs/specs/<feature>/<page>.spec.md
  → review and edit docs/test-cases/<feature>/<page>.test-cases.md
/setup-data <feature> <page>   ← if tests need credentials or fixtures
/e2e-build <feature> <page>    ← steps 4–9: inspect → POM → test → run → report
```

## Quick workflow (no review)
```
/e2e <feature> <page>          ← full 9-step pipeline, no stops
```

## Journey workflow (multi-page flow)
```
# Step 1: build each page first
/e2e-spec home home && /e2e-build home home
/e2e-spec plans plans && /e2e-build plans plans
/e2e-spec cart cart && /e2e-build cart cart
/e2e-spec checkout checkout && /e2e-build checkout checkout

# Step 2: create journey test (requires all POMs to exist)
/e2e-journey purchase-flow home/home plans/plans cart/cart checkout/checkout
```

## Maintenance skills
```
/fix-test                      ← analyze and fix failures from latest report
/add-tc <feature> <page>       ← add new TCs to existing spec + test file
/check-locators <feature> <page> ← verify locators after UI change
/smoke                         ← run only High priority tests
/report                        ← print latest run summary
/cleanup                       ← remove old test artifacts
```

## All skills reference
| Skill | Purpose |
|-------|---------|
| `/e2e <feature> <page>` | Full 9-step pipeline, no stops |
| `/e2e-spec <feature> <page>` | Steps 1–3 only, stops for review |
| `/e2e-build <feature> <page>` | Steps 4–9 from existing spec |
| `/e2e-journey <name> <f>/<p> ...` | Multi-page journey test (needs POMs) |
| `/setup-data <feature> <page>` | Prepare credentials/fixtures |
| `/fix-test` | Fix failures from latest report |
| `/add-tc <feature> <page>` | Add TCs to existing spec + test |
| `/check-locators <feature> <page>` | Verify locators after UI change |
| `/smoke` | Run High priority tests only |
| `/report` | Print latest run summary |
| `/cleanup` | Remove old test artifacts |

## Kiro hooks (auto-triggered)
- **spec-sync** — fires when spec/test-case files edited → checks POM sync
- **uimap-pom-sync** — fires when UI map edited → updates POM locators
- **test-failure-analyzer** — fires when new report created → classifies failures
- **run-e2e-pipeline** — manual trigger → runs full pipeline interactively
- **fix-failing-tests** — manual trigger → auto-fixes failures from latest report
