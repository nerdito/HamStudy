import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettings } from '../context/SettingsContext'
import { CheckCircle, XCircle, Home, RotateCcw, AlertCircle } from 'lucide-react'
import './ExamResults.css'

function ExamResults({ correct, total, questions, answers, license, onRestart }) {
  const navigate = useNavigate()
  const { saveExamResult } = useSettings()
  const [showIncorrect, setShowIncorrect] = useState(false)
  const percentage = Math.round((correct / total) * 100)
  const wrongCount = total - correct

  useEffect(() => {
    if (license) {
      saveExamResult({ license, correct, total })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const incorrectQuestions = useMemo(() => {
    return questions
      .map((question, index) => ({
        question,
        userAnswer: answers[index],
        isIncorrect: answers[index] !== question.correct
      }))
      .filter(item => item.isIncorrect)
  }, [questions, answers])

  const handleBackHome = () => {
    navigate('/')
  }

  return (
    <div className="exam-results">
      <h2>Exam Complete!</h2>
      <div className="score-display">
        <div className="score-percentage">{percentage}%</div>
        <div className="score-details">
          <span className="correct-count"><CheckCircle size={20} /> {correct} Correct</span>
          <span className="wrong-count"><XCircle size={20} /> {wrongCount} Wrong</span>
        </div>
      </div>
      <div className="result-message">
        {percentage >= 74 ? (
          <p className="pass-message">Great job! You passed!</p>
        ) : (
          <p className="fail-message">Keep studying! You need 74% to pass.</p>
        )}
      </div>

      {wrongCount > 0 && (
        <button 
          className="view-incorrect-button"
          onClick={() => setShowIncorrect(!showIncorrect)}
        >
          <AlertCircle size={18} />
          {showIncorrect ? 'Hide Incorrect' : `View ${wrongCount} Incorrect`}
        </button>
      )}

      {showIncorrect && (
        <div className="incorrect-list">
          {incorrectQuestions.map((item, idx) => (
            <div key={idx} className="incorrect-item">
              <div className="incorrect-question">
                <span className="question-number">Q{idx + 1}:</span> {item.question.question}
              </div>
              <div className="answer-comparison">
                <div className="your-answer incorrect">
                  <span className="answer-label">Your answer:</span>
                  <span>{item.question.answers[item.userAnswer] || 'No answer'}</span>
                </div>
                <div className="correct-answer">
                  <span className="answer-label">Correct answer:</span>
                  <span>{item.question.answers[item.question.correct]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="result-buttons">
        <button className="restart-button" onClick={onRestart}>
          <RotateCcw size={18} />
          Restart
        </button>
        <button className="home-button" onClick={handleBackHome}>
          <Home size={18} />
          Back Home
        </button>
      </div>
    </div>
  )
}

export default ExamResults
