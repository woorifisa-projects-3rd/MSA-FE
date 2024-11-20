// app/find-id/page.js
'use client'

import { useState } from 'react'
import { authApi } from '@/lib/auth'
import styles from './findId.module.css'

export default function FindIdPage() {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const handleFindId = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.findId(name, phoneNumber);
            setResult(`이메일을 찾았습니다. ${response.email}`);
            setError('');
        } catch (error) {
            console.error('Email 찾기 실패:', error);
            setError('일치하는 정보를 찾을 수 없습니다.');
            setResult('');
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
                <h3>Email 찾기</h3>
                <form className={styles.findIdForm} onSubmit={handleFindId}>
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
                            placeholder="전화번호"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {result && <div className={styles.successMessage}>{result}</div>}
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