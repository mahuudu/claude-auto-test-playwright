// scripts/send-alert.js
// Gửi Slack alert nếu SLACK_WEBHOOK_URL được set trong .env
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const webhookUrl = process.env.SLACK_WEBHOOK_URL;
const reportPath = path.join(process.cwd(), 'reports', 'latest.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌  reports/latest.json không tồn tại. Chạy test trước.');
  process.exit(1);
}

if (!webhookUrl) {
  console.log('ℹ️   SLACK_WEBHOOK_URL chưa set — bỏ qua gửi alert.');
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
const { summary, runId, timestamp, environment } = report;

const status = summary.failed === 0 ? '✅ PASSED' : '❌ FAILED';
const color  = summary.failed === 0 ? '#36a64f' : '#e01e5a';

const failedLines = [];
for (const suite of report.suites) {
  for (const t of suite.tests) {
    if (t.status === 'failed') {
      failedLines.push(`• [${t.id}] ${t.title}: ${t.error?.message || 'unknown error'}`);
    }
  }
}

const payload = {
  attachments: [
    {
      color,
      title: `${status} — ${runId}`,
      fields: [
        { title: 'Base URL',   value: environment.baseUrl,          short: true },
        { title: 'Browser',    value: environment.browser,          short: true },
        { title: 'Total',      value: String(summary.total),        short: true },
        { title: 'Pass rate',  value: summary.passRate,             short: true },
        { title: 'Passed',     value: String(summary.passed),       short: true },
        { title: 'Failed',     value: String(summary.failed),       short: true },
        { title: 'Duration',   value: `${(summary.duration / 1000).toFixed(1)}s`, short: true },
        { title: 'Time',       value: new Date(timestamp).toLocaleString(), short: true },
      ],
      ...(failedLines.length > 0 && {
        text: '*Failed tests:*\n' + failedLines.join('\n'),
      }),
      footer: 'Playwright E2E',
      ts: Math.floor(Date.now() / 1000),
    },
  ],
};

function postJson(url, body) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: parsed.hostname,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => resolve({ status: res.statusCode, body: raw }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  try {
    const res = await postJson(webhookUrl, payload);
    if (res.status === 200) {
      console.log('✅  Slack alert đã gửi thành công.');
    } else {
      console.error(`❌  Slack trả về HTTP ${res.status}: ${res.body}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌  Lỗi khi gửi Slack alert:', err.message);
    process.exit(1);
  }
})();
