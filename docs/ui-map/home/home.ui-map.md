# Home — UI Map

## Meta
- URL: https://your-site.com/
- Inspected: 2026-05-14
- Tool: Playwright MCP

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page title | `await page.title()` | "AirVoice Wireless \| #1 PrePaid Plans and Phones" |
| Hero heading | `page.getByRole('heading', { name: /Stop Overpaying/i })` | H1 |
| Nav link "Plans" | `page.getByRole('link', { name: 'Plans' })` | href: /plans |
| Nav link "Phones" | `page.getByRole('link', { name: 'Phones' })` | href: /smartphones |
| Nav link "Coverage" | `page.getByRole('link', { name: 'Coverage' })` | href: /check-coverage |
| Nav link "Support" | `page.getByRole('link', { name: 'Support' })` | href: /support |
| Nav link "Sign in" | `page.getByRole('link', { name: 'Sign in' })` | Text là "Sign in" (lowercase i) |
| "View All Plans" CTA | `page.getByRole('link', { name: /Check Out Our other attractive plans/i })` | Actual text differs from spec |
| "Shop Phones" CTA | `page.getByRole('link', { name: 'View more phones' })` | Actual text differs from spec |
| Section heading "Discover Our Plans" | `page.getByRole('heading', { name: 'Discover Our Plans' })` | |
| Newsletter email input | `page.getByPlaceholder('Enter your Email')` | name="email" |
| Newsletter Subscribe button | `page.getByRole('button', { name: 'Subscribe' })` | |

## Navigation flows

| Action | Result URL |
|--------|-----------|
| Click nav "Plans" | /plans |
| Click nav "Phones" | /smartphones |
| Click nav "Coverage" | /check-coverage |
| Click nav "Support" | /support |
| Click nav "Sign in" | /sign-in |
| Click "Check Out Our other attractive plans" | /plans |
| Click "View more phones" | /smartphones |
