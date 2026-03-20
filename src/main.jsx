import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { StreakProvider } from './context/StreakContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <SettingsProvider>
        <StreakProvider>
          <App />
        </StreakProvider>
      </SettingsProvider>
    </HashRouter>
  </StrictMode>,
)
