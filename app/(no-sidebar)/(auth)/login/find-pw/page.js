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
        console.log("클라까지 다시온다data",response.data);
        console.log("클라까지 다시온다success",response.data.success);
        
        if(response.data.success === true){
            alert('임시 비밀번호가 이메일로 전송되었습니다.');
        }
        } catch (error) {
        console.error('임시 비밀번호 발송 실패:', error);
        alert('임시 비밀번호 발송 중 오류가 발생했습니다.');
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