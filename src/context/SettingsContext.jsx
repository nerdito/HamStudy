import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext()

const DEFAULT_SETTINGS = {
  studyQuestions: {
    technician: 25,
    general: 25,
    extra: 25
  },
  quickPractice: false,
  quickExam: false
}

const MAX_QUESTIONS = {
  technician: 411,
  general: 427,
  extra: 602
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hamStudySettings')
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('hamStudySettings', JSON.stringify(settings))
  }, [settings])

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

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <SettingsContext.Provider value={{
      settings,
      updateStudyQuestions,
      setQuickPractice,
      setQuickExam,
      resetToDefaults,
      MAX_QUESTIONS
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
