import { useState, useCallback, useMemo, useEffect } from 'react'
import './Flashcards.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Flashcards({ questions: allQuestions, license, onBack }) {
  const initialQuestions = useMemo(() => allQuestions || [], [allQuestions])
  const [displayQuestions, setDisplayQuestions] = useState(initialQuestions)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [knownCards, setKnownCards] = useState(new Set())

  const shuffle = useCallback(() => {
    const shuffledQuestions = [...initialQuestions].sort(() => Math.random() - 0.5)
    setDisplayQuestions(shuffledQuestions)
    setCurrentIndex(0)
    setKnownCards(new Set())
    setIsFlipped(false)
  }, [initialQuestions])

  const flip = useCallback(() => {
    setIsFlipped(prev => !prev)
  }, [])

  const nextCard = useCallback(() => {
    if (currentIndex < displayQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }, [currentIndex, displayQuestions.length])

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const toggleKnown = useCallback(() => {
    const questionId = displayQuestions[currentIndex]?.id
    if (questionId) {
      setKnownCards(prev => {
        const newSet = new Set(prev)
        if (newSet.has(questionId)) {
          newSet.delete(questionId)
        } else {
          newSet.add(questionId)
        }
        return newSet
      })
    }
  }, [currentIndex, displayQuestions])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        flip()
      } else if (e.code === 'ArrowRight') {
        nextCard()
      } else if (e.code === 'ArrowLeft') {
        prevCard()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [flip, nextCard, prevCard])

  if (!displayQuestions || displayQuestions.length === 0) {
    return (
      <div className="flashcards-container">
        <div className="flashcards-header">
          <button className="back-link" onClick={onBack}>← Back</button>
          <h1>Flashcards</h1>
        </div>
        <p className="no-questions">No questions available for flashcards.</p>
      </div>
    )
  }

  const currentQuestion = displayQuestions[currentIndex]
  const isKnown = knownCards.has(currentQuestion?.id)

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <button className="back-link" onClick={onBack}>← Back</button>
        <span className="license-indicator">
          {LICENSE_NAMES[license]}
        </span>
      </div>

      <div className="flashcards-controls">
        <button className="flashcard-btn" onClick={shuffle}>
          🔀 Shuffle
        </button>
        <span className="flashcard-progress">
          {currentIndex + 1} / {displayQuestions.length}
        </span>
        <span className="flashcard-known">
          Known: {knownCards.size}
        </span>
      </div>

      <div className="flashcard-wrapper">
        <div 
          className={`flashcard ${isFlipped ? 'flipped' : ''}`}
          onClick={flip}
        >
          <div className="flashcard-front">
            <span className="flashcard-id">{currentQuestion.id}</span>
            <p className="flashcard-question">{currentQuestion.question}</p>
            <span className="flip-hint">Click or press Space to flip</span>
          </div>
          <div className="flashcard-back">
            <p className="flashcard-answer-label">Correct Answer:</p>
            <p className="flashcard-answer">{currentQuestion.answers[currentQuestion.correct]}</p>
            {currentQuestion.refs && (
              <span className="flashcard-refs">{currentQuestion.refs}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flashcard-actions">
        <button 
          className={`flashcard-btn ${isKnown ? 'known-active' : ''}`}
          onClick={toggleKnown}
        >
          {isKnown ? '✓ Known' : 'Mark as Known'}
        </button>
      </div>

      <div className="flashcard-nav">
        <button 
          className="nav-btn"
          onClick={prevCard}
          disabled={currentIndex === 0}
        >
          ← Previous
        </button>
        <button 
          className="nav-btn"
          onClick={nextCard}
          disabled={currentIndex === displayQuestions.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Flashcards
