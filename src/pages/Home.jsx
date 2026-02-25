import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import './Home.css'

function Home() {
  return (
    <div className="home-container">
      <div className="title-container">
        <img src={logo} alt="Logo" className="home-logo" />
        <h1>Ham Radio Test Practice</h1>
      </div>
      <div className="button-container">
        <Link to="/study" className="home-button">Study</Link>
        <Link to="/practice" className="home-button">Practice Exam</Link>
        <Link to="/settings" className="home-button">Settings</Link>
      </div>
    </div>
  )
}

export default Home
