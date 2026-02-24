import './LicenseSelector.css'

const LICENSE_TYPES = [
  { id: 'technician', name: 'Technician', description: 'Entry-level license' },
  { id: 'general', name: 'General', description: 'Intermediate license' },
  { id: 'extra', name: 'Extra', description: 'Advanced license' },
]

function LicenseSelector({ onSelect, title }) {
  return (
    <div className="license-selector">
      <h2>{title || 'Select License Class'}</h2>
      <div className="license-buttons">
        {LICENSE_TYPES.map((license) => (
          <button
            key={license.id}
            className="license-button"
            onClick={() => onSelect(license.id)}
          >
            <span className="license-name">{license.name}</span>
            <span className="license-description">{license.description}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LicenseSelector
