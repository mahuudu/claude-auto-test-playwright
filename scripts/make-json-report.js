// scripts/make-json-report.js
// Đọc reports/latest.json và in tóm tắt ra console
const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'reports', 'latest.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌  reports/latest.json không tồn tại. Chạy test trước.');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const { summary, suites, runId, timestamp, environment } = report;

console.log('\n══════════════════════════════════════════');
console.log(`📋  Run ID   : ${runId}`);
console.log(`🕐  Time     : ${new Date(timestamp).toLocaleString()}`);
console.log(`🌐  Base URL : ${environment.baseUrl}`);
console.log(`🖥  Browser  : ${environment.browser}  |  OS: ${environment.os}`);
console.log('──────────────────────────────────────────');
console.log(`Total: ${summary.total}  |  ✅ Passed: ${summary.passed}  |  ❌ Failed: ${summary.failed}  |  ⏭  Skipped: ${summary.skipped}`);
console.log(`Pass rate: ${summary.passRate}  |  Duration: ${(summary.duration / 1000).toFixed(1)}s`);
console.log('══════════════════════════════════════════\n');

if (summary.failed > 0) {
  console.log('❌  Failed tests:\n');
  for (const suite of suites) {
    for (const t of suite.tests) {
      if (t.status === 'failed') {
        console.log(`  [${t.id}] ${t.title}`);
        if (t.error) {
          console.log(`       Message  : ${t.error.message}`);
          if (t.error.expected) console.log(`       Expected : ${t.error.expected}`);
          if (t.error.received) console.log(`       Received : ${t.error.received}`);
        }
        if (t.screenshot) console.log(`       Screenshot: ${t.screenshot}`);
        console.log();
      }
    }
  }
} else {
  console.log('🎉  Tất cả test pass!\n');
}
