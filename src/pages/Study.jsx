import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import LicenseSelector from '../components/LicenseSelector'
import Exam from '../components/Exam'
import { questionPools } from '../data'
import { useSettings } from '../context/SettingsContext'
import { getCategories, getCategoryLabel, filterQuestionsByCategory } from '../utils/categories'
import { ArrowLeft } from 'lucide-react'
import './Study.css'

function Study() {
  const [selectedLicense, setSelectedLicense] = useState(null)
  const [selectedCategories, setSelectedCategories] = useState([])
  const { settings } = useSettings()

  const handleLicenseSelect = (licenseId) => {
    setSelectedLicense(licenseId)
    setSelectedCategories([])
  }

  const handleBack = () => {
    setSelectedLicense(null)
    setSelectedCategories([])
  }

  const questionCount = selectedLicense ? settings.studyQuestions[selectedLicense] : 0

  const availableCategories = useMemo(() => {
    if (!selectedLicense) return []
    return getCategories(questionPools[selectedLicense])
  }, [selectedLicense])

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleClearCategories = () => {
    setSelectedCategories([])
  }

  const filteredQuestions = useMemo(() => {
    if (!selectedLicense) return []
    return filterQuestionsByCategory(questionPools[selectedLicense], selectedCategories)
  }, [selectedLicense, selectedCategories])

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
        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="study-container">
      <div className="category-filter">
        <div className="category-header">
          <span>Filter by Category:</span>
          {selectedCategories.length > 0 && (
            <button className="clear-filter-btn" onClick={handleClearCategories}>
              Clear All
            </button>
          )}
        </div>
        <div className="category-chips">
          {availableCategories.map(category => (
            <button
              key={category}
              className={`category-chip ${selectedCategories.includes(category) ? 'selected' : ''}`}
              onClick={() => handleCategoryToggle(category)}
            >
              {category}: {getCategoryLabel(category)}
            </button>
          ))}
        </div>
        {selectedCategories.length > 0 && (
          <div className="filter-info">
            Showing {filteredQuestions.length} of {questionPools[selectedLicense].length} questions
          </div>
        )}
      </div>
      <Exam
        questions={filteredQuestions}
        questionCount={Math.min(questionCount, filteredQuestions.length)}
        mode="study"
        license={selectedLicense}
        onBack={handleBack}
      />
    </div>
  )
}

export default Study
