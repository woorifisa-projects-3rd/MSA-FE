// app/find-password/page.tsx
'use client'

import BaseButton from '@/components/button/base-button';
import styles from './findPassword.module.css'
import { nextClient } from '@/lib/nextClient'
import Image from 'next/image';

export default function FindPasswordPage() {

    // 임시 비밀번호 발송 버튼 핸들러
    const handleForwardingPassword = async () => {
        try {
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
    
            const requestData = { email, name };
            const response = await nextClient.post('/president/forwardingpassword', requestData);
    
            console.log("response 전체:", response);
            console.log("response.data:", response.data);
    
            if (response.data) {
                alert(response.data.message);
                window.location.href = '/login'; // 리다이렉트
            }
        } catch (error) {
    
            const errorMessage = error.response?.data?.message || "서버와의 연결에 문제가 발생했습니다.";
            alert(errorMessage);
        }
    };
  

    return (
        <div className={styles.container}>

            <div className={styles.backgroundWrapper}>
                <div className={styles.leftBackground}></div>
                <div className={styles.rightBackground}></div>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.leftSection}>
                    <div className={styles.guideContent}>
                        <Image
                            src="/images/dashboard.png"
                            alt="비밀번호 찾기 안내"
                            width={500}
                            height={350}
                            className={styles.illustration}
                            unoptimized={true}
                        />
                        <h2 className={styles.guideTitle}>
                            비밀번호가 기억나지 않으세요? 
                        </h2>
                        <p className={styles.guideText}>
                            가입하신 이메일로 임시 비밀번호를 보내드립니다.<br />
                            로그인 후 반드시 비밀번호를 변경해 주세요.
                        </p>
                        <div className={styles.stepsBox}>
                            <p className={styles.stepText}>
                                <span className={styles.stepNumber}>Step 1.</span> 
                                가입하신 이메일과 이름을 입력해주세요
                            </p>
                            <p className={styles.stepText}>
                                <span className={styles.stepNumber}>Step 2.</span> 
                                이메일로 발송된 임시 비밀번호로 로그인하세요
                            </p>
                            <p className={styles.stepText}>
                                <span className={styles.stepNumber}>Step 3.</span> 
                                로그인 후 새로운 비밀번호로 변경해주세요
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <h3 className={styles.rightTitle} >PW 찾기</h3>
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
                        <BaseButton
                            type="submit" 
                            text="임시 비밀번호 발송"
                             padding="1rem"
                             width="100%"
                        />
                    </form>
                </div>
            </div>


        </div>
    )
}