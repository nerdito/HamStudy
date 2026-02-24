import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <h1>Ham Radio Test Practice</h1>
      <div className="button-container">
        <Link to="/study" className="home-button">Study</Link>
        <Link to="/practice" className="home-button">Practice Exam</Link>
        <Link to="/settings" className="home-button">Settings</Link>
      </div>
    </div>
  )
}

export default Home
