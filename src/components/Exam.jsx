import { useState, useEffect, useRef } from 'react'
import QuestionCard from './QuestionCard'
import ExamResults from './ExamResults'
import { useSettings } from '../context/SettingsContext'
import './Exam.css'

function Exam({ questions: allQuestions, questionCount, mode, onBack }) {
  const { settings } = useSettings()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const autoAdvanceTimer = useRef(null)

  const isQuickMode = mode === 'study' ? settings.quickExam : settings.quickPractice

  useEffect(() => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, questionCount))
    setAnswers(new Array(questionCount).fill(null))
  }, [allQuestions, questionCount])

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current)
      }
    }
  }, [])

  const advanceToNext = () => {
    if (currentIndex < questionCount - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowResult(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answerIndex
    setAnswers(newAnswers)
    const currentQuestion = questions[currentIndex]
    const isCorrect = answerIndex === currentQuestion.correct

    if (mode === 'study') {
      setShowResult(true)
      if (isQuickMode && isCorrect) {
        autoAdvanceTimer.current = setTimeout(advanceToNext, 500)
      }
    } else {
      if (isQuickMode) {
        autoAdvanceTimer.current = setTimeout(advanceToNext, 0)
      } else {
        if (currentIndex < questionCount - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setIsComplete(true)
        }
      }
    }
  }

  const handleNext = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
    }
    advanceToNext()
  }

  const handlePrevious = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
    }
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowResult(answers[currentIndex - 1] !== null)
    }
  }

  const handleRestart = () => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current)
    }
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, questionCount))
    setAnswers(new Array(questionCount).fill(null))
    setCurrentIndex(0)
    setShowResult(false)
    setIsComplete(false)
  }

  const calculateScore = () => {
    let correct = 0
    answers.forEach((answer, index) => {
      if (answer === questions[index]?.correct) {
        correct++
      }
    })
    return correct
  }

  if (questions.length === 0) {
    return <div className="exam-loading">Loading questions...</div>
  }

  if (isComplete) {
    return (
      <ExamResults
        correct={calculateScore()}
        total={questionCount}
        questions={questions}
        answers={answers}
        onRestart={handleRestart}
      />
    )
  }

  const currentQuestion = questions[currentIndex]
  const canGoPrevious = currentIndex > 0

  return (
    <div className="exam-container">
      <div className="exam-header">
        <button className="back-link" onClick={onBack}>
          ← Exit Exam
        </button>
        <span className="question-counter">
          Question {currentIndex + 1} of {questionCount}
        </span>
      </div>
      
      <QuestionCard
        question={currentQuestion}
        selectedAnswer={answers[currentIndex]}
        onAnswer={handleAnswer}
        showResult={showResult}
      />
      
      <div className="exam-navigation">
        <button
          className="nav-button"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
        >
          Previous
        </button>
        
        {mode === 'study' && (
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={!showResult}
          >
            {currentIndex === questionCount - 1 ? 'Finish' : 'Next Question'}
          </button>
        )}

        {mode === 'practice' && !isQuickMode && (
          <button
            className="nav-button next-button"
            onClick={handleNext}
            disabled={answers[currentIndex] === null}
          >
            {currentIndex === questionCount - 1 ? 'Finish' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Exam
