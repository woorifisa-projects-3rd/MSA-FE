'use client'

import { useAuth } from '@/utils/AuthProvider'
import BaseButton from '@/components/button/base-button';
import styles from './login.module.css'
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // 에러 메시지를 위한 상태 추가

    const { login, fetchWithToken } = useAuth()
 
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
        const formData = new FormData(e.target)
        
        if (await login(formData.get('email'), formData.get('password'))) {
         console.log("로그인 성공")
         // router.push('/dashboard') // 로그인 성공 후 리다이렉트하고 싶다면 주석 해제
        } else {
            alert('로그인 실패')
        }
    }

   
 
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try{
//             await authApi.login(email, password);
//             // 로그인 성공 시 리다이렉트 (예: 대시보드)
//            window.location.href = '/dashboard';  // 또는 원하는 페이
//         } catch(error){
//             console.error('로그인 실패:', error);
//         }
//     }
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
                            placeholder="ID" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    <BaseButton 
                        text="로그인"
                        type="submit"
                    />
                </form>
                <div className={styles.links}>
                    <a href="login/find-id">ID/PW 찾기</a>
                    <a href="signup">회원이 아니신가요?</a>
                </div>
                <button type="button" onClick={getData}>버튼</button>
            </div>
        </div>
    )
}