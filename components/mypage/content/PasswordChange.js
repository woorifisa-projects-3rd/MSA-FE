'use client'
import styles from './PasswordChange.module.css';
import { useState, useEffect } from 'react';

export default function PasswordChange() {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = passwords.current.trim() !== '' && 
                       passwords.new.trim() !== '' && 
                       passwords.confirm.trim() !== '' &&
                       passwords.new === passwords.confirm;
        setIsFormValid(isValid);
    }, [passwords]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'confirm' || name === 'new') {
            if (name === 'new') {
                setPasswordMatch(value === passwords.confirm);
            } else {
                setPasswordMatch(value === passwords.new);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>비밀번호 변경</h2>
            
            <div className={styles.inputGroup}>
                <label className={styles.label}>현재 비밀번호</label>
                <input 
                    type="password" 
                    name="current"
                    placeholder="********"
                    className={styles.input}
                    value={passwords.current}
                    onChange={handlePasswordChange}
                />
            </div>

            <div className={styles.inputGroup}>
                <label className={styles.label}>새로운 비밀번호</label>
                <input 
                    type="password" 
                    name="new"
                    placeholder="********"
                    className={styles.input}
                    value={passwords.new}
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
            >
                저장
            </button>
        </div>
    );
}