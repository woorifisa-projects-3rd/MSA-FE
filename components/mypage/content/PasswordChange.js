'use client';
import styles from './PasswordChange.module.css';
import { useState, useEffect } from 'react';
import { nextClient } from '@/lib/nextClient';

export default function PasswordChange() {
    const [passwords, setPasswords] = useState({
        beforePassword: '',
        newPassword: '',
        confirm: ''
    });
    
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [isFormValid, setIsFormValid] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const validatePassword = (password) => {
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasLetter = /[A-Za-z]/.test(password);
        return password.length >= 8 && hasSpecialChar && hasDigit && hasLetter;
    };

    useEffect(() => {
        const isValid =
            passwords.beforePassword.trim() !== '' &&
            validatePassword(passwords.newPassword) &&
            passwords.confirm.trim() !== '' &&
            passwords.newPassword === passwords.confirm &&
            passwords.beforePassword !== passwords.newPassword;  // 현재 비밀번호와 새 비밀번호가 다른지 확인
        setIsFormValid(isValid);
    }, [passwords]);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
            ...prev,
            [name]: value
        }));

        if (name === 'newPassword') {
            if (value === passwords.beforePassword) {
                setPasswordError('현재 비밀번호로 변경할 수 없습니다.');
            } else if (!validatePassword(value)) {
                setPasswordError('비밀번호는 최소 8자리로 특수문자, 숫자, 영문자를 포함해 주세요.');
            } else {
                setPasswordError('');
            }
            setPasswordMatch(value === passwords.confirm);
        } else if (name === 'confirm') {
            setPasswordMatch(value === passwords.newPassword);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await nextClient.put('/president/changepassword', {
                beforePassword: passwords.beforePassword,
                newPassword: passwords.newPassword
            });

            if (response.status === 200) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
                // router.push('/mypage');
            } 
        } catch (error) {
            const errorMessage = error.response?.data?.message || '서버 에러가 발생했습니다.';
            alert(errorMessage);
        }
    };

    return (
        <form className={styles.container} onSubmit={handleSubmit}>
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
                    required
                />
            </div>

            <div className={`${styles.inputGroup} ${passwordError ? styles.hasError : ''}`}>
                <label className={styles.label}>새로운 비밀번호</label>
                <div className={styles.inputWrapper}>
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="********"
                        className={styles.input}
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    {passwordError && (
                        <div className={styles.errorMessage}>{passwordError}</div>
                    )}
                </div>
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
                        required
                    />
                    {!passwordMatch && passwords.confirm && (
                        <div className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                className={`${styles.button} ${!isFormValid ? styles.buttonDisabled : ''}`}
                disabled={!isFormValid}
            >
                저장
            </button>
        </form>
    );
}