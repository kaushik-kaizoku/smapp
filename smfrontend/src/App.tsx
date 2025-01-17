import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import AdminLogin from './dashboard/AdminLogin'
import AdminDashboard from './dashboard/AdminDashboard'
import UserSubmission from './dashboard/UserSubmission'

function App() {

  return (
    <>
       <BrowserRouter>
          <Routes>
            <Route path='/' element={<UserSubmission />}/>
            <Route path='/login' element={<AdminLogin />}/>
            <Route path='/dashboard' element={<AdminDashboard />}/>
          </Routes>
       </BrowserRouter> 
    </>
  )
}

export default App
