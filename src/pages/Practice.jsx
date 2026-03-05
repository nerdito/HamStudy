import { useState } from 'react'
import { Link } from 'react-router-dom'
import LicenseSelector from '../components/LicenseSelector'
import Exam from '../components/Exam'
import { questionPools } from '../data'
import { ArrowLeft } from 'lucide-react'
import './Practice.css'

const PRACTICE_QUESTION_COUNTS = {
  technician: 35,
  general: 35,
  extra: 50
}

const LICENSE_NAMES = {
  technician: 'Technician',
  general: 'General',
  extra: 'Extra'
}

function Practice() {
  const [selectedLicense, setSelectedLicense] = useState(null)

  const handleLicenseSelect = (licenseId) => {
    setSelectedLicense(licenseId)
  }

  const handleBack = () => {
    setSelectedLicense(null)
  }

  if (!selectedLicense) {
    return (
      <div className="page-container">
        <h1>Practice Exam</h1>
        <p className="page-description">
          Test your knowledge with a practice exam.
          Select a license class to begin.
        </p>
        <LicenseSelector 
          onSelect={handleLicenseSelect} 
          title="Select License Class for Practice"
        />
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    )
  }

  const questionCount = PRACTICE_QUESTION_COUNTS[selectedLicense]

  return (
    <div className="practice-container">
      <Exam
        questions={questionPools[selectedLicense]}
        questionCount={questionCount}
        mode="practice"
        license={selectedLicense}
        onBack={handleBack}
      />
    </div>
  )
}

export default Practice
