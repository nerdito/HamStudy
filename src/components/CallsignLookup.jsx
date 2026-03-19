import { useState } from 'react'
import { Search, MapPin, User, Grid, Loader2, Calendar, Award } from 'lucide-react'
import { lookupCallsign } from '../utils/callsignLookup'
import './CallsignLookup.css'

function CallsignLookup() {
  const [callsign, setCallsign] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!callsign.trim()) return

    setLoading(true)
    setError(null)
    setResult(null)

    const lookupResult = await lookupCallsign(callsign)
    
    setLoading(false)
    
    if (lookupResult.success) {
      setResult(lookupResult)
    } else {
      setError(lookupResult.error || 'Callsign not found. Make sure you entered a valid callsign.')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const [month, day, year] = dateStr.split('/');
    return `${month}/${day}/${year}`;
  }

  return (
    <div className="callsign-lookup-section">
      <h2>Callsign Lookup</h2>
      <p className="callsign-description">
        Enter a ham radio callsign to find the country, flag, and other info.
      </p>
      
      <form onSubmit={handleSearch} className="callsign-form">
        <div className="callsign-input-group">
          <input
            type="text"
            value={callsign}
            onChange={(e) => setCallsign(e.target.value.toUpperCase())}
            placeholder="Enter callsign (e.g., KP4RD)"
            className="callsign-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="callsign-search-btn"
            disabled={loading || !callsign.trim()}
          >
            {loading ? <Loader2 className="spinner" size={20} /> : <Search size={20} />}
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="callsign-error">
          {error}
        </div>
      )}

      {result && (
        <div className="callsign-result">
          <div className="callsign-header">
            <span className="callsign-name">{result.callsign}</span>
          </div>
          
          <div className="callsign-details">
            {result.flagUrl && (
              <img 
                src={result.flagUrl} 
                alt={`${result.country} flag`} 
                className="callsign-flag"
              />
            )}
            
            <div className="callsign-info-row">
              <MapPin size={18} />
              <span>
                {result.country || 'Unknown'}
                {result.state && result.state !== 'PR' ? `, ${result.state}` : ''}
              </span>
            </div>
            
            {result.name && (
              <div className="callsign-info-row">
                <User size={18} />
                <span>{result.name}</span>
              </div>
            )}
            
            {result.grid && (
              <div className="callsign-info-row">
                <Grid size={18} />
                <span>{result.grid}</span>
              </div>
            )}
            
            {result.clss && (
              <div className="callsign-info-row">
                <Award size={18} />
                <span>Class: {result.clss}</span>
              </div>
            )}
            
            {result.expires && (
              <div className="callsign-info-row">
                <Calendar size={18} />
                <span>Expires: {formatDate(result.expires)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CallsignLookup
