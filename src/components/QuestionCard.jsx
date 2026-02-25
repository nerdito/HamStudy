import './QuestionCard.css'

function QuestionCard({ question, selectedAnswer, onAnswer, showResult, mustClickCorrect, showAnswer }) {
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

  const handleClick = (index) => {
    if (!showResult || mustClickCorrect) {
      onAnswer(index)
    }
  }

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="question-id">{question.id}</span>
        <span className="question-refs">{question.refs}</span>
      </div>
      <p className="question-text">{question.question}</p>
      <div className="answers-list">
        {question.answers.map((answer, index) => (
          <button
            key={index}
            className={`answer-button ${getAnswerClass(index)}`}
            onClick={() => handleClick(index)}
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
