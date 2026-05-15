export const users = {
  standard: {
    email: process.env.TEST_USER_EMAIL || 'dma+199@softel.vn',
    password: process.env.TEST_USER_PASSWORD || '123456789',
  },
  invalid: {
    email: 'user@example.com',
    password: 'wrongpassword123',
  },
} as const;
