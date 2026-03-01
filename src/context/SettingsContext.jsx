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

  const [streakData, setStreakData] = useState(() => {
    const saved = localStorage.getItem('hamStudyStreak')
    return saved ? JSON.parse(saved) : { currentStreak: 0, longestStreak: 0, lastStudyDate: null, totalStudyDays: 0 }
  })

  const [buildNumber] = useState(BUILD_NUMBER || '')

  useEffect(() => {
    localStorage.setItem('hamStudySettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem('hamStudyExamHistory', JSON.stringify(examHistory))
  }, [examHistory])

  useEffect(() => {
    localStorage.setItem('hamStudyStreak', JSON.stringify(streakData))
  }, [streakData])

  const getTodayString = () => {
    return new Date().toISOString().split('T')[0]
  }

  const getYesterdayString = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return yesterday.toISOString().split('T')[0]
  }

  const updateStreak = () => {
    const today = getTodayString()
    const yesterday = getYesterdayString()

    setStreakData(prev => {
      if (prev.lastStudyDate === today) {
        return prev
      }

      let newStreak
      if (prev.lastStudyDate === yesterday) {
        newStreak = prev.currentStreak + 1
      } else if (prev.lastStudyDate === null) {
        newStreak = 1
      } else {
        newStreak = 1
      }

      return {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastStudyDate: today,
        totalStudyDays: prev.lastStudyDate === today ? prev.totalStudyDays : prev.totalStudyDays + 1
      }
    })
  }

  const getMilestone = (streak) => {
    const milestones = [
      { days: 365, name: 'Year Legend', icon: '🏆' },
      { days: 100, name: 'Century Champion', icon: '🏆' },
      { days: 60, name: 'Two Month Titan', icon: '🏆' },
      { days: 30, name: 'Monthly Master', icon: '🏆' },
      { days: 14, name: 'Two Week Champion', icon: '🏆' },
      { days: 7, name: 'Week Warrior', icon: '🏆' }
    ]
    return milestones.find(m => streak >= m.days) || null
  }

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
      streakData,
      updateStreak,
      getMilestone,
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
