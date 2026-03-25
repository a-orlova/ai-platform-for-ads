import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import AdsList from './pages/AdsList/AdsList'
import AdView from './pages/AdView/AdView'
import AdEdit from './pages/AdEdit/AdEdit'

export default function App() {
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
