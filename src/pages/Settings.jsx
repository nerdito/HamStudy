import { Link } from 'react-router-dom'
import './Settings.css'

function Settings() {
  return (
    <div className="page-container">
      <h1>Settings</h1>
      <p>Configure your application preferences.</p>
      <Link to="/" className="back-button">Back to Home</Link>
    </div>
  )
}

export default Settings
