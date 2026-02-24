import { useState } from 'react'
import { Link } from 'react-router-dom'
import LicenseSelector from '../components/LicenseSelector'
import Exam from '../components/Exam'
import { questionPools } from '../data'
import { useSettings } from '../context/SettingsContext'
import './Study.css'

function Study() {
  const [selectedLicense, setSelectedLicense] = useState(null)
  const { settings } = useSettings()

  const handleLicenseSelect = (licenseId) => {
    setSelectedLicense(licenseId)
  }

  const handleBack = () => {
    setSelectedLicense(null)
  }

  const questionCount = selectedLicense ? settings.studyQuestions[selectedLicense] : 0

  if (!selectedLicense) {
    return (
      <div className="page-container">
        <h1>Study Mode</h1>
        <p className="page-description">
          Learn and review questions with instant feedback. 
          Select a license class to begin your study session.
        </p>
        <LicenseSelector 
          onSelect={handleLicenseSelect} 
          title="Select License Class for Study"
        />
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    )
  }

  return (
    <div className="study-container">
      <Exam
        questions={questionPools[selectedLicense]}
        questionCount={questionCount}
        mode="study"
        onBack={handleBack}
      />
    </div>
  )
}

export default Study
