import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/api.js'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      API.post('/auth/verify')
        .then(res => setIsAdmin(res.data.valid))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password })
    localStorage.setItem('adminToken', res.data.token)
    setIsAdmin(true)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
