import { Link } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { getVoices, isRecognitionSupported } from '../utils/tts'
import { useState, useEffect } from 'react'
import './Settings.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Settings() {
  const { settings, updateStudyQuestions, setQuickPractice, setQuickExam, setFontSize, setShowAnswer, setTtsEnabled, setTtsSpeed, setTtsVoice, setTtsAutoRead, setListeningMode, clearExamHistory, resetToDefaults, MAX_QUESTIONS, FONT_SIZES, buildNumber } = useSettings()
  const [voices, setVoices] = useState([])
  const [voicesLoaded, setVoicesLoaded] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = getVoices()
      if (availableVoices.length > 0) {
        setVoices(availableVoices)
        setVoicesLoaded(true)
      }
    }

    loadVoices()
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    const timer = setTimeout(() => {
      if (!voicesLoaded) {
        setVoices(getVoices())
        setVoicesLoaded(true)
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleDecrement = (license) => {
    const current = settings.studyQuestions[license]
    const newValue = Math.max(5, current - 5)
    updateStudyQuestions(license, newValue)
  }

  const handleIncrement = (license) => {
    const current = settings.studyQuestions[license]
    const max = MAX_QUESTIONS[license]
    const newValue = Math.min(max, current + 5)
    updateStudyQuestions(license, newValue)
  }

  return (
    <div className="page-container settings-page">
      <h1>Settings</h1>
      {buildNumber && <p className="build-number">Build {buildNumber}</p>}
      
      <div className="settings-section">
        <h2>Study Questions per License</h2>
        <p className="settings-description">
          Set the number of questions for each license class in Study mode (min: 5, max: pool size)
        </p>
        
        <div className="study-questions-config">
          {Object.keys(LICENSE_NAMES).map(license => (
            <div key={license} className="question-input-group">
              <label htmlFor={license}>{LICENSE_NAMES[license]}</label>
              <div className="question-controls">
                <button
                  className="control-btn"
                  onClick={() => handleDecrement(license)}
                  disabled={settings.studyQuestions[license] <= 5}
                >
                  -5
                </button>
                <span className="question-value">{settings.studyQuestions[license]}</span>
                <button
                  className="control-btn"
                  onClick={() => handleIncrement(license)}
                  disabled={settings.studyQuestions[license] >= MAX_QUESTIONS[license]}
                >
                  +5
                </button>
              </div>
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
            <option value="xxlarge">XX Large</option>
          </select>
        </div>

        <div className="toggle-group">
          <label className="toggle-label">
            <span>Show Answer in Study</span>
            <span className="toggle-description">Show correct answer immediately after selecting</span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.showAnswer}
              onChange={(e) => setShowAnswer(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h2>Text-to-Speech Settings</h2>
        
        <div className="toggle-group">
          <label className="toggle-label">
            <span>Enable Text-to-Speech</span>
            <span className="toggle-description">Show read aloud button on questions</span>
          </label>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settings.ttsEnabled}
              onChange={(e) => setTtsEnabled(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {settings.ttsEnabled && (
          <>
            <div className="toggle-group">
              <label className="toggle-label">
                <span>Voice</span>
              </label>
              <select
                className="voice-select"
                value={settings.ttsVoice}
                onChange={(e) => setTtsVoice(e.target.value)}
              >
                <option value="">Default</option>
                {voices.map(voice => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div className="toggle-group">
              <label className="toggle-label">
                <span>Speech Speed: {settings.ttsSpeed}x</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.ttsSpeed}
                onChange={(e) => setTtsSpeed(parseFloat(e.target.value))}
                className="speed-slider"
              />
            </div>

            <div className="toggle-group">
              <label className="toggle-label">
                <span>Auto-read Questions</span>
                <span className="toggle-description">Automatically read questions aloud when they appear</span>
              </label>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={settings.ttsAutoRead}
                  onChange={(e) => setTtsAutoRead(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {isRecognitionSupported() && (
              <div className="toggle-group">
                <label className="toggle-label">
                  <span>Voice Answer Mode</span>
                  <span className="toggle-description">Allow answering questions with your voice</span>
                </label>
                <select
                  className="listening-select"
                  value={settings.listeningMode}
                  onChange={(e) => setListeningMode(e.target.value)}
                >
                  <option value="off">Off</option>
                  <option value="demand">On Demand (click mic)</option>
                  <option value="auto">Auto (hands-free)</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div className="settings-section">
        <button className="reset-button" onClick={resetToDefaults}>
          Reset to Defaults
        </button>
      </div>

      <div className="settings-section">
        <button className="reset-button" onClick={clearExamHistory}>
          Clear Progress
        </button>
      </div>

      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Settings
