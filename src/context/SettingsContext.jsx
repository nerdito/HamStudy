import { createContext, useContext, useState, useEffect } from 'react'
import { BUILD_NUMBER } from '../build-number'

export const SettingsContext = createContext()

const DEFAULT_SETTINGS = {
  studyQuestions: {
    technician: 25,
    general: 25,
    extra: 25
  },
  quickPractice: false,
  quickExam: false,
  fontSize: 'medium',
  showAnswer: false,
  darkMode: false,
  ttsEnabled: false,
  ttsSpeed: 1.0,
  ttsVoice: '',
  ttsAutoRead: false,
  listeningMode: 'off'
}

const MAX_QUESTIONS = {
  technician: 411,
  general: 427,
  extra: 602
}

const FONT_SIZES = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '20px',
  xxlarge: '24px'
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hamStudySettings')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  const [examHistory, setExamHistory] = useState(() => {
    const saved = localStorage.getItem('hamStudyExamHistory')
    return saved ? JSON.parse(saved) : []
  })

  const [buildNumber] = useState(BUILD_NUMBER || '')

  useEffect(() => {
    localStorage.setItem('hamStudySettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('hamStudyExamHistory', JSON.stringify(examHistory))
  }, [examHistory])

  const updateStudyQuestions = (license, count) => {
    const max = MAX_QUESTIONS[license]
    const validCount = Math.max(5, Math.min(count, max))
    setSettings(prev => ({
      ...prev,
      studyQuestions: {
        ...prev.studyQuestions,
        [license]: validCount
      }
    }))
  }

  const setQuickPractice = (value) => {
    setSettings(prev => ({ ...prev, quickPractice: value }))
  }

  const setQuickExam = (value) => {
    setSettings(prev => ({ ...prev, quickExam: value }))
  }

  const setFontSize = (value) => {
    setSettings(prev => ({ ...prev, fontSize: value }))
  }

  const setShowAnswer = (value) => {
    setSettings(prev => ({ ...prev, showAnswer: value }))
  }

  const setDarkMode = (value) => {
    setSettings(prev => ({ ...prev, darkMode: value }))
  }

  const setTtsEnabled = (value) => {
    setSettings(prev => ({ ...prev, ttsEnabled: value }))
  }

  const setTtsSpeed = (value) => {
    setSettings(prev => ({ ...prev, ttsSpeed: value }))
  }

  const setTtsAutoRead = (value) => {
    setSettings(prev => ({ ...prev, ttsAutoRead: value }))
  }

  const setTtsVoice = (value) => {
    setSettings(prev => ({ ...prev, ttsVoice: value }))
  }

  const setListeningMode = (value) => {
    setSettings(prev => ({ ...prev, listeningMode: value }))
  }

  const saveExamResult = (result) => {
    const newResult = {
      id: Date.now(),
      date: new Date().toISOString(),
      license: result.license,
      correct: result.correct,
      total: result.total,
      percentage: Math.round((result.correct / result.total) * 100),
      passed: (result.correct / result.total) >= 0.74
    }
    setExamHistory(prev => [newResult, ...prev].slice(0, 50))
  }

  const clearExamHistory = () => {
    setExamHistory([])
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateStudyQuestions,
      setQuickPractice,
      setQuickExam,
      setFontSize,
      setShowAnswer,
      setDarkMode,
      setTtsEnabled,
      setTtsSpeed,
      setTtsVoice,
      setTtsAutoRead,
      setListeningMode,
      saveExamResult,
      examHistory,
      clearExamHistory,
      resetToDefaults,
      MAX_QUESTIONS,
      FONT_SIZES,
      buildNumber
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
