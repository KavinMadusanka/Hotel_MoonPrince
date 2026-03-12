import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import Signin from './pages/SigninSignupPages/Signin'
import './App.css'

function App() {

  return (
    <>
    <Toaster position="top-right" reverseOrder={false} />
    <div className='min-h-screen'>
      <Routes>
        <Route path='/Signin' element={<Signin />} />
      </Routes>
    </div>
    </>
  )
}

export default App
