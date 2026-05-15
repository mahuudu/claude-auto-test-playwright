import type {
  Reporter, Suite, TestCase, TestResult, FullConfig
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

interface TestEntry {
  id: string;
  title: string;
  status: string;
  duration: number;
  retries: number;
  screenshot: string | null;
  error: { message: string; expected?: string; received?: string } | null;
}

interface SuiteEntry {
  name: string;
  file: string;
  specFile: string;
  tests: TestEntry[];
}

interface Report {
  runId: string;
  timestamp: string;
  environment: { baseUrl: string; browser: string; os: string };
  summary: { total: number; passed: number; failed: number; skipped: number; duration: number; passRate: string };
  suites: SuiteEntry[];
}

class JsonReporter implements Reporter {
  private report: Report;
  private startTime: number = 0;

  constructor() {
    const now = new Date();
    const runId = 'run-' + now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    this.report = {
      runId,
      timestamp: now.toISOString(),
      environment: {
        baseUrl: process.env.BASE_URL || '',
        browser: 'chromium',
        os: os.platform(),
      },
      summary: { total: 0, passed: 0, failed: 0, skipped: 0, duration: 0, passRate: '0%' },
      suites: [],
    };
  }

  onBegin(_config: FullConfig, _suite: Suite) {
    this.startTime = Date.now();
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const status = result.status;
    const titlePath = test.titlePath();

    // titlePath = ['', 'Suite Name', 'test title']
    const suiteName = titlePath[1] || 'Unknown';
    const testFile = test.location.file;

    // Map test file → spec file convention: tests/e2e/foo.spec.ts → specs/foo.spec.md
    const specFile = testFile
      .replace(/tests\/e2e\//, 'specs/')
      .replace(/\.spec\.ts$/, '.spec.md');

    // Find or create suite entry
    let suite = this.report.suites.find(s => s.name === suiteName);
    if (!suite) {
      suite = { name: suiteName, file: testFile, specFile, tests: [] };
      this.report.suites.push(suite);
    }

    // Screenshot: chỉ lưu khi fail
    let screenshotPath: string | null = null;
    if (status === 'failed') {
      const attachment = result.attachments.find(a => a.name === 'screenshot' && a.path);
      if (attachment?.path) {
        screenshotPath = path.relative(process.cwd(), attachment.path);
      }
    }

    // Error info
    let error = null;
    if (result.error) {
      const msg = result.error.message || '';
      const expectedMatch = msg.match(/Expected.*?:\s*(.+)/s);
      const receivedMatch = msg.match(/Received.*?:\s*(.+)/s);
      error = {
        message: msg.split('\n')[0].slice(0, 200),
        expected: expectedMatch ? expectedMatch[1].trim().slice(0, 100) : undefined,
        received: receivedMatch ? receivedMatch[1].trim().slice(0, 100) : undefined,
      };
    }

    // Extract TC-ID from test title if exists (e.g. "TC-001: page loads")
    const idMatch = test.title.match(/^(TC-\d+)/);
    const id = idMatch ? idMatch[1] : `TC-${String(suite.tests.length + 1).padStart(3, '0')}`;

    suite.tests.push({
      id,
      title: test.title,
      status,
      duration: result.duration,
      retries: result.retry,
      screenshot: screenshotPath,
      error,
    });
  }

  onEnd() {
    const duration = Date.now() - this.startTime;
    const allTests = this.report.suites.flatMap(s => s.tests);
    const total = allTests.length;
    const passed = allTests.filter(t => t.status === 'passed').length;
    const failed = allTests.filter(t => t.status === 'failed').length;
    const skipped = allTests.filter(t => t.status === 'skipped').length;

    this.report.summary = {
      total,
      passed,
      failed,
      skipped,
      duration,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(1) + '%' : '0%',
    };

    // Lưu file với tên theo runId
    fs.mkdirSync('reports', { recursive: true });
    const outPath = path.join('reports', `${this.report.runId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(this.report, null, 2));

    // Cũng ghi đè latest.json để tiện đọc
    fs.writeFileSync(path.join('reports', 'latest.json'), JSON.stringify(this.report, null, 2));

    console.log(`\n📊 Report: ${outPath}`);
    console.log(`   ✅ ${passed} passed  ❌ ${failed} failed  ⏭  ${skipped} skipped  (${this.report.summary.passRate})`);
  }
}

export default JsonReporter;
