import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import './Timer.css'

const LICENSE_TIME_LIMITS = {
  technician: 7 * 60,
  general: 7 * 60,
  extra: 12 * 60
}

const TIME_STATES = {
  NORMAL: 'normal',
  WARNING: 'warning',
  CRITICAL: 'critical'
}

function Timer({ license, onTimeUp, isActive }) {
  const totalSeconds = LICENSE_TIME_LIMITS[license] || 7 * 60
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds)
  const intervalRef = useRef(null)
  const onTimeUpCalledRef = useRef(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecondsRemaining(totalSeconds)
    onTimeUpCalledRef.current = false
  }, [totalSeconds])

  useEffect(() => {
    if (!isActive || secondsRemaining <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (!onTimeUpCalledRef.current && onTimeUp) {
            onTimeUpCalledRef.current = true
            onTimeUp()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, onTimeUp, secondsRemaining])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeState = () => {
    if (secondsRemaining <= 10) return TIME_STATES.CRITICAL
    if (secondsRemaining <= 60) return TIME_STATES.WARNING
    return TIME_STATES.NORMAL
  }

  const getProgressPercent = () => {
    return (secondsRemaining / totalSeconds) * 100
  }

  const timeState = getTimeState()

  return (
    <div className={`timer-container timer-${timeState}`}>
      <div className="timer-icon">
        <Clock size={20} />
      </div>
      <div className="timer-content">
        <div className="timer-display">
          {formatTime(secondsRemaining)}
        </div>
        <div className="timer-bar">
          <div 
            className="timer-bar-fill"
            style={{ width: `${getProgressPercent()}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Timer
