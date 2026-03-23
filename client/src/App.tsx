import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AdsList from './pages/AdsList/AdsList'
import AdView from './pages/AdView/AdView'
import AdEdit from './pages/AdEdit/AdEdit'

export default function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const theme = savedTheme === 'dark' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/ads" replace />} />
        <Route path="/ads" element={<AdsList />} />
        <Route path="/ads/:id" element={<AdView />} />
        <Route path="/ads/:id/edit" element={<AdEdit />} />
      </Routes>
    </BrowserRouter>
  )
}
