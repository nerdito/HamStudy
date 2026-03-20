import { createContext, useContext, useState, useCallback } from 'react'
import { 
  getStreakData, 
  updateStreak, 
  getUnlockedMilestones, 
  MILESTONES 
} from '../utils/streak'

export const StreakContext = createContext()

export function StreakProvider({ children }) {
  const initialData = getStreakData()
  const [streakData, setStreakData] = useState(initialData)
  const [milestones, setMilestones] = useState(getUnlockedMilestones(initialData.currentStreak))

  const recordActivity = useCallback(() => {
    const newData = updateStreak()
    setStreakData(newData)
    setMilestones(getUnlockedMilestones(newData.currentStreak))
    return newData
  }, [])

  const getNextMilestone = useCallback(() => {
    return MILESTONES.find(m => streakData.currentStreak < m.days)
  }, [streakData.currentStreak])

  const value = {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    lastActivityDate: streakData.lastActivityDate,
    activityHistory: streakData.activityHistory,
    milestones,
    recordActivity,
    getNextMilestone,
    MILESTONES
  }

  return (
    <StreakContext.Provider value={value}>
      {children}
    </StreakContext.Provider>
  )
}

export function useStreak() {
  const context = useContext(StreakContext)
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider')
  }
  return context
}
