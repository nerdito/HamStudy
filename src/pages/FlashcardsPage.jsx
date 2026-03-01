import { useState } from 'react'
import { Link } from 'react-router-dom'
import Flashcards from '../components/Flashcards'
import { useSettings } from '../context/SettingsContext'
import './FlashcardsPage.css'

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

const LICENSE_FILES = {
  technician: () => import('../data/technician.json'),
  general: () => import('../data/general.json'),
  extra: () => import('../data/extra.json')
}

function FlashcardsPage() {
  const { settings } = useSettings()
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [questions, setQuestions] = useState(null)

  const handleLicenseSelect = async (license) => {
    try {
      const module = await LICENSE_FILES[license]()
      const allQuestions = module.default || module
      const selected = allQuestions.slice(0, settings.studyQuestions[license])
      setQuestions(selected)
      setSelectedLicense(license)
    } catch (error) {
      console.error('Failed to load questions:', error)
    }
  }

  if (questions) {
    return (
      <Flashcards 
        questions={questions} 
        license={selectedLicense}
        onBack={() => {
          setQuestions(null)
          setSelectedLicense(null)
        }}
      />
    )
  }

  return (
    <div className="flashcards-page-container">
      <div className="flashcards-header">
        <Link to="/" className="back-link">← Back</Link>
        <h1>Flashcards</h1>
      </div>

      <p className="flashcards-intro">
        Select a license class to start reviewing with flashcards.
        Click or press Space to flip the card.
      </p>

      <div className="license-cards">
        {Object.entries(LICENSE_NAMES).map(([key, name]) => (
          <button 
            key={key}
            className="license-card"
            onClick={() => handleLicenseSelect(key)}
          >
            <h2>{name}</h2>
            <p>{settings.studyQuestions[key]} questions</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default FlashcardsPage
