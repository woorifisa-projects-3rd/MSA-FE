// 클라이언트 상태관리
'use client'
import { createContext, useContext, useState} from 'react'

const AuthContext = createContext() // context 생성 -> 전역 상태 관리

export function AuthProvider({ children }) {
  const [storeId, setStoreId]  = useState(null);

  const value = {  
    storeId,
    setStoreId,
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


//  AuthContext 사용하는 함수   -> 필요한 페이지 및 컴포넌트에서 호출하기
export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}