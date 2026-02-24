import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Study from './pages/Study'
import Practice from './pages/Practice'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/study" element={<Study />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App
