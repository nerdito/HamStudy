import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import './Settings.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Settings() {
  const { settings, updateStudyQuestions, setQuickPractice, setQuickExam, setFontSize, resetToDefaults, MAX_QUESTIONS, FONT_SIZES } = useSettings()

  const handleInputChange = (license, value) => {
    const numValue = parseInt(value, 10) || 5
    updateStudyQuestions(license, numValue)
  }

  return (
    <div className="page-container settings-page">
      <h1>Settings</h1>
      
      <div className="settings-section">
        <h2>Study Questions per License</h2>
        <p className="settings-description">
          Set the number of questions for each license class in Study mode (min: 5, max: pool size)
        </p>
        
        <div className="study-questions-config">
          {Object.keys(LICENSE_NAMES).map(license => (
            <div key={license} className="question-input-group">
              <label htmlFor={license}>{LICENSE_NAMES[license]}</label>
              <input
                type="number"
                id={license}
                value={settings.studyQuestions[license]}
                onChange={(e) => handleInputChange(license, e.target.value)}
                min={5}
                max={MAX_QUESTIONS[license]}
              />
              <span className="max-questions">/ {MAX_QUESTIONS[license]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h2>Quick Mode Settings</h2>
        
        <div className="toggle-group">
          <label className="toggle-label">
            <span>Quick Study</span>
            <span className="toggle-description">In Study mode: correct answers auto-advance immediately</span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.quickPractice}
              onChange={(e) => setQuickPractice(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div className="toggle-group">
          <label className="toggle-label">
            <span>Quick Exam</span>
            <span className="toggle-description">In Study mode: correct answers auto-advance immediately</span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.quickExam}
              onChange={(e) => setQuickExam(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Display Settings</h2>
        
        <div className="toggle-group">
          <label className="toggle-label">
            <span>Font Size</span>
          </label>
          <select
            className="font-size-select"
            value={settings.fontSize}
            onChange={(e) => setFontSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>
      </div>

      <div className="settings-section">
        <button className="reset-button" onClick={resetToDefaults}>
          Reset to Defaults
        </button>
      </div>

      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Settings
