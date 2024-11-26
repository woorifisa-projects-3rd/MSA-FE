// 클라이언트 상태관리
'use client'
import { createContext, useContext} from 'react'

const AuthContext = createContext() // context 생성 -> 전역 상태 관리

export function AuthProvider({ children }) {

  // 나중에 필요하면 context 쓰겠음 현재는 필요없는 것 같음! 
  // 필요한 함수 만들어서 value에 담아서 보내면 됨~
  const value = {  }

  
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