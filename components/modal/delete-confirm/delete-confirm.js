'use client';
import React, { useState, useEffect } from 'react';
import styles from './delete-confirm.module.css';
import Button from '@/components/button/button';

const realPassword = "1234"; // 사장님 비밀번호를 임의로 설정해둠


export default function DeleteConfirmModal() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);

  // 비밀번호와 확인 비밀번호가 일치하는지 확인
  useEffect(() => {
    const isValid = password.trim() !== '' && confirmPassword.trim() !== '' && password === confirmPassword;
    setIsFormValid(isValid);
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password !== realPassword) {
      setError('비밀번호가 올바르지 않습니다.');
      return;
    }
    setError('');
    console.log('삭제 처리'); // 비밀번호 일치하면 삭제 처리
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>정말 삭제하시겠습니까?</h2>
        <h3>삭제하시면 복구가 어렵습니다.</h3>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label>비밀번호</label>
            <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>

          <div className={styles.formGroup}>
            <label>비밀번호 확인</label>
              <input type="password" placeholder="비밀번호 확인" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              <div className={styles.errorContainer}>
              {!passwordMatch && confirmPassword && (
                <p className={styles.error}>비밀번호가 일치하지 않습니다.</p>
              )}
              </div>
          </div>
        </form>
      </div>
    </div>
  );
}