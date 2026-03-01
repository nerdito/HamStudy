import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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
  listeningMode: 'off',
  srsEnabled: false
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
  xxlarge: '22px'
}

const STORAGE_KEY = 'hamStudySettings'
const HISTORY_KEY = 'hamStudyExamHistory'
const SRS_KEY = 'hamStudySRS'
const BOOKMARKS_KEY = 'hamStudyBookmarks'

const getStoredSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

const getStoredHistory = () => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const getStoredSRS = () => {
  try {
    const stored = localStorage.getItem(SRS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

const getStoredBookmarks = () => {
  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    return stored ? JSON.parse(stored) : { technician: [], general: [], extra: [] }
  } catch {
    return { technician: [], general: [], extra: [] }
  }
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(getStoredSettings)
  const [examHistory, setExamHistory] = useState(getStoredHistory)
  const [srsData, setSrsData] = useState(getStoredSRS)
  const [bookmarks, setBookmarks] = useState(getStoredBookmarks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(examHistory))
  }, [examHistory])

  useEffect(() => {
    localStorage.setItem(SRS_KEY, JSON.stringify(srsData))
  }, [srsData])

  useEffect(() => {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  const buildNumber = BUILD_NUMBER

  const updateStudyQuestions = (license, count) => {
    setSettings(prev => ({
      ...prev,
      studyQuestions: {
        ...prev.studyQuestions,
        [license]: count
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

  const setSrsEnabled = (value) => {
    setSettings(prev => ({ ...prev, srsEnabled: value }))
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

  const updateSRSQuestion = (questionId, isCorrect) => {
    setSrsData(prev => {
      const current = prev[questionId] || {
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        lastReview: null,
        incorrectCount: 0
      }

      let newData
      if (isCorrect) {
        const newRepetitions = current.repetitions + 1
        let newInterval
        if (newRepetitions === 1) {
          newInterval = 1
        } else if (newRepetitions === 2) {
          newInterval = 6
        } else {
          newInterval = Math.round(current.interval * current.easeFactor)
        }

        newData = {
          easeFactor: Math.min(current.easeFactor + 0.1, 3.0),
          interval: newInterval,
          repetitions: newRepetitions,
          lastReview: Date.now(),
          incorrectCount: current.incorrectCount
        }
      } else {
        newData = {
          easeFactor: Math.max(current.easeFactor - 0.2, 1.3),
          interval: 1,
          repetitions: 0,
          lastReview: Date.now(),
          incorrectCount: current.incorrectCount + 1
        }
      }

      return { ...prev, [questionId]: newData }
    })
  }

  const getSRSQuestionPriority = (questionId) => {
    const data = srsData[questionId]
    if (!data) return 100

    const now = Date.now()
    const isOverdue = data.lastReview && (now - data.lastReview) > (data.interval * 24 * 60 * 60 * 1000)

    return (data.incorrectCount * 10) +
           (1 / (data.repetitions + 1)) +
           (isOverdue ? 100 : 0)
  }

  const getQuestionsDueForReview = useCallback((licenseQuestions) => {
    const now = Date.now()
    return licenseQuestions.filter(q => {
      const data = srsData[q.id]
      if (!data) return true
      if (!data.lastReview) return true
      return (now - data.lastReview) > (data.interval * 24 * 60 * 60 * 1000)
    })
  }, [srsData])

  const getQuestionStats = (questionId) => {
    return srsData[questionId] || null
  }

  const addBookmark = (license, questionId) => {
    setBookmarks(prev => {
      const current = prev[license] || []
      if (current.includes(questionId)) return prev
      return { ...prev, [license]: [...current, questionId] }
    })
  }

  const removeBookmark = (license, questionId) => {
    setBookmarks(prev => ({
      ...prev,
      [license]: (prev[license] || []).filter(id => id !== questionId)
    }))
  }

  const isBookmarked = (license, questionId) => {
    return (bookmarks[license] || []).includes(questionId)
  }

  const toggleBookmark = (license, questionId) => {
    if (isBookmarked(license, questionId)) {
      removeBookmark(license, questionId)
    } else {
      addBookmark(license, questionId)
    }
  }

  const getBookmarks = (license) => {
    return bookmarks[license] || []
  }

  const clearBookmarks = () => {
    setBookmarks({ technician: [], general: [], extra: [] })
  }

  const clearExamHistory = () => {
    setExamHistory([])
  }

  const resetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  const clearSRSData = () => {
    setSrsData({})
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
      setSrsEnabled,
      saveExamResult,
      updateSRSQuestion,
      getSRSQuestionPriority,
      getQuestionsDueForReview,
      getQuestionStats,
      addBookmark,
      removeBookmark,
      toggleBookmark,
      isBookmarked,
      getBookmarks,
      clearBookmarks,
      clearSRSData,
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
