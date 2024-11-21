'use client'
import styles from './PasswordChange.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { nextClient } from '@/lib/nextClient';

export default function PasswordChange() {
    const [passwords, setPasswords] = useState({
        beforePassword: '',
        newPassword: '',
        confirm: ''
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = passwords.beforePassword.trim() !== '' && 
                       passwords.newPassword.trim() !== '' && 
                       passwords.confirm.trim() !== '' &&
                       passwords.newPassword === passwords.confirm;
        setIsFormValid(isValid);
    }, [passwords]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'confirm' || name === 'newPassword') {
            if (name === 'newPassword') {
                setPasswordMatch(value === passwords.confirm);
            } else {
                setPasswordMatch(value === passwords.newPassword);
            }
        }
    };

    //axios 
    const handleSubmit = async () => {
        try {
            const response = await nextClient.put('/president/changepassword', {
                beforePassword: passwords.beforePassword,
                newPassword: passwords.newPassword
            });

            console.log("리스폰스 반환값 : !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" ,response)

            if (response.status === 200) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
            } 
            } catch (error) {
            alert('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
        }
    };


    return (
        <div className={styles.container}>
            <h2 className={styles.title}>비밀번호 변경</h2>
            
            <div className={styles.inputGroup}>
                <label className={styles.label}>현재 비밀번호</label>
                <input 
                    type="password" 
                    name="beforePassword"
                    placeholder="********"
                    className={styles.input}
                    value={passwords.beforePassword}
                    onChange={handlePasswordChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>새로운 비밀번호</label>
                <input 
                    type="password" 
                    name="newPassword"
                    placeholder="********"
                    className={styles.input}
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>새로운 비밀번호 확인</label>
                <div className={styles.inputWrapper}>
                    <input 
                        type="password" 
                        name="confirm"
                        placeholder="********"
                        className={styles.input}
                        value={passwords.confirm}
                        onChange={handlePasswordChange}
                    />
                    {!passwordMatch && passwords.confirm && (
                        <div className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
            </div>

            <button 
                className={`${styles.button} ${!isFormValid ? styles.buttonDisabled : ''}`}
                disabled={!isFormValid}
                onClick={handleSubmit}
                // onclick 하면 그 넥스트 서버로 요청하는 함수 실행하게함
            >
                저장
            </button>
        </div>
    );
}