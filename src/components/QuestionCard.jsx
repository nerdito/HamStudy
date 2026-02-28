import './QuestionCard.css'
import { useContext } from 'react'
import { SettingsContext } from '../context/SettingsContext'
import { speak, stop, isSpeaking } from '../utils/tts'
import { useState } from 'react'

function QuestionCard({ question, selectedAnswer, onAnswer, showResult, mustClickCorrect, showAnswer }) {
  const settingsContext = useContext(SettingsContext)
  const settings = settingsContext?.settings || { ttsEnabled: false, ttsSpeed: 1.0 }
  const [isReading, setIsReading] = useState(false)
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
      speakQuestion(question.question, question.answers, settings.ttsSpeed)
    }
  }

  const handleReadQuestionEnd = () => {
    setIsReading(false)
  }

  const speakQuestion = (questionText, answers, rate) => {
    const text = `${questionText}. ${answers.join('. ')}`;
    speak(text, rate);
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-id">{question.id}</span>
        <span className="question-refs">{question.refs}</span>
        {settings.ttsEnabled && (
          <button 
            className={`tts-button ${isReading ? 'reading' : ''}`}
            onClick={handleReadQuestion}
            title={isReading ? 'Stop reading' : 'Read question aloud'}
            onMouseLeave={handleReadQuestionEnd}
          >
            {isReading ? '⏹' : '🔊'}
          </button>
        )}
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
