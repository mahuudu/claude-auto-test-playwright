import React, { useEffect, useState } from 'react'
import './index.css'

// ── Types ──────────────────────────────────────────────────────────────────
interface TestError {
  message: string
  expected?: string
  received?: string
}

interface TestResult {
  id: string
  title: string
  status: 'passed' | 'failed' | 'skipped'
  duration: number
  retries: number
  screenshot: string | null
  error: TestError | null
}

interface Suite {
  name: string
  file: string
  specFile: string
  tests: TestResult[]
}

interface Report {
  runId: string
  timestamp: string
  environment: {
    baseUrl: string
    browser: string
    os: string
  }
  summary: {
    total: number
    passed: number
    failed: number
    skipped: number
    duration: number
    passRate: string
  }
  suites: Suite[]
}

// ── Helpers ────────────────────────────────────────────────────────────────
function fmtDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function fmtTimestamp(iso: string) {
  return new Date(iso).toLocaleString()
}

function extractFeature(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/')
  const match = normalized.match(/tests\/e2e\/([^/]+)\//)
  return match ? match[1] : 'other'
}

function groupByFeature(suites: Suite[]): Record<string, Suite[]> {
  const groups: Record<string, Suite[]> = {}
  for (const suite of suites) {
    const feature = extractFeature(suite.file)
    if (!groups[feature]) groups[feature] = []
    groups[feature].push(suite)
  }
  return groups
}

function screenshotSrc(p: string) {
  const forward = p.replace(/\\/g, '/')
  const withoutPrefix = forward.replace(/^test-results\//, '')
  return `/test-results/${withoutPrefix}`
}

// ── Sub-components ─────────────────────────────────────────────────────────
function ErrorBlock({ error }: { error: TestError }) {
  return (
    <div className="error-block">
      <strong>Error:</strong> {error.message}
      {(error.expected != null || error.received != null) && (
        <div className="diff-row">
          {error.expected != null && (
            <div className="diff-box expected">
              <label>Expected</label>
              <pre>{error.expected}</pre>
            </div>
          )}
          {error.received != null && (
            <div className="diff-box received">
              <label>Received</label>
              <pre>{error.received}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ScreenshotCell({ path }: { path: string }) {
  const src = screenshotSrc(path)
  const isFailed = path.includes('failed') || path.includes('retry')
  return (
    <a href={src} target="_blank" rel="noreferrer" className={`screenshot-thumb-link ${isFailed ? 'failed' : ''}`}>
      <img src={src} alt="screenshot" className="screenshot-thumb" />
    </a>
  )
}

// ── Feature Table ──────────────────────────────────────────────────────────
function FeatureTable({
  feature, suites, filter
}: { feature: string; suites: Suite[]; filter: string }) {
  const [collapsed, setCollapsed] = useState(false)

  // Flatten all tests across suites, keeping suite name for grouping rows
  const rows = suites.flatMap(suite =>
    suite.tests
      .filter(t => filter === 'all' || t.status === filter)
      .map(t => ({ ...t, suiteName: suite.name, suiteFile: suite.file, specFile: suite.specFile }))
  )

  const allTests = suites.flatMap(s => s.tests)
  const passed  = allTests.filter(t => t.status === 'passed').length
  const failed  = allTests.filter(t => t.status === 'failed').length
  const skipped = allTests.filter(t => t.status === 'skipped').length
  const total   = allTests.length
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0
  const hasFailure = failed > 0

  if (rows.length === 0) return null

  return (
    <div className="feature-table-wrap">
      {/* Feature header */}
      <div
        className={`feature-header ${hasFailure ? 'has-failure' : ''}`}
        onClick={() => setCollapsed(c => !c)}
      >
        <div className="feature-header-left">
          <span className="feature-collapse">{collapsed ? '▶' : '▼'}</span>
          <span className="feature-icon">{hasFailure ? '🔴' : '🟢'}</span>
          <span className="feature-name">{feature}</span>
          <span className="feature-suite-count">{suites.length} suite{suites.length !== 1 ? 's' : ''}</span>
        </div>
        <div className="feature-stats">
          {passed > 0 && <span className="count-passed">✓ {passed}</span>}
          {failed > 0 && <span className="count-failed">✗ {failed}</span>}
          {skipped > 0 && <span className="count-skipped">⏭ {skipped}</span>}
          <span className="feature-rate">{passRate}%</span>
        </div>
      </div>

      {/* Table */}
      {!collapsed && (
        <table className="tests-table">
          <thead>
            <tr>
              <th style={{ width: 32 }}></th>
              <th style={{ width: 80 }}>TC</th>
              <th>Suite</th>
              <th>Test name</th>
              <th style={{ width: 80 }}>Duration</th>
              <th style={{ width: 70 }}>Retries</th>
              <th style={{ width: 90 }}>Status</th>
              <th style={{ width: 80 }}>Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(t => (
              <React.Fragment key={t.id + t.title + t.suiteName}>
                <tr className={`row-${t.status}`}>
                  <td className="td-dot">
                    <span className={`status-dot ${t.status}`} />
                  </td>
                  <td className="td-id">
                    <span className="test-id">{t.id}</span>
                  </td>
                  <td className="td-suite">{t.suiteName}</td>
                  <td className="td-title">{t.title.replace(/^TC-\d+:\s*/, '')}</td>
                  <td className="td-dur">{fmtDuration(t.duration)}</td>
                  <td className="td-retry">
                    {t.retries > 0 && <span className="retry-badge">↺ {t.retries}</span>}
                  </td>
                  <td className="td-status">
                    <span className={`status-pill ${t.status}`}>{t.status}</span>
                  </td>
                  <td className="td-screenshot">
                    {t.screenshot && <ScreenshotCell path={t.screenshot} />}
                  </td>
                </tr>
                {t.error && (
                  <tr className={`row-${t.status} row-detail`}>
                    <td colSpan={8} className="td-detail">
                      <ErrorBlock error={t.error} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [report, setReport] = useState<Report | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetch('/latest.json')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(setReport)
      .catch(e => setError(e.message))
  }, [])

  if (error) return (
    <div className="state-box">
      <div className="icon">⚠️</div>
      <p>Could not load <code>reports/latest.json</code></p>
      <p style={{ marginTop: 8, fontSize: '0.8rem', color: '#e53e3e' }}>{error}</p>
    </div>
  )

  if (!report) return (
    <div className="state-box">
      <div className="icon">⏳</div>
      <p>Loading report…</p>
    </div>
  )

  const { summary, environment } = report
  const featureGroups = groupByFeature(report.suites)
  const allTests = report.suites.flatMap(s => s.tests)

  const visibleCount = filter === 'all'
    ? allTests.length
    : allTests.filter(t => t.status === filter).length

  return (
    <>
      {/* Header */}
      <div className="header">
        <div>
          <h1>E2E Report <span>Viewer</span></h1>
          <div className="run-meta">
            <div>Run ID: <strong>{report.runId}</strong></div>
            <div>Time: {fmtTimestamp(report.timestamp)}</div>
          </div>
        </div>
        <div className="env-badges">
          <span className="badge">🌐 {environment.baseUrl}</span>
          <span className="badge">🖥 {environment.browser}</span>
          <span className="badge">💻 {environment.os}</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="summary-grid">
        <div className="card total">
          <div className="card-value">{summary.total}</div>
          <div className="card-label">Total</div>
        </div>
        <div className="card passed">
          <div className="card-value">{summary.passed}</div>
          <div className="card-label">Passed</div>
        </div>
        <div className="card failed">
          <div className="card-value">{summary.failed}</div>
          <div className="card-label">Failed</div>
        </div>
        <div className="card skipped">
          <div className="card-value">{summary.skipped}</div>
          <div className="card-label">Skipped</div>
        </div>
        <div className="card rate">
          <div className="card-value">{summary.passRate}</div>
          <div className="card-label">Pass Rate</div>
        </div>
        <div className="card dur">
          <div className="card-value">{fmtDuration(summary.duration)}</div>
          <div className="card-label">Duration</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        {(['all', 'passed', 'failed', 'skipped'] as const).map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span style={{ marginLeft: 6, opacity: 0.7 }}>
                ({allTests.filter(t => t.status === f).length})
              </span>
            )}
          </button>
        ))}
        <span className="toolbar-right">
          {Object.keys(featureGroups).length} feature{Object.keys(featureGroups).length !== 1 ? 's' : ''} · {visibleCount} test{visibleCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* One table per feature */}
      {Object.entries(featureGroups).map(([feature, suites]) => (
        <FeatureTable key={feature} feature={feature} suites={suites} filter={filter} />
      ))}
    </>
  )
}
