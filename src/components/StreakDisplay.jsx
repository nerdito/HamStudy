import { Flame, Trophy, Target } from 'lucide-react'
import { useStreak } from '../context/StreakContext'
import './StreakDisplay.css'

function StreakDisplay() {
  const { 
    currentStreak, 
    longestStreak, 
    milestones, 
    getNextMilestone 
  } = useStreak()

  const nextMilestone = getNextMilestone()
  const progressToNext = nextMilestone 
    ? Math.min(100, Math.round((currentStreak / nextMilestone.days) * 100))
    : 100

  if (currentStreak === 0) {
    return (
      <div className="streak-display streak-inactive">
        <div className="streak-icon-container">
          <Flame size={32} className="streak-icon" />
        </div>
        <div className="streak-info">
          <h3>Start Your Streak!</h3>
          <p>Complete a study session today to begin tracking your streak.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="streak-display">
      <div className="streak-main">
        <div className="streak-icon-container">
          <Flame size={48} className="streak-icon flame-animated" />
          <span className="streak-count">{currentStreak}</span>
        </div>
        <div className="streak-info">
          <h3>Day Streak!</h3>
          <p>Keep it up! Study today to maintain your streak.</p>
        </div>
      </div>

      <div className="streak-stats">
        <div className="streak-stat">
          <Trophy size={20} className="stat-icon trophy" />
          <div className="stat-content">
            <span className="stat-value">{longestStreak}</span>
            <span className="stat-label">Longest Streak</span>
          </div>
        </div>
        <div className="streak-stat">
          <Target size={20} className="stat-icon target" />
          <div className="stat-content">
            <span className="stat-value">{nextMilestone ? nextMilestone.days : 'MAX'}</span>
            <span className="stat-label">Next Milestone</span>
          </div>
        </div>
      </div>

      {nextMilestone && (
        <div className="streak-progress">
          <div className="progress-header">
            <span>{nextMilestone.icon} {nextMilestone.title}</span>
            <span>{currentStreak}/{nextMilestone.days} days</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressToNext}%` }}
            />
          </div>
        </div>
      )}

      {milestones.length > 0 && (
        <div className="streak-milestones">
          <h4>Unlocked Achievements</h4>
          <div className="milestone-list">
            {milestones.map((milestone) => (
              <div key={milestone.days} className="milestone-badge">
                <span className="milestone-icon">{milestone.icon}</span>
                <span className="milestone-title">{milestone.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StreakDisplay
