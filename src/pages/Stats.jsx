import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { ArrowLeft } from 'lucide-react'
import './Stats.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Stats() {
  const { examHistory } = useSettings()

  const stats = examHistory.length > 0 ? {
    totalExams: examHistory.length,
    averageScore: Math.round(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length),
    passRate: Math.round((examHistory.filter(e => e.passed).length / examHistory.length) * 100),
    bestScore: Math.max(...examHistory.map(e => e.percentage)),
    worstScore: Math.min(...examHistory.map(e => e.percentage)),
    totalQuestions: examHistory.reduce((sum, e) => sum + e.total, 0),
    totalCorrect: examHistory.reduce((sum, e) => sum + e.correct, 0),
    recentTrend: getRecentTrend()
  } : null

  function getRecentTrend() {
    if (examHistory.length < 2) return null
    const recent = examHistory.slice(0, 5)
    const older = examHistory.slice(5, 10)
    if (older.length === 0) return null
    const recentAvg = recent.reduce((s, e) => s + e.percentage, 0) / recent.length
    const olderAvg = older.reduce((s, e) => s + e.percentage, 0) / older.length
    return recentAvg - olderAvg
  }

  const licenseStats = examHistory.length > 0 ? {
    technician: examHistory.filter(e => e.license === 'technician'),
    general: examHistory.filter(e => e.license === 'general'),
    extra: examHistory.filter(e => e.license === 'extra')
  } : null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getLicenseStats = (license) => {
    const exams = licenseStats?.[license] || []
    if (exams.length === 0) return null
    return {
      count: exams.length,
      avgScore: Math.round(exams.reduce((s, e) => s + e.percentage, 0) / exams.length),
      passRate: Math.round((exams.filter(e => e.passed).length / exams.length) * 100),
      bestScore: Math.max(...exams.map(e => e.percentage))
    }
  }

  if (examHistory.length === 0) {
    return (
      <div className="page-container stats-page">
        <h1>Statistics</h1>
        <p className="no-data">No exam history yet. Complete some exams to see your statistics!</p>
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="page-container stats-page">
      <h1>Statistics</h1>
      
      <div className="stats-section">
        <h2>Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.totalExams}</div>
            <div className="stat-label">Total Exams</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.averageScore}%</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.passRate}%</div>
            <div className="stat-label">Pass Rate</div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.bestScore}%</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.worstScore}%</div>
            <div className="stat-label">Worst Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalCorrect}/{stats?.totalQuestions}</div>
            <div className="stat-label">Total Correct</div>
          </div>
        </div>

        {stats?.recentTrend !== null && stats?.recentTrend !== undefined && (
          <div className="trend-indicator">
            <span>Recent Trend: </span>
            <span className={stats.recentTrend > 0 ? 'trend-up' : stats.recentTrend < 0 ? 'trend-down' : ''}>
              {stats.recentTrend > 0 ? '↑' : stats.recentTrend < 0 ? '↓' : '→'} 
              {Math.abs(Math.round(stats.recentTrend))}% 
              {stats.recentTrend > 0 ? ' (improving)' : stats.recentTrend < 0 ? ' (declining)' : ' (stable)'}
            </span>
          </div>
        )}
      </div>

      <div className="stats-section">
        <h2>By License Class</h2>
        <div className="license-stats">
          {Object.entries(LICENSE_NAMES).map(([key, name]) => {
            const ls = getLicenseStats(key)
            if (!ls) return null
            return (
              <div key={key} className="license-stat-card">
                <h3>{name}</h3>
                <div className="license-stat-grid">
                  <div className="stat-item">
                    <span className="stat-item-value">{ls.count}</span>
                    <span className="stat-item-label">Exams</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-item-value">{ls.avgScore}%</span>
                    <span className="stat-item-label">Avg Score</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-item-value">{ls.passRate}%</span>
                    <span className="stat-item-label">Pass Rate</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-item-value">{ls.bestScore}%</span>
                    <span className="stat-item-label">Best</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="stats-section">
        <h2>Exam History</h2>
        <div className="history-list">
          {examHistory.map((exam) => (
            <div key={exam.id} className="history-item">
              <div className="history-left">
                <span className="history-license">{LICENSE_NAMES[exam.license] || exam.license}</span>
                <span className="history-date">{formatDate(exam.date)}</span>
              </div>
              <div className="history-right">
                <span className="history-score">{exam.correct}/{exam.total} ({exam.percentage}%)</span>
                <span className={`history-result ${exam.passed ? 'passed' : 'failed'}`}>
                  {exam.passed ? '✓ Passed' : '✗ Failed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Stats
