import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AboutPage from './pages/AboutPage'
import AccommodationPage from './pages/AccommodationPage'
import AccountPage from './pages/AccountPage'
import BookingDetailPage from './pages/BookingDetailPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import CreateAccountPage from './pages/CreateAccountPage'
import EventsPage from './pages/EventsPage'
import ExperiencesPage from './pages/ExperiencesPage'
import GalleryPage from './pages/GalleryPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ReservationsDeskPage from './pages/ReservationsDeskPage'
import RoomDetailPage from './pages/RoomDetailPage'
import SignInPage from './pages/SignInPage'
import VerifyEmailPage from './pages/VerifyEmailPage'

/** /rooms/:slug was the scaffold's URL; keep old links working. */
function LegacyRoomRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/accommodation/${slug}`} replace />
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* the resort */}
        <Route path="about" element={<AboutPage />} />
        <Route path="accommodation" element={<AccommodationPage />} />
        <Route path="accommodation/:slug" element={<RoomDetailPage />} />
        <Route path="experiences" element={<ExperiencesPage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />

        {/* booking */}
        <Route path="book" element={<BookingPage />} />

        {/* accounts */}
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="create-account" element={<CreateAccountPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />

        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="account/bookings/:reference"
          element={
            <ProtectedRoute>
              <BookingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="reservations-desk"
          element={
            <ProtectedRoute requireAdmin>
              <ReservationsDeskPage />
            </ProtectedRoute>
          }
        />

        {/* superseded paths */}
        <Route path="rooms" element={<Navigate to="/accommodation" replace />} />
        <Route path="rooms/:slug" element={<LegacyRoomRedirect />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
