import './QuestionCard.css'

function QuestionCard({ question, selectedAnswer, onAnswer, showResult }) {
  const getAnswerClass = (index) => {
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
            onClick={() => !showResult && onAnswer(index)}
            disabled={showResult}
          >
            <span className="answer-letter">{String.fromCharCode(65 + index)}.</span>
            <span className="answer-text">{answer}</span>
          </button>
        ))}
      </div>
      {showResult && (
        <div className={`result-indicator ${selectedAnswer === question.correct ? 'correct' : 'incorrect'}`}>
          {selectedAnswer === question.correct ? '✓ Correct!' : '✗ Incorrect'}
        </div>
      )}
    </div>
  )
}

export default QuestionCard
