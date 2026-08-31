import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import BookingPage from './pages/BookingPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import RoomDetailPage from './pages/RoomDetailPage'
import RoomsPage from './pages/RoomsPage'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="rooms/:slug" element={<RoomDetailPage />} />
        <Route path="book" element={<BookingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
