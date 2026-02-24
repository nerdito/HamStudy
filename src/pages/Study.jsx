import { Link } from 'react-router-dom'
import './Study.css'

function Study() {
  return (
    <div className="page-container">
      <h1>Study Mode</h1>
      <p>Learn and review ham radio exam questions.</p>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Study
