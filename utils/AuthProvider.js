// 클라이언트 상태관리
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext() // context 생성 -> 전역 상태 관리

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null)
 
  // 페이지 로드시 세션 체크
  useEffect(() => {
    loadSession()
  }, [])

  const loadSession = async () => {
    try {
      // Next.js API 라우트(/api/auth/session)로 GET 요청 -> aceessToken 있으면 aceessToken을 받음 
      const response = await fetch('/api/auth/session')
      const { accessToken } = await response.json()  // 서버에서 보낸 응답: { accessToken: "토큰값 또는 null" }

      // accessToken이 있으면 사용자 상태 업데이트 -> 세션 존재, 로그인 상태 유지
      if (accessToken) setAccessToken(accessToken)
    } catch (error) {
      console.error('세션 로드 실패:', error)
    } finally {
      // setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Spring Boot 서버에 로그인 요청 
      const response = await fetch('http://localhost:8888/user/president/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) throw new Error('Login failed')

      const { accessToken } = await response.json() // 서버로부터 받은 accessToken

      // httpOnly 쿠키에 저장 -> 저장은 항상 next server 이용
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      })

      setAccessToken(accessToken) // 사용자 토큰 update -> 세션 정보 유지
      return true
    } catch (error) {
      console.error('로그인 실패:', error)
      return false
    }
  }

  // 쿠키 삭제는 '/api/auth/session'으로 DELETE 요청 -> NEXT Server 이용
  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
      setAccessToken(null) // 사용자 token state도 null로 update
    } catch (error) {
      console.error('로그아웃 실패:', error)
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

  const value = { login, logout, fetchWithToken, accessToken }

  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


//  AuthContext 사용하는 함수   -> 필요한 페이지 및 컴포넌트에서 호출하기
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}