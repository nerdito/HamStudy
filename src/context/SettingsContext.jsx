import { createContext, useContext, useState, useEffect } from 'react'
import { BUILD_NUMBER } from '../build-number'

const SettingsContext = createContext()

const DEFAULT_SETTINGS = {
  studyQuestions: {
    technician: 25,
    general: 25,
    extra: 25
  },
  quickPractice: false,
  quickExam: false,
  fontSize: 'medium',
  showAnswer: false
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
