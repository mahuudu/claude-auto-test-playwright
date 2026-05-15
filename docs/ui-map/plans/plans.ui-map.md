# Plans — UI Map

## Meta
- URL: https://your-site.com/plans
- Inspected: 2026-05-14
- Tool: Playwright MCP

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { name: /Discover Flexible Plan Options Today/i })` | |
| Tab 1GB | `page.getByRole('tab', { name: /1GB/i })` | |
| Tab 3GB | `page.getByRole('tab', { name: /3GB/i })` | |
| Tab 6GB | `page.getByRole('tab', { name: /^6GB$/ })` | /6GB/i cũng match "16GB" — dùng anchored regex |
| Tab 10GB | `page.getByRole('tab', { name: /10GB/i })` | |
| Tab Unlimited | `page.getByRole('tab', { name: /Unlimited/i })` | |
| SIM Card option | `page.getByRole('button', { name: /SIM Card/i }).first()` | 2 matches trên page, .first() target plan section |
| eSIM option | `page.getByRole('button', { name: /eSIM/i }).first()` | 2 matches trên page, .first() target plan section |
| Phone number input | `page.getByPlaceholder('(###) ###-####')` | Multi-field widget, chỉ hiện sau click "Choose Different Number" |
| Buy Now button | `page.getByText('Buy now', { exact: true })` | aria-label là "button-buy-now", không dùng getByRole name |
| Family plan heading | `page.getByRole('heading', { name: /Save More As A Family/i })` | |
| FAQ section heading | `page.getByRole('heading', { name: /FAQs/i })` | |
| First FAQ item | `page.getByRole('button', { name: 'Do I have AirVoice coverage in my area?' })` | Accordion trigger |

| Cart icon (nav header) | `page.locator('a[aria-label*="Shopping cart"]')` | aria-label is dynamic: "Shopping cart with N items" — use `*=` partial match |
| Cart badge counter | `page.locator('a[aria-label*="Shopping cart"] .MuiBadge-badge')` | `<span class="MuiBadge-badge ...">` inside the cart link; previous `a[aria-label="Shopping cart"]` failed because label includes item count |

## Navigation flows

| Action | Result URL |
|--------|-----------|
| Click "Buy Now" | /cart hoặc /checkout |
| Click "Get My Family Plan" | /plans (family section) hoặc /family-plans |
