const STREAK_STORAGE_KEY = 'hamStudyStreak'

export const MILESTONES = [
  { days: 7, title: 'One Week Warrior', icon: '🔥' },
  { days: 14, title: 'Fortnight Fighter', icon: '⭐' },
  { days: 30, title: 'Monthly Master', icon: '🌟' },
  { days: 60, title: 'Two Month Titan', icon: '💪' },
  { days: 100, title: 'Century Champion', icon: '🏆' },
  { days: 180, title: 'Half Year Hero', icon: '🎖️' },
  { days: 365, title: 'Year Legend', icon: '👑' }
]

export function getStreakData() {
  try {
    const stored = localStorage.getItem(STREAK_STORAGE_KEY)
    return stored ? JSON.parse(stored) : {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      activityHistory: []
    }
  } catch {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      activityHistory: []
    }
  }
}

export function saveStreakData(data) {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data))
}

function getDateString(date) {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isConsecutiveDay(date1, date2) {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2 - d1)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays === 1
}

function isSameDay(date1, date2) {
  return getDateString(date1) === getDateString(date2)
}

export function calculateStreak(activityHistory) {
  if (!activityHistory || activityHistory.length === 0) {
    return 0
  }

  const today = getDateString(new Date())
  const sortedHistory = [...activityHistory].sort().reverse()
  const mostRecentDate = sortedHistory[0]

  if (mostRecentDate !== today) {
    const yesterday = getDateString(new Date(Date.now() - 86400000))
    if (mostRecentDate !== yesterday) {
      return 0
    }
  }

  let streak = 1
  for (let i = 0; i < sortedHistory.length - 1; i++) {
    if (isConsecutiveDay(sortedHistory[i], sortedHistory[i + 1])) {
      streak++
    } else if (!isSameDay(sortedHistory[i], sortedHistory[i + 1])) {
      break
    }
  }

  return streak
}

export function updateStreak() {
  const data = getStreakData()
  const today = getDateString(new Date())

  if (data.lastActivityDate === today) {
    return data
  }

  const todayExists = data.activityHistory.includes(today)
  
  if (!todayExists) {
    data.activityHistory.push(today)
  }

  data.lastActivityDate = today
  data.currentStreak = calculateStreak(data.activityHistory)
  
  if (data.currentStreak > data.longestStreak) {
    data.longestStreak = data.currentStreak
  }

  saveStreakData(data)
  return data
}

export function getUnlockedMilestones(currentStreak) {
  return MILESTONES.filter(m => currentStreak >= m.days)
}

export function getNextMilestone(currentStreak) {
  return MILESTONES.find(m => currentStreak < m.days)
}

export function resetStreak() {
  const data = getStreakData()
  data.currentStreak = 0
  saveStreakData(data)
  return data
}
