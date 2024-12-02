'use client'

import BaseButton from '@/components/button/base-button';
import styles from './login.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation' 
import { nextClient } from '@/lib/nextClient';
import Image from 'next/image';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('')  
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');  // 이전 에러 메시지 초기화
        setIsLoading(true);  // 로딩 시작

        try {
            // Axios를 통해 API Route로 요청
            const response = await nextClient.post('/auth/login', {
                email,
                password,
            });
        
            if (response.data.success) {
                router.push('/mypage');
                if (email === 'zipgyesajang@gmail.com') {
                    router.push('/manager');
                }
                
            } 
        } catch (error) {
            setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            {/* 배경색 분리를 위한 wrapper들 */}
            <div className={styles.backgroundWrapper}>
                <div className={styles.leftBackground}></div>
                <div className={styles.rightBackground}></div>
            </div>

            {/* 실제 컨텐츠 */}
            <div className={styles.contentWrapper}>
                <div className={styles.leftSection}>
                    <div className={styles.content}>
                        <h1 className={styles.mainTitle}>
                            매일 반복되는 
                            귀찮은<br/>
                            <span className={styles.highlight}>정산</span>과
                            <span className={styles.highlight}> 직원관리</span><br/> 이제 그만!
                        </h1>
                        <p className={styles.subTitle}>
                            이제는 자동화된 시스템으로 편하게 관리하세요
                        </p>
                        {/* <div className={styles.features}>
                            <div className={styles.feature}>
                                <p className={styles.featureText}>✓ 매출/지출 자동 연동으로 실시간 정산</p>
                                <p className={styles.featureText}>✓ 직원 급여와 근태관리 자동화</p>
                                <p className={styles.featureText}>✓ 언제 어디서나 웹으로 간편하게</p>
                            </div>
                        </div> */}
                        <div className={styles.imageContainer}>
                        <Image 
                            src="/images/hero-charts.png"
                            alt="대시보드 미리보기"
                            width={500}
                            height={350}
                            className={styles.illustration}
                        />
                        </div>
                    </div>    
                </div>

                <div className={styles.rightSection}>
                    <h3 className={styles.loginTitle}>로그인</h3>

                    <form className={styles.loginForm} onSubmit={handleLogin}>
                        <div className={styles.inputGroup}>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                }}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <BaseButton
                            text={isLoading ? "로그인 중..." : "로그인"}  // 로딩 중 텍스트 변경
                            type="submit"
                            padding="1rem"
                            width="100%"
                            disabled={isLoading}  // 로딩 중 버튼 비활성화
                        />

                        {error && (
                            <div className={styles.errorMessage}>
                                {error}
                            </div>
                        )}
                    </form>
                    <div className={styles.links}>
                        <div className={styles.findLinks}>
                            <a href="/login/find-id" className={styles.findLink}>ID 찾기</a>
                            <span className={styles.divider}>|</span>
                            <a href="/login/find-pw" className={styles.findLink}>PW 찾기</a>
                        </div>
                        <a href="/signup" className={styles.signupLink}>회원이 아니신가요?</a>
                    </div>
                </div>
            </div>
           
        </div>
    )
}