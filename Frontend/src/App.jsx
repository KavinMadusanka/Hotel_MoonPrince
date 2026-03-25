import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'

import Signin from './pages/SigninSignupPages/Signin'
import Signup from './pages/SigninSignupPages/Signup'
import Home from './pages/HomePages/Home'
import Announcements from './pages/GuestEngagement/guest/Announcements'
import AddAnnouncements from './pages/GuestEngagement/admin/AddAnnouncement'
import AllAnnouncements from './pages/GuestEngagement/admin/AllAnnouncements'
import EditAnnouncement from './pages/GuestEngagement/admin/EditAnnouncement'
import GiveReviewPage from './pages/GuestEngagement/guest/GiveReviewPage'
import MyReviewsPage from './pages/GuestEngagement/guest/MyReviewsPage'
import ManageRoomTypeReviews from './pages/GuestEngagement/admin/ManageRoomTypeReviews'
import ForgetPassword from './pages/SigninSignupPages/ForgetPassword'
import EmailVerification from './pages/SigninSignupPages/EmailVerification'
import ResetPassword from './pages/SigninSignupPages/ResetPassword'
import ManageRoomTypes from './pages/RoomInventory/admin/ManageRoomTypes'
import AddRoomTypesPage from './pages/RoomInventory/admin/AddRoomTypesPage'
import ManageRoomsPage from './pages/RoomInventory/admin/ManageRoomsPage'
import AddRoomPage from './pages/RoomInventory/admin/AddRoomPage'
import GuestRoomsPage from './pages/RoomInventory/guest/GuestRoomsPage'
import RoomDetailsPage from './pages/RoomInventory/guest/RoomDetailsPage'
import ManageHoldsPage from "./pages/RoomInventory/admin/ManageHoldsPage";
import AvailabilityPage from "./pages/RoomInventory/receptionist/AvailabilityPage";
import BillingPage from './pages/PaymentPages/ReceptionistPages/BillingPage';
import PaymentPage from './pages/PaymentPages/GuestPages/PaymentPage';
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";
import ManageRoomStatus from './pages/RoomInventory/admin/ManageRoomStatus'
import BookReservationPage from './pages/Reservations/BookReservationPage'
import MyReservationsPage from './pages/Reservations/MyReservationsPage'
import AdminReservationsPage from './pages/Reservations/AdminReservationsPage'


function App() {

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className='min-h-screen'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Signin' element={<Signin />} />
          <Route path='/Signup' element={<Signup />} />
          <Route path='/Home' element={<Home />} />
          <Route path='/forget-password' element={<ForgetPassword />} />
          <Route path='/email-verification' element={<EmailVerification />} />
          <Route path='/reset-password' element={<ResetPassword />} />

          <Route path="/guest-rooms" element={<GuestRoomsPage />} />
          <Route path="/guest-rooms/:id" element={<RoomDetailsPage />} />
          <Route path="/availability" element={<AvailabilityPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/add-room-types" element={<AddRoomTypesPage />} />
            <Route path="/manage-room-types" element={<ManageRoomTypes />} />
            <Route path="/add-room" element={<AddRoomPage />} />
            <Route path="/manage-rooms" element={<ManageRoomsPage />} />
            <Route path="/manage-holds" element={<ManageHoldsPage />} />
            <Route path="/room-status" element={<ManageRoomStatus />} />
          </Route>

          {/* Route path for guest engagement */}
          {/* guest */}
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/give-review/:bookingid" element={<GiveReviewPage />} />
          <Route path="/my-reviews" element={<MyReviewsPage />} />
          {/* admin */}
          <Route path="/add-announcement" element={<AddAnnouncements />} />
          <Route path="/all-announcements" element={<AllAnnouncements />} />
          <Route path="/edit-announcement/:id" element={<EditAnnouncement />} />
          <Route path="/manage-room-type-reviews" element={<ManageRoomTypeReviews />} />

          {/* Routes for payments */}
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/view-bill" element={<PaymentPage />} />
          <Route path="/book-reservation/:id" element={<BookReservationPage />} />
          <Route path="/my-reservations" element={<MyReservationsPage />} />
          <Route path="/reservations" element={<AdminReservationsPage />} />
          
        </Routes>
      </div>
    </>
  )
}

export default App