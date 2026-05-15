# Forgot Password — UI Map

## Meta
- URL: https://your-site.com/password
- Inspected: 2026-05-14
- Tool: Playwright MCP

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { name: /forgot password/i })` | Second H1 on page; name filter makes it specific |
| Email input | `page.getByLabel('Email')` | Label associated via for/id attribute |
| Send button | `page.getByRole('button', { name: /send/i })` | Primary CTA, orange brand color |
| Back to login link | `page.getByRole('link', { name: /back to login/i })` | Below the Send button |

## Navigation flows

| Action | Result URL |
|--------|-----------|
| Click "Back to login" | /sign-in |
| Submit valid email | /password (stay, success message shown) |
| Submit invalid/empty email | /password (stay, validation error shown) |
