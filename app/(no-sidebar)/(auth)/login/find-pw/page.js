// app/find-password/page.tsx
'use client'

import styles from './findPassword.module.css'

export default function FindPasswordPage() {
    return (
        <div className={styles.container}>
            <div className={styles.leftSection}>
                <h1>Need webdesign for your business?</h1>
                <h2>Design Spacee will help you.</h2>
                <div className={styles.logo}>
                    <span>S</span>
                </div>
            </div>

            <div className={styles.rightSection}>
                <h3>PW 찾기</h3>
                <form className={styles.findPwForm}>
                    <div className={styles.inputGroup}>
                        <input type="email" placeholder="Email" />
                        <button type="button" className={styles.verifyButton}>
                            인증번호 발송
                        </button>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="인증번호" />
                        <button type="button" className={styles.verifyButton}>
                            인증
                        </button>
                    </div>
                    <button type="submit" className={styles.findButton}>
                        PW 찾기
                    </button>
                </form>
            </div>
        </div>
    )
}