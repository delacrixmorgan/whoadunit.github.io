import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import FindPage from './pages/FindPage.jsx'
import SeatPage from './pages/SeatPage.jsx'
import LearnPage from './pages/LearnPage.jsx'
import MethodologyPage from './pages/MethodologyPage.jsx'
import VolunteerPage from './pages/VolunteerPage.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

// Redirects from old profile routes — drop the year, keep the federal seat
function ProfileRedirect() {
  const params = useParams()
  // Match either /profile/:year/:seatCode or /profile/:year/:fed/:state
  const target = params.federalSeatCode || params.seatCode
  return <Navigate to={target ? `/seat/${target}` : '/find'} replace />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="find" element={<FindPage />} />
          <Route path="seat/:federalSeatCode" element={<SeatPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="volunteer" element={<VolunteerPage />} />

          {/* Legacy redirects */}
          <Route path="directory" element={<Navigate to="/find" replace />} />
          <Route path="statistics" element={<Navigate to="/" replace />} />
          <Route path="about" element={<Navigate to="/learn" replace />} />
          <Route path="data-methodology" element={<Navigate to="/methodology" replace />} />
          <Route path="profile/:year/:seatCode" element={<ProfileRedirect />} />
          <Route path="profile/:year/:federalSeatCode/:stateSeatCode" element={<ProfileRedirect />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
