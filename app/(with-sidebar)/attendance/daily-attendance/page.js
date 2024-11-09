'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Form() {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [totalHours, setTotalHours] = useState('');
  const [hourlyWage, setHourlyWage] = useState('');
  const [totalPay, setTotalPay] = useState('');
  const [error, setError] = useState('');

  const calculateTotalHours = () => {
    if (startTime && endTime) {
      // 기준 날짜로 Date 객체 생성
      let start = new Date(`2024-01-01T${startTime}:00`);
      let end = new Date(`2024-01-01T${endTime}:00`);
      
      // 퇴근시간이 출근시간보다 이른 경우 (날짜를 넘어가는 경우)
      if (end < start) {
        // 다음날로 설정
        end = new Date(`2024-01-02T${endTime}:00`);
      }
      
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const totalHoursDecimal = hours + (minutes / 60);
      
      if (hours === 0) {
        setTotalHours(`${minutes}분`);
      } else if (minutes === 0) {
        setTotalHours(`${hours}시간`);
      } else {
        setTotalHours(`${hours}시간 ${minutes}분`);
      }

      if (hourlyWage) {
        const pay = Math.round(totalHoursDecimal * parseInt(hourlyWage));
        setTotalPay(`${pay.toLocaleString()}원`);
      } else {
        setTotalPay('');
      }
    }
  };

  useEffect(() => {
    calculateTotalHours();
  }, [startTime, endTime, hourlyWage]);

  const handleHourlyWageChange = (e) => {
    const value = e.target.value;
    setHourlyWage(value);
    if (!value) {
      setTotalPay('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startTime) {
      alert('출근시간을 입력하세요');
      return;
    }
    // 폼 제출 로직
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2>출 · 퇴근 기록 수정하기</h2>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>직원이름</label>
                <input type="text" placeholder="직원 이름" />
              </div>
              <div className={styles.inputGroup}>
                <label>시급</label>
                <input 
                  type="number"
                  placeholder="시급을 입력하세요"
                  value={hourlyWage}
                  onChange={handleHourlyWageChange}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>출근시간</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>퇴근시간</label>
                <input 
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label>총 근무시간</label>
                <input 
                  type="text" 
                  value={totalHours} 
                  disabled 
                />
              </div>
              <div className={styles.inputGroup}>
                <label>총 급여</label>
                <input 
                  type="text" 
                  value={totalPay}
                  disabled
                />
              </div>
            </div>
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton}>취소</button>
            <button type="submit" className={styles.submitButton}>확인</button>
          </div>
        </form>
      </div>
    </div>
  );
}