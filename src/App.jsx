import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useSettings } from './context/SettingsContext'
import Navigation from './components/Navigation'

const Home = lazy(() => import('./pages/Home'))
const Study = lazy(() => import('./pages/Study'))
const Practice = lazy(() => import('./pages/Practice'))
const Settings = lazy(() => import('./pages/Settings'))
const Stats = lazy(() => import('./pages/Stats'))
const FlashcardsPage = lazy(() => import('./pages/FlashcardsPage'))
const MorseCode = lazy(() => import('./pages/MorseCode'))

function LoadingSpinner() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      color: 'var(--text-secondary)'
    }}>
      Loading...
    </div>
  )
}

function App() {
  const { settings, FONT_SIZES } = useSettings()
  const fontSize = FONT_SIZES[settings.fontSize] || '16px'

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      settings.colorScheme
    )
  }, [settings.colorScheme])

  return (
    <div style={{ fontSize }}>
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/morse-code" element={<MorseCode />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
