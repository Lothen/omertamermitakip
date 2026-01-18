import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Admin from './Admin'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ana sayfa (Form) */}
        <Route path="/" element={<Home />} />
        
        {/* Admin sayfası (Liste) */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App