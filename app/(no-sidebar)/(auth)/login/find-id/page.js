// app/find-id/page.tsx
'use client'

import BaseButton from '@/components/button/base-button';
import styles from './findId.module.css';
import { nextClient } from '@/lib/nextClient';
import Image from 'next/image';

export default function FindIdPage() {

    // 이메일 가공 함수
    function maskEmail(email) {
        const [localPart, domain] = email.split('@'); // @ 기준으로 분리
        const visiblePart = localPart.slice(0, -4); // 앞부분에서 마지막 4자리를 제외한 부분
        const maskedLocalPart = visiblePart + '****'; // 4자리를 별표로 대체
        return `${maskedLocalPart}@${domain}`;
    }

    // ID 찾기 버튼 핸들러
    const handleForwardingId = async () => {
        try {
            const name = document.getElementById('name').value; // 이름 입력값
            const phone_number = document.getElementById('phone_number').value; // 휴대폰 번호 입력값
            
            const requestData = { name, phone_number };
            const response = await nextClient.post('/president/forwardingid', requestData);

            console.log("response 전체:", response);
            console.log("response.data:", response.data);


            if (response.data) {
                const email = maskEmail(response.data.email);
                alert(`고객님께서 등록하신 이메일은 ${email} 입니다.`);
                window.location.href = '/login'; // 리다이렉트
            }
        } catch (error) {
            console.log(error.response.data);
            
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
                            alt="아이디 찾기 안내"
                            width={500}
                            height={350}
                            className={styles.illustration}
                            unoptimized={true}
                        />
                        <h2 className={styles.guideTitle}>
                            아이디가 기억나지 않으세요?
                        </h2>
                        <p className={styles.guideText}>
                            집계사장의 아이디는 이메일 형식입니다.<br />
                            가입 시 등록한 정보로 찾으실 수 있어요.
                        </p>
                        <div className={styles.stepsBox}>
                            <p className={styles.stepText}>
                                <span className={styles.stepNumber}>Step 1.</span>
                                이름과 휴대폰 번호를 입력해주세요
                            </p>
                            <p className={styles.stepText}>
                                <span className={styles.stepNumber}>Step 2.</span>
                                입력하신 정보와 일치하는 
                                <span className={styles.emphasis}> 이메일 형식의 아이디</span>를<br />알려드립니다
                            </p>
                        </div>
                    </div>
                </div>

                <div className={styles.rightSection}>
                    <h3 className={styles.rightTitle}>ID 찾기</h3>
                    <form 
                        className={styles.findIdForm} 
                        onSubmit={(e) => {
                            e.preventDefault(); // 폼의 기본 제출 동작 방지
                            handleForwardingId(); // ID 찾기 함수 호출
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
                                type="tel" 
                                id="phone_number" 
                                placeholder="휴대폰 번호 (-없이 입력)" 
                                required 
                            />
                        </div>
                        <BaseButton
                            type="submit" 
                            text="ID 찾기"
                            padding="1rem"
                            width="100%"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
