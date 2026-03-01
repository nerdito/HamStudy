import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import logo from '../assets/logo.png'
import './Home.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Home() {
  const { examHistory } = useSettings()

  const recentExams = examHistory.slice(0, 5)
  
  const stats = examHistory.length > 0 ? {
    totalExams: examHistory.length,
    averageScore: Math.round(examHistory.reduce((sum, e) => sum + e.percentage, 0) / examHistory.length),
    passRate: Math.round((examHistory.filter(e => e.passed).length / examHistory.length) * 100),
    bestScore: Math.max(...examHistory.map(e => e.percentage)),
    totalQuestions: examHistory.reduce((sum, e) => sum + e.total, 0),
    totalCorrect: examHistory.reduce((sum, e) => sum + e.correct, 0)
  } : null

  const licenseStats = examHistory.length > 0 ? {
    technician: examHistory.filter(e => e.license === 'technician').length,
    general: examHistory.filter(e => e.license === 'general').length,
    extra: examHistory.filter(e => e.license === 'extra').length
  } : null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="home-container">
      <div className="title-container">
        <img src={logo} alt="Logo" className="home-logo" />
        <h1>Ham Radio Test Practice</h1>
      </div>
      <div className="button-container">
        <Link to="/study" className="home-button">Study</Link>
        <Link to="/practice" className="home-button">Practice Exam</Link>
        <Link to="/settings" className="home-button">Settings</Link>
      </div>

      {examHistory.length > 0 && (
        <div className="progress-section">
          <h2>Your Progress</h2>
          
          {stats && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalExams}</div>
                  <div className="stat-label">Total Exams</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.averageScore}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.passRate}%</div>
                  <div className="stat-label">Pass Rate</div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.bestScore}%</div>
                  <div className="stat-label">Best Score</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.totalCorrect}/{stats.totalQuestions}</div>
                  <div className="stat-label">Total Correct</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{licenseStats?.technician || 0}</div>
                  <div className="stat-label">Technician Exams</div>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{licenseStats?.general || 0}</div>
                  <div className="stat-label">General Exams</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{licenseStats?.extra || 0}</div>
                  <div className="stat-label">Extra Exams</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">
                    <Link to="/stats" className="stats-link">View All →</Link>
                  </div>
                  <div className="stat-label">Detailed Stats</div>
                </div>
              </div>
            </>
          )}

          {recentExams.length > 0 && (
            <div className="recent-exams">
              <h3>Recent Exams</h3>
              <div className="exam-list">
                {recentExams.map((exam) => (
                  <div key={exam.id} className="exam-item">
                    <span className="exam-license">{LICENSE_NAMES[exam.license] || exam.license}</span>
                    <span className="exam-score">{exam.correct}/{exam.total} ({exam.percentage}%)</span>
                    <span className={`exam-result ${exam.passed ? 'passed' : 'failed'}`}>
                      {exam.passed ? 'Passed' : 'Failed'}
                    </span>
                    <span className="exam-date">{formatDate(exam.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Home
