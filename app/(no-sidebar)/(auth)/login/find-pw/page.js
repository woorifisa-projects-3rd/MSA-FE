// app/find-password/page.tsx
'use client'

import styles from './findPassword.module.css'
import { nextClient } from '@/lib/nextClient'

export default function FindPasswordPage() {

    // 임시 비밀번호 발송 버튼 핸들러
    const handleForwardingPassword = async () => {
        try {
        // 사용자 입력값 가져오기 (email과 name은 폼 데이터에서 가져옴)
        const email = document.getElementById('email').value; // 혹은 state로 관리된 값
        const name = document.getElementById('name').value;   // 혹은 state로 관리된 값
    
        // 요청 데이터 구성
        const requestData = {
            email: email,
            name: name
        };
    
        // API 요청 보내기
        const response = await nextClient.post('/president/forwardingpassword', requestData);
    
        // 요청 성공 시 사용자 알림
        alert(response.data || '임시 비밀번호가 이메일로 전송되었습니다.');
        } catch (error) {
        console.error('임시 비밀번호 발송 실패:', error);
        alert(error.response?.data || '임시 비밀번호 발송 중 오류가 발생했습니다.');
        }
    };
  

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
                <form 
                    className={styles.findPwForm} 
                    onSubmit={(e) => {
                        e.preventDefault(); // 폼의 기본 제출 동작 방지
                        handleForwardingPassword(); // 임시 비밀번호 발송 함수 호출
                    }}
                >
                    <div className={styles.inputGroup}>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="이름" 
                            required 
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="email" 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={styles.findButton}
                    >
                        임시 비밀번호 발송
                    </button>
                </form>
            </div>

        </div>
    )
}