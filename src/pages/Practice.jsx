import { Link } from 'react-router-dom'
import './Practice.css'

function Practice() {
  return (
    <div className="page-container">
      <h1>Practice Exam</h1>
      <p>Take a practice exam to test your knowledge.</p>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Practice
