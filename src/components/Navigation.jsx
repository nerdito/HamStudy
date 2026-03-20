import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, BookOpen, ClipboardList, Layers, Settings, TrendingUp, Radio } from 'lucide-react'
import './Navigation.css'

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: BookOpen },
  { path: '/study', label: 'Study', icon: BookOpen },
  { path: '/practice', label: 'Practice Exam', icon: ClipboardList },
  { path: '/flashcards', label: 'Flashcards', icon: Layers },
  { path: '/morse-code', label: 'Morse Code', icon: Radio },
  { path: '/stats', label: 'Statistics', icon: TrendingUp },
  { path: '/settings', label: 'Settings', icon: Settings }
]

function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false)
  }, [location])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <>
      <button 
        className="hamburger-button"
        onClick={toggleMenu}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="menu-overlay" onClick={closeMenu} />
      )}

      <nav className={`navigation-menu ${isOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>Menu</h2>
          <button className="close-button" onClick={closeMenu} aria-label="Close menu">
            <X size={24} />
          </button>
        </div>
        <ul className="nav-list">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}

export default Navigation
