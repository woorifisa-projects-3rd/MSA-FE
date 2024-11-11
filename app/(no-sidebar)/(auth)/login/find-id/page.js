// app/find-id/page.js
'use client'

import styles from './findId.module.css'

export default function FindIdPage() {
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
                <h3>Email 찾기</h3>
                <form className={styles.findIdForm}>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="전화번호"/>
                        <button type="button" className={styles.verifyButton}>
                            인증번호 발송
                        </button>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="text" placeholder="인증번호"/>
                        <button type="button" className={styles.verifyButton}>
                            인증
                        </button>
                    </div>
                    <button type="submit" className={styles.findButton}>
                        Email 찾기
                    </button>
                </form>
                <div className={styles.links}>
                    <a href="find-pw">PW 찾기</a>
                </div>
            </div>
        </div>
    )
}