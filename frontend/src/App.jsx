import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Portfolio from './pages/Portfolio.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import WakeUpBanner from './components/WakeUpBanner.jsx'
import './App.css'

function PrivateRoute({ children }) {
  const { isAdmin, loading } = useAuth()
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>
  return isAdmin ? children : <Navigate to="/admin/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <WakeUpBanner />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
