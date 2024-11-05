// app/login/page.tsx
'use client'

import styles from './login.module.css'

export default function LoginPage() {
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
                <form className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="ID" />
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="password" placeholder="Password" />
                    </div>
                    <button type="submit" className={styles.loginButton}>
                        로그인
                    </button>
                </form>
                <div className={styles.links}>
                    <a href="login/find-id">ID/PW 찾기</a>
                    <a href="signup">회원이 아니신가요?</a>
                </div>
            </div>
        </div>
    )
}