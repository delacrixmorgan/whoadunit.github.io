import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DirectoryPage from './pages/DirectoryPage'
import StatisticsPage from './pages/StatisticsPage'
import ProfilePage from './pages/ProfilePage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="directory" element={<DirectoryPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="profile/:seatCode" element={<ProfilePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
