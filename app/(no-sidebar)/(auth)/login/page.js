'use client'

import BaseButton from '@/components/button/base-button';
import styles from './login.module.css'
import { authApi } from '@/api/auth/auth'
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');  // 에러 메시지를 위한 상태 추가
 
    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await authApi.login(email, password);
            // 로그인 성공 시 리다이렉트 (예: 대시보드)
           window.location.href = '/dashboard';  // 또는 원하는 페이
        } catch(error){
            console.error('로그인 실패:', error);
        }
    }
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
                            placeholder="ID" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    <BaseButton 
                        text="로그인"
                        type="submit"
                    />
                </form>
                <div className={styles.links}>
                    <a href="login/find-id">ID/PW 찾기</a>
                    <a href="signup">회원이 아니신가요?</a>
                </div>
            </div>
        </div>
    )
}