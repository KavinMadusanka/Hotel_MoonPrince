import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'

import Signin from './pages/SigninSignupPages/Signin'
import Signup from './pages/SigninSignupPages/Signup'
import Home from './pages/HomePages/Home'
import Announcements from './pages/GuestEngagement/guest/Announcements'
import ForgetPassword from './pages/SigninSignupPages/ForgetPassword'
import EmailVerification from './pages/SigninSignupPages/EmailVerification'
import ResetPassword from './pages/SigninSignupPages/ResetPassword'
import ManageRoomTypes from './pages/RoomInventory/admin/ManageRoomTypes'
import AddRoomTypesPage from './pages/RoomInventory/admin/AddRoomTypesPage'
import ManageRoomsPage from './pages/RoomInventory/admin/ManageRoomsPage'
import AddRoomPage from './pages/RoomInventory/admin/AddRoomPage'
import GuestRoomsPage from './pages/RoomInventory/guest/GuestRoomsPage'
import RoomDetailsPage from './pages/RoomInventory/guest/RoomDetailsPage'


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

          {/* Route path for room inventory */}
          <Route path="/add-room-types" element={<AddRoomTypesPage />} />
          <Route path="/manage-room-types" element={<ManageRoomTypes />} />
          <Route path="/add-room" element={<AddRoomPage />} />
          <Route path="/manage-rooms" element={<ManageRoomsPage />} />
          <Route path="/guest-rooms" element={<GuestRoomsPage />} />
          <Route path="/guest-rooms/:id" element={<RoomDetailsPage />} />

          {/* Route path for guest engagement */}
          <Route path="/announcements" element={<Announcements />} />
        </Routes>
      </div>
    </>
  )
}

export default App
