// scripts/cleanup.js
// Prune stale test artifacts. Safe to run anytime.
// Keeps: reports/latest.json + 5 most recent run-*.json
// Deletes: test-results/, playwright-report/, older run-*.json
const fs = require('fs');
const path = require('path');

const KEEP_RUNS = 5;
const reportsDir = path.join(process.cwd(), 'reports');

function rmDir(dirPath) {
  if (!fs.existsSync(dirPath)) return '(not found)';
  fs.rmSync(dirPath, { recursive: true, force: true });
  return 'deleted';
}

const r1 = rmDir(path.join(process.cwd(), 'test-results'));
const r2 = rmDir(path.join(process.cwd(), 'playwright-report'));

let pruned = 0;
if (fs.existsSync(reportsDir)) {
  const runs = fs.readdirSync(reportsDir)
    .filter(f => f.startsWith('run-') && f.endsWith('.json'))
    .map(f => ({ name: f, mtime: fs.statSync(path.join(reportsDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  for (const f of runs.slice(KEEP_RUNS)) {
    fs.unlinkSync(path.join(reportsDir, f.name));
    pruned++;
  }
}

console.log(`\n🧹 Cleanup complete`);
console.log(`   test-results/      → ${r1}`);
console.log(`   playwright-report/ → ${r2}`);
console.log(`   Old run reports    → ${pruned} deleted (kept ${KEEP_RUNS} most recent + latest.json)\n`);
