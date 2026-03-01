import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Study from './pages/Study'
import Practice from './pages/Practice'
import Settings from './pages/Settings'
import Stats from './pages/Stats'
import { useSettings } from './context/SettingsContext'
import { useEffect } from 'react'

function App() {
  const { settings, FONT_SIZES } = useSettings()
  const fontSize = FONT_SIZES[settings.fontSize] || '16px'

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      settings.darkMode ? 'dark' : 'light'
    )
  }, [settings.darkMode])

  return (
    <div style={{ fontSize }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<Study />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  )
}

export default App
