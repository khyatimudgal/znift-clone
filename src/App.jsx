import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Archive from './pages/Archive'
import Summary from './pages/Summary'
import Profile from './pages/Profile'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path ="/" element={<PublicRoute><Landing/></PublicRoute>} />
      <Route path ="/landing" element={<Landing/>} />
      <Route path ="/login" element={<PublicRoute><Login/></PublicRoute>} />
      <Route path ="/register" element={<PublicRoute><Register/></PublicRoute>} />
      <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
} />
      <Route path="/tasks" element={
      <ProtectedRoute>
        <Tasks />
      </ProtectedRoute>
} />
      <Route path="/archive" element={
      <ProtectedRoute>
        <Archive />
      </ProtectedRoute>
} />
      <Route path="/summary" element={
      <ProtectedRoute>
        <Summary />
      </ProtectedRoute>
} />
      <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}

export default App