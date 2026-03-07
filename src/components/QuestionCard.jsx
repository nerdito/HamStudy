import './QuestionCard.css'
import { useContext, useEffect, useState } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { stop, isSpeaking, speakQuestionWithLetters, startListening, stopListening } from '../utils/tts'
import { Volume2, VolumeX, Mic, MicOff, Star } from 'lucide-react'

function QuestionCard({ question, selectedAnswer, onAnswer, showResult, mustClickCorrect, showAnswer, onListeningChange, isBookmarked, onToggleBookmark }) {
  const settingsContext = useContext(SettingsContext)
  const settings = settingsContext?.settings || { 
    ttsEnabled: false, 
    ttsSpeed: 1.0, 
    ttsVoice: '',
    listeningMode: 'off'
  }
  const [isReading, setIsReading] = useState(false)
  const [isListeningActive, setIsListeningActive] = useState(false)

  useEffect(() => {
    return () => {
      stop()
      stopListening()
    }
  }, [])

  const getAnswerClass = (index) => {
    if (showAnswer || showResult) {
      if (index === question.correct) {
        return 'correct'
      }
      if (selectedAnswer === index && selectedAnswer !== question.correct) {
        return 'incorrect'
      }
      if (selectedAnswer === index) {
        return 'selected'
      }
      return ''
    }
    if (!showResult) {
      return selectedAnswer === index ? 'selected' : ''
    }
    if (index === question.correct) {
      return 'correct'
    }
    if (selectedAnswer === index && selectedAnswer !== question.correct) {
      return 'incorrect'
    }
    return ''
  }

  const handleClick = (index, event) => {
    if (isListeningActive) {
      stopListening()
      setIsListeningActive(false)
      if (onListeningChange) onListeningChange(false)
    }
    if (!showResult || mustClickCorrect) {
      onAnswer(index)
      event.target.blur()
    }
  }

  const handleReadQuestion = () => {
    if (isSpeaking()) {
      stop()
      setIsReading(false)
    } else {
      setIsReading(true)
      speakQuestionWithLetters(
        question.question, 
        question.answers, 
        settings.ttsSpeed, 
        settings.ttsVoice
      )
    }
  }

  const handleReadQuestionEnd = () => {
    setIsReading(false)
  }

  const handleMicClick = () => {
    if (isListeningActive) {
      stopListening()
      setIsListeningActive(false)
      if (onListeningChange) onListeningChange(false)
    } else {
      const success = startListening(
        (answerIndex) => {
          if (answerIndex >= 0 && (!showResult || mustClickCorrect)) {
            onAnswer(answerIndex)
          }
          setIsListeningActive(false)
          if (onListeningChange) onListeningChange(false)
        },
        () => {
          setIsListeningActive(false)
          if (onListeningChange) onListeningChange(false)
        }
      )
      if (success) {
        setIsListeningActive(true)
        if (onListeningChange) onListeningChange(true)
      }
    }
  }

  const showMicButton = settings.ttsEnabled && settings.listeningMode && settings.listeningMode !== 'off'

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-id">{question.id}</span>
        <span className="question-refs">{question.refs}</span>
        <div className="tts-controls">
          {onToggleBookmark && (
            <button 
              className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => onToggleBookmark(question.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
            >
              <Star size={18} fill={isBookmarked ? '#ffc107' : 'none'} />
            </button>
          )}
          {settings.ttsEnabled && (
            <button 
              className={`tts-button ${isReading ? 'reading' : ''}`}
              onClick={handleReadQuestion}
              title={isReading ? 'Stop reading' : 'Read question aloud'}
              onMouseLeave={handleReadQuestionEnd}
            >
              {isReading ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          )}
          {showMicButton && (
            <button 
              className={`mic-button ${isListeningActive ? 'listening' : ''}`}
              onClick={handleMicClick}
              title={isListeningActive ? 'Stop listening' : 'Answer with voice'}
            >
              {isListeningActive ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
        </div>
      </div>
      <p className="question-text">{question.question}</p>
      <div className="answers-list">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`answer-button ${getAnswerClass(index)}`}
            onClick={(e) => handleClick(index, e)}
            disabled={showResult && !mustClickCorrect}
          >
            <span className="answer-letter">{String.fromCharCode(65 + index)}.</span>
            <span className="answer-text">{answer}</span>
          </button>
        ))}
      </div>
      {(showResult || showAnswer) && selectedAnswer !== null && (
        <div className={`result-indicator ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
        </div>
      )}
      {mustClickCorrect && (
        <div className="must-click-hint">
          Click on correct to continue
        </div>
      )}
    </div>
  )
}

export default QuestionCard
