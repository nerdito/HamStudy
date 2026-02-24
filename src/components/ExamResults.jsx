import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ExamResults.css'

function ExamResults({ correct, total, questions, answers, onRestart }) {
  const [showIncorrect, setShowIncorrect] = useState(false)
  const percentage = Math.round((correct / total) * 100)
  const wrongCount = total - correct

  const getIncorrectQuestions = () => {
    return questions
      .map((question, index) => ({
        question,
        userAnswer: answers[index],
        isIncorrect: answers[index] !== question.correct
      }))
      .filter(item => item.isIncorrect)
  }

  const incorrectQuestions = getIncorrectQuestions()

  return (
    <div className="exam-results">
      <h2>Exam Complete!</h2>
      <div className="score-display">
        <div className="score-percentage">{percentage}%</div>
        <div className="score-details">
          <span className="correct-count">✓ {correct} Correct</span>
          <span className="wrong-count">✗ {wrongCount} Wrong</span>
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
          Restart
        </button>
        <Link to="/" className="home-button">
          Back Home
        </Link>
      </div>
    </div>
  )
}

export default ExamResults
