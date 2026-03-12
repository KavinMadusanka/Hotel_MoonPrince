import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import './App.css'

import Signin from './pages/SigninSignupPages/Signin'
import Signup from './pages/SigninSignupPages/Signup'


function App() {

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <div className='min-h-screen'>
      <Routes>
        <Route path='/Signin' element={<Signin />} />
        <Route path='/Signup' element={<Signup />} />
      </Routes>
    </div>
    </>
  )
}

export default App
