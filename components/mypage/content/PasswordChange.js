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

    // 폼 유효성 검사
    useEffect(() => {
        const isValid =
            passwords.beforePassword.trim() !== '' &&
            passwords.newPassword.trim() !== '' &&
            passwords.confirm.trim() !== '' &&
            passwords.newPassword === passwords.confirm;
        setIsFormValid(isValid);
    }, [passwords]);

    // 입력 값 업데이트
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({
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

    // 폼 제출 처리
    const handleSubmit = async (e) => {
        e.preventDefault(); // 기본 폼 제출 방지
        try {
            const response = await nextClient.put('/president/changepassword', {
                beforePassword: passwords.beforePassword,
                newPassword: passwords.newPassword
            });

            if (response.status === 200) {
                alert('비밀번호가 성공적으로 변경되었습니다.');
            } else {
                alert('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
            }
        } catch (error) {
            alert('현재 비밀번호가 다릅니다. 다시 시도해 주세요.');
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
                    required // 필수 입력 필드로 설정
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
                    required
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
                        required
                    />
                    {!passwordMatch && passwords.confirm && (
                        <div className={styles.errorMessage}>비밀번호가 일치하지 않습니다.</div>
                    )}
                </div>
            </div>

            <button
                type="submit" // 폼 제출 버튼
                className={`${styles.button} ${!isFormValid ? styles.buttonDisabled : ''}`}
                disabled={!isFormValid} // 폼이 유효하지 않으면 비활성화
            >
                저장
            </button>
        </form>
    );
}
