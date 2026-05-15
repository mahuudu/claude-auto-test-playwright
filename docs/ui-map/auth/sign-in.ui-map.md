# Sign In — UI Map

## Meta
- URL: https://your-site.com/sign-in
- Inspected: 2026-05-14
- Tool: Playwright MCP

## Locators

| Element | Locator | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { level: 1 })` | Text: "Connect to Your World." |
| Account Login tab | `page.getByRole('tab', { name: 'Account Login' })` | Active by default, id=full-width-tab-0 |
| OTP Login tab | `page.getByRole('tab', { name: 'OTP Login' })` | id=full-width-tab-1 |
| Phone Number/Email input | `page.getByLabel('Phone Number/Email')` | Fallback: `page.getByPlaceholder('Phone Number/Email')` |
| Password input | `page.getByLabel('Password')` | Fallback: `page.getByPlaceholder('Password')` |
| Remember me checkbox | `page.getByLabel('Remember me')` | MUI FormControlLabel wraps input |
| Forgot password link | `page.getByRole('link', { name: /Forgot password/i })` | href=/password, text="Forgot password ?" |
| Login submit button | `page.getByRole('button', { name: 'Login' })` | type=submit |
| Google social button | `page.getByRole('button', { name: 'Google' })` | MUI outlined button |
| Facebook social button | `page.getByRole('button', { name: 'Facebook' })` | MUI outlined button |
| Apple social button | `page.getByRole('button', { name: 'Apple' })` | MUI outlined button |

## Navigation flows

| Action | Result URL |
|--------|-----------|
| Submit valid credentials | /dashboard or /account (away from /sign-in) |
| Submit invalid credentials | /sign-in (stay, error shown) |
| Click "Forgot password?" | /password (reset password page) |
| Click Google/Facebook/Apple | OAuth redirect (third-party) |
| Click OTP Login tab | /sign-in (stay, form changes) |
