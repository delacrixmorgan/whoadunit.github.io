import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import FindPage from './pages/FindPage.jsx'
import RepresentativePage from './pages/RepresentativePage.jsx'
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

// Redirects from old profile routes → new representative routes
function ProfileRedirect() {
  const params = useParams()
  const year = params.year || '2022'
  if (params.stateSeatCode) {
    return <Navigate to={`/representative/${year}/${params.federalSeatCode}/${params.stateSeatCode}`} replace />
  }
  const fed = params.federalSeatCode || params.seatCode
  return <Navigate to={fed ? `/representative/${year}/${fed}` : '/find'} replace />
}

// Redirect old /seat/:code → /representative/2022/:code
function SeatRedirect() {
  const { federalSeatCode } = useParams()
  return <Navigate to={`/representative/2022/${federalSeatCode}`} replace />
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="find" element={<FindPage />} />
          <Route path="representative/:year/:federalSeatCode" element={<RepresentativePage />} />
          <Route path="representative/:year/:federalSeatCode/:stateSeatCode" element={<RepresentativePage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="methodology" element={<MethodologyPage />} />
          <Route path="volunteer" element={<VolunteerPage />} />

          {/* Legacy redirects */}
          <Route path="directory" element={<Navigate to="/find" replace />} />
          <Route path="statistics" element={<Navigate to="/" replace />} />
          <Route path="about" element={<Navigate to="/learn" replace />} />
          <Route path="data-methodology" element={<Navigate to="/methodology" replace />} />
          <Route path="seat/:federalSeatCode" element={<SeatRedirect />} />
          <Route path="profile/:year/:seatCode" element={<ProfileRedirect />} />
          <Route path="profile/:year/:federalSeatCode/:stateSeatCode" element={<ProfileRedirect />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
