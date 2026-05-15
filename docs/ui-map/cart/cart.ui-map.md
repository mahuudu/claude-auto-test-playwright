# Cart — UI Map

## Meta
- URL: https://your-site.com/cart
- Inspected: 2026-05-14
- Tool: Playwright (headless Chromium)

---

## State 1: Empty Cart

| Element | Locator | Notes |
|---------|---------|-------|
| Breadcrumb "Shopping Cart" | `page.getByRole('link', { name: 'Shopping Cart' })` | Returns 2 matches (header + breadcrumb); use `.first()` for breadcrumb |
| Empty cart heading | `page.getByRole('heading', { name: /your cart is empty/i })` | Rendered as `<h2>`, not h1 |
| Subtext | `page.getByText(/haven.*added anything/i)` | Full text: "Looks like you haven't added anything to your cart yet" |
| Go Home button | `page.getByRole('link', { name: /go home/i })` | `<a href="/">` — also matches as `getByRole('button', { name: /go home/i })` |
| Cart icon in header | `page.getByRole('link', { name: /shopping cart with/i })` | aria-label="Shopping cart with N items"; href="/cart" |

## Navigation flows (empty cart)

| Action | Result URL |
|--------|-----------|
| Click "Go Home" | / |
| Click cart icon | /cart (stay) |
| Click breadcrumb "Shopping Cart" | /cart (stay) |

---

## State 2: Cart With Items

| Element | Locator | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { name: /order review/i, level: 1 })` | `<h1>Order Review</h1>` |
| Items count | `page.getByText(/\d+ item.*in cart/i)` | e.g. "1 Item in cart" |
| Plan item name | `page.getByText(/1GB\/mo Plan/i)` | Full text: "3 Months , 1GB/mo Plan" |
| Plan item price | `page.getByText('$30.00').first()` | Multiple `$30.00` on page; `.first()` targets the item row price |
| Change to eSIM | `page.getByRole('button', { name: 'Change to eSIM' })` | `<div role="button" aria-label="Change to eSIM">` |
| Change Plan | `page.getByRole('button', { name: 'Change Plan' })` | `<div role="button" aria-label="Change Plan">` |
| Remove item (X icon) | `page.locator('button.MuiIconButton-root')` | Icon-only button (X/close SVG), no aria-label or title; last resort CSS class |
| Add Promo Code | `page.getByText(/add promo code/i)` | Expandable section trigger |
| Billing Summary heading | `page.getByRole('heading', { name: /billing summary/i, level: 4 })` | `<h4>Billing Summary</h4>` |
| Subtotal row | `page.getByText(/subtotal/i)` | Inside billing summary |
| Estimated Total | `page.getByText(/estimated total/i)` | Container also holds the total price `$30.00` |
| Proceed Checkout button | `page.getByRole('button', { name: /proceed checkout/i })` | `<button>` with MUI gradient style |
| Cart icon in header | `page.getByRole('link', { name: /shopping cart with/i })` | aria-label="Shopping cart with N items" |
| Breadcrumb "Shopping Cart" | `page.getByRole('link', { name: 'Shopping Cart' })` | Same as empty state |

## Navigation flows (cart with items)

| Action | Result URL |
|--------|-----------|
| Click "Proceed Checkout" | /checkout (expected) |
| Click "Change Plan" | /plans |
| Click breadcrumb "Shopping Cart" | /cart (stay) |

---

## Notes

- The "Buy now" button on `/plans` is a `<button>` but is **not** reachable via `getByRole('button', { name: /buy now/i })` in headless mode — use `page.getByText('Buy now')` or a JS `evaluate` click instead (likely rendered inside a shadow DOM or deferred component).
- The Remove item button has no accessible name. If the team adds `aria-label="Remove item"` in future, prefer `page.getByRole('button', { name: /remove item/i })` over the CSS class locator.
- `$30.00` appears 4–5 times on the cart-with-items page (item price, subtotal, shipping lines, total). Always scope with `.first()` or a parent locator when targeting the item row price specifically.
