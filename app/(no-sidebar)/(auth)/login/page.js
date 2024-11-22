'use client'

import BaseButton from '@/components/button/base-button';
import styles from './login.module.css'
import { useState } from 'react';
import { useRouter } from 'next/navigation' 
import { nextClient } from '@/lib/nextClient';


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
            } 
        } catch (error) {
            setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };


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
                        disabled={isLoading}  // 로딩 중 버튼 비활성화
                    />

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}
                </form>
                <div className={styles.links}>
                    <a href="/login/find-id">ID/PW 찾기</a>
                    <a href="/signup">회원이 아니신가요?</a>
                </div>
                {/* <BaseButton 
                    text='버튼'
                    type='button'
                    onClick={getData}
                    disabled={isLoading}
               /> */}
            </div>
        </div>
    )
}