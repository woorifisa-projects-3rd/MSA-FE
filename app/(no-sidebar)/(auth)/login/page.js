'use client'

import { useAuth } from '@/lib/AuthProvider'
import styles from './login.module.css'

export default function LoginPage() {

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
                        <input type="text" name="email" placeholder="ID" />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="password" name="password" placeholder="Password" />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        로그인
                    </button>
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