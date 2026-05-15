// Re-export all fixtures — test files should import from here, not @playwright/test directly
export { test as testWithPages } from './page-objects.fixture';
export { test as testWithAuth } from './auth.fixture';
export { users } from './test-data/users';

// Default: base test + expect (for tests that don't need fixtures)
export { test, expect } from '@playwright/test';
