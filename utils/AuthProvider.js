// lib/AuthProvider.js
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const { accessToken } = await response.json()
      if (accessToken) setAccessToken(accessToken)
    } catch (error) {
      console.error('세션 로드 실패:', error)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8888/user/president/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const { accessToken: token } = await response.json()
      setAccessToken(token)

      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token }),
      })

      return true
    } catch (error) {
      console.error('로그인 실패:', error)
      return false
    }
  }

  const fetchWithToken = async () => {
    if (!accessToken) throw new Error('인증 토큰이 없습니다.')

    try {
      const response = await fetch('http://localhost:8888/user/president/modify', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ 
          phoneNumber: '010-7101-8175',
          birthDate: '2000-03-04' 
        }),
      })
    
      return response.ok
    } catch (error) {
      console.error('요청 실패:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      setAccessToken(null)
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  const value = { login, logout, fetchWithToken, accessToken }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}