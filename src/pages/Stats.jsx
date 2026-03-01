import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import './Stats.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Stats() {
  const { examHistory, streakData, getMilestone } = useSettings()

  const stats = examHistory.length > 0 ? {
    totalExams: examHistory.length,
    averageScore: Math.round(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length),
    passRate: Math.round((examHistory.filter(e => e.passed).length / examHistory.length) * 100)
  } : null

  const milestone = getMilestone(streakData.currentStreak)
  const milestones = [
    { days: 7, name: 'Week Warrior', icon: '🏆' },
    { days: 14, name: 'Two Week Champion', icon: '🏆' },
    { days: 30, name: 'Monthly Master', icon: '🏆' },
    { days: 60, name: 'Two Month Titan', icon: '🏆' },
    { days: 100, name: 'Century Champion', icon: '🏆' },
    { days: 365, name: 'Year Legend', icon: '🏆' }
  ]

  if (examHistory.length === 0) {
    return (
      <div className="page-container stats-page">
        <h1>Statistics</h1>
        <p className="no-data">No exam history yet. Complete some exams to see your statistics!</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="page-container stats-page">
      <h1>Statistics</h1>

      <div className="stats-section">
        <h2>Streaks</h2>
        <div className="streak-stats">
          <div className="streak-card">
            <span className="streak-card-icon">🔥</span>
            <span className="streak-card-value">{streakData.currentStreak}</span>
            <span className="streak-card-label">Current Streak</span>
          </div>
          <div className="streak-card">
            <span className="streak-card-icon">⭐</span>
            <span className="streak-card-value">{streakData.longestStreak}</span>
            <span className="streak-card-label">Longest Streak</span>
          </div>
          <div className="streak-card">
            <span className="streak-card-icon">📅</span>
            <span className="streak-card-value">{streakData.totalStudyDays}</span>
            <span className="streak-card-label">Total Study Days</span>
          </div>
        </div>

        {milestone && (
          <div className="current-milestone">
            <span className="milestone-icon">{milestone.icon}</span>
            <span className="milestone-text">Current: {milestone.name}</span>
          </div>
        )}

        <div className="milestones-list">
          <h3>Milestones</h3>
          <div className="milestones-grid">
            {milestones.map(m => (
              <div 
                key={m.days} 
                className={`milestone-badge ${streakData.longestStreak >= m.days ? 'earned' : ''}`}
              >
                <span className="milestone-badge-icon">{m.icon}</span>
                <span className="milestone-badge-days">{m.days} days</span>
                <span className="milestone-badge-name">{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

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
      </div>

      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Stats
