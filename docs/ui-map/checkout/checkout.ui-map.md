# Checkout Flow — UI Map

## Meta
- URL: https://your-site.com/plans → /cart → /checkout
- Inspected: 2026-05-14
- Tool: Playwright MCP

---

## Plans Page (/plans)

| Element | Locator | Notes |
|---------|---------|-------|
| Data 1GB tab | `page.getByRole('tab', { name: '1GB' })` | MUI Tab component |
| Data 3GB tab | `page.getByRole('tab', { name: '3GB' })` | |
| Data 6GB tab | `page.getByRole('tab', { name: '6GB' })` | |
| Data 10GB tab | `page.getByRole('tab', { name: '10GB' })` | |
| Data 12GB tab | `page.getByRole('tab', { name: '12GB' })` | |
| Data 16GB tab | `page.getByRole('tab', { name: '16GB' })` | |
| Data 25GB tab | `page.getByRole('tab', { name: '25GB' })` | |
| Data Unlimited tab | `page.getByRole('tab', { name: 'Unlimited' })` | |
| Duration 1 Month | `page.getByRole('button', { name: /1 Month/i }).first()` | Contains price text |
| Duration 3 Months | `page.getByRole('button', { name: /3 Months/i }).first()` | |
| Duration 6 Months | `page.getByRole('button', { name: /6 Months/i }).first()` | |
| Duration 12 Months | `page.getByRole('button', { name: /12 Months/i }).first()` | |
| SIM Card button | `page.getByRole('button', { name: /SIM Card/i }).first()` | |
| eSIM button | `page.getByRole('button', { name: /eSIM/i }).first()` | |
| Keep number toggle | `page.getByText('Want to keep your phone number?')` | Click to expand input |
| Phone number input | `page.getByPlaceholder('Enter your phone number')` | Only visible after toggle |
| Buy Now button | `page.locator('button:has-text("Buy now")')` | getByRole returns 0 — text inside `<p>` child |

## Navigation flows (Plans)

| Action | Result URL |
|--------|-----------|
| Click Buy Now after selecting plan | /cart |

---

## Cart Page (/cart)

| Element | Locator | Notes |
|---------|---------|-------|
| Empty cart heading | `page.getByText('Your Cart is empty')` | Only when no items |
| Go Home button | `page.getByRole('button', { name: /Go Home/i })` | Empty state only |
| Cart item plan name | `page.getByText(/\d+GB\/mo Plan/)` | e.g. "10GB/mo Plan" |
| Auto renew toggle | `page.getByText('Auto renew')` | |
| Billing Summary | `page.getByText('Billing Summary')` | |
| Change to eSIM button | `page.getByRole('button', { name: /Change to eSIM/i })` | |
| Change Plan button | `page.getByRole('button', { name: /Change Plan/i })` | |
| Proceed Checkout button | `page.getByRole('button', { name: /Proceed Checkout/i })` | |

## Navigation flows (Cart)

| Action | Result URL |
|--------|-----------|
| Click Proceed Checkout | /checkout |
| Click Go Home (empty) | / |

---

## Checkout Page (/checkout)

| Element | Locator | Notes |
|---------|---------|-------|
| First Name input | `page.locator('#first_name')` | MUI — getByLabel() returns 0 |
| Last Name input | `page.locator('#last_name')` | |
| Email Address input | `page.locator('#email')` | |
| Phone Number input | `page.locator('#phone_number')` | Placeholder: `000-000-0000 *` |
| Password input | `page.getByPlaceholder('Create Account Password *')` | Dynamic id — use placeholder |
| Zip Code input | `page.locator('#zip_code')` | |
| Address input | `page.locator('#streetAddress')` | getByPlaceholder('Address') returns 2 matches |
| Apt/suite input | `page.locator('#unit_free_text')` | Optional field |
| Place Order button | `page.getByRole('button', { name: /Place Order/i })` | |
| Back button | `page.getByRole('button', { name: /back/i })` | |

## Navigation flows (Checkout)

| Action | Result URL |
|--------|-----------|
| Submit valid form | /confirmation or /success |
| Click Back | /cart |
