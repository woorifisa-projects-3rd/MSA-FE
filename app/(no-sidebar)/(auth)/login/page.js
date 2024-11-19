'use client'

import { useAuth } from '@/utils/AuthProvider'
import BaseButton from '@/components/button/base-button';
import styles from './login.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation' 

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('')
    const [error, setError] = useState('')  
    const [isLoading, setIsLoading] = useState(false) 

    const router = useRouter()
    const { login, fetchWithToken } = useAuth()

    const validateEmail = (email) => {
        if (!email.includes('@')) {
            setEmailError('유효한 이메일을 입력하세요')
            return false
        } else {
            setEmailError('')
            return true
        }
    }
 
    const getData = async () => {
     try {
       const data = await fetchWithToken()
       console.log(data)
     } catch (error) {
       console.error('데이터 가져오기 실패:', error)
     }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')  // 이전 에러 메시지 초기화

        if (!validateEmail(email)) {
            return  // 유효하지 않은 이메일이면 여기서 중단
        }

        setIsLoading(true)
        
        try {
            const success = await login(email, password)
            
            if (success) {
                console.log("로그인 성공")
                router.push('/mypage')
            } else {
                setError('이메일 또는 비밀번호가 올바르지 않습니다.')
            }
        } catch (error) {
            console.error('로그인 중 오류 발생:', error)
            setError('로그인 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.')
        } finally {
            setIsLoading(false)  // 로딩 종료
        }
    }

   

    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <h1>Need webdesign for your business?</h1>
                <h2>Design Spacee will help you.</h2>
                <div className={styles.logo}>
                    <span>DS</span>
                </div>
            </div>

            <div className={styles.rightSection}>
                <h3>로그인</h3>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                validateEmail(e.target.value)
                            }}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {emailError && <div className={styles.errorMessage}>{emailError}</div>}
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    <BaseButton
                       text={isLoading ? "로그인 중..." : "로그인"}
                       type="submit"
                       disabled={isLoading || !!emailError}  // 로딩 중이거나 이메일 에러가 있으면 버튼 비활성화
                   />
                </form>
                <div className={styles.links}>
                    <a href="/login/find-id">ID/PW 찾기</a>
                    <a href="/signup">회원이 아니신가요?</a>
                </div>
                <BaseButton 
                    text='버튼'
                    type='button'
                    onClick={getData}
                    disabled={isLoading}
               />
            </div>
        </div>
    )
}