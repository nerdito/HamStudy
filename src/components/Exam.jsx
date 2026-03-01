import { useState, useEffect, useRef } from 'react'
import QuestionCard from './QuestionCard'
import ExamResults from './ExamResults'
import { useSettings } from '../context/SettingsContext'
import { speakQuestionWithLetters, stop, startListening, stopListening } from '../utils/tts'
import './Exam.css'

function Exam({ questions: allQuestions, questionCount, mode, license, onBack }) {
  const { settings, getQuestionsDueForReview, updateSRSQuestion, isBookmarked, toggleBookmark } = useSettings()
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [mustClickCorrect, setMustClickCorrect] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const autoAdvanceTimer = useRef(null)

  const isQuickMode = mode === 'study' ? settings.quickExam : settings.quickPractice

  useEffect(() => {
    let selectedQuestions
    if (settings.srsEnabled) {
      const dueQuestions = getQuestionsDueForReview(allQuestions)
      const shuffled = [...dueQuestions].sort(() => Math.random() - 0.5)
      selectedQuestions = shuffled.slice(0, questionCount)
    } else {
      const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
      selectedQuestions = shuffled.slice(0, questionCount)
    }
    setQuestions(selectedQuestions)
    setAnswers(new Array(questionCount).fill(null))
  }, [allQuestions, questionCount, settings.srsEnabled])

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) {
        clearTimeout(autoAdvanceTimer.current)
      }
      stop()
      stopListening()
    }
  }, [])

  useEffect(() => {
    if (questions.length > 0 && settings.ttsEnabled && settings.ttsAutoRead) {
      const currentQuestion = questions[currentIndex]
      if (currentQuestion) {
        speakQuestionWithLetters(
          currentQuestion.question,
          currentQuestion.answers,
          settings.ttsSpeed,
          settings.ttsVoice
        )
      }
    }
  }, [currentIndex, questions, settings.ttsEnabled, settings.ttsAutoRead, settings.ttsSpeed, settings.ttsVoice])

  useEffect(() => {
    if (settings.ttsEnabled && settings.listeningMode === 'auto' && !isListening && !showResult) {
      const success = startListening(
        (answerIndex) => {
          if (answerIndex >= 0) {
            handleAnswer(answerIndex)
          }
          setIsListening(false)
        },
        () => setIsListening(false)
      )
      if (success) {
        setIsListening(true)
      }
    }
  }, [currentIndex, settings.ttsEnabled, settings.listeningMode, showResult, isListening])

  const handleListeningChange = (listening) => {
    setIsListening(listening)
  }

  const advanceToNext = () => {
    if (currentIndex < questionCount - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowResult(false)
      setMustClickCorrect(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleAnswer = (answerIndex) => {
    if (isListening) {
      stopListening()
      setIsListening(false)
    }
    const newAnswers = [...answers]
    newAnswers[currentIndex] = answerIndex
    setAnswers(newAnswers)
    const currentQuestion = questions[currentIndex]
    const isCorrect = answerIndex === currentQuestion.correct

    if (settings.srsEnabled) {
      updateSRSQuestion(currentQuestion.id, isCorrect)
    }

    if (mode === 'study') {
      if (mustClickCorrect) {
        if (isCorrect) {
          advanceToNext()
        }
        return
      }

      setShowResult(true)
      
      if (isCorrect) {
        if (isQuickMode) {
          autoAdvanceTimer.current = setTimeout(advanceToNext, 500)
        }
      } else {
        setMustClickCorrect(true)
      }
    } else {
      if (currentIndex < questionCount - 1) {
        if (isQuickMode) {
          autoAdvanceTimer.current = setTimeout(advanceToNext, 0)
        } else {
          setCurrentIndex(currentIndex + 1)
        }
      } else {
        setIsComplete(true)
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
      setMustClickCorrect(false)
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
    setMustClickCorrect(false)
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
        license={license}
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
        mustClickCorrect={mustClickCorrect}
        showAnswer={mode === 'study' && settings.showAnswer}
        listeningMode={settings.listeningMode}
        onListeningChange={handleListeningChange}
        isBookmarked={isBookmarked(license, currentQuestion.id)}
        onToggleBookmark={() => toggleBookmark(license, currentQuestion.id)}
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
