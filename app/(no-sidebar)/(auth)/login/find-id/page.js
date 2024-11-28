// app/find-id/page.js
'use client'

import { useState } from 'react'
import styles from './findId.module.css'
import BaseButton from '@/components/button/base-button';
import Image from 'next/image';

export default function FindIdPage() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    // const handleFindId = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const response = await authApi.findId(name, phoneNumber);
    //         setResult(`이메일을 찾았습니다. ${response.email}`);
    //         setError('');
    //     } catch (error) {
    //         console.error('Email 찾기 실패:', error);
    //         setError('일치하는 정보를 찾을 수 없습니다.');
    //         setResult('');
    //     }
    // };

    return (
        <div className={styles.container}>
            {/* 배경색 분리를 위한 wrapper들 */}
            <div className={styles.backgroundWrapper}>
                <div className={styles.leftBackground}></div>
                <div className={styles.rightBackground}></div>
            </div>

            {/* 실제 컨텐츠 */}
            <div className={styles.contentWrapper}>
                {/* 왼쪽 섹션 */}
                <div className={styles.leftSection}>
                    <div className={styles.guideContent}>
                        <Image
                            src="/images/dashboard.png"
                            alt="이메일 찾기 안내"
                            width={500}
                            height={350}
                            className={styles.illustration}
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
                                <span className={styles.emphasis}> 이메일 형식의 아이디</span>를 <br />알려드립니다
                            </p>
                        </div>
                    </div>
                </div>


                <div className={styles.rightSection}>
                    <h3 className={styles.rightTitle}>ID 찾기</h3>
                    <form className={styles.findIdForm} >
                        <div className={styles.inputGroup}>
                            <input 
                                type="text" 
                                placeholder="이름"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input 
                                type="tel" 
                                placeholder="휴대폰 번호 (-없이 입력)"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className={styles.errorMessage}>{error}</div>}
                        {result && <div className={styles.successMessage}>{result}</div>}
                        <BaseButton
                            type="submit"
                            text="ID 찾기"
                            padding="1rem"
                            width="100%"
                            // 나중에 onClick 추가할예정
                        />
                    </form>
                    <div className={styles.links}>
                        <a href="/login/find-pw" className={styles.findPwLink}>
                            비밀번호를 잊으셨나요?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}