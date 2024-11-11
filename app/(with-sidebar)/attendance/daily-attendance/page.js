'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Form() {
  const employees = ['정성윤', '류혜리', '이현아', '박준현', '임지혁'];
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [workHours, setWorkHours] = useState('총 근무시간:');

  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2024-01-01T${startTime}:00`);
      let end = new Date(`2024-01-01T${endTime}:00`);
      
      if (end < start) {
        end = new Date(`2024-01-02T${endTime}:00`);
      }
      
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      if (hours === 0) {
        setWorkHours(`총 근무시간: ${minutes}분`);
      } else if (minutes === 0) {
        setWorkHours(`총 근무시간: ${hours}시간`);
      } else {
        setWorkHours(`총 근무시간: ${hours}시간 ${minutes}분`);
      }
    }
  }, [startTime, endTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name) {
      alert('직원명을 선택해주세요');
      return;
    }
    if (!date) {
      alert('날짜를 선택해주세요');
      return;
    }
    if (!startTime) {
      alert('출근시간을 입력해주세요');
      return;
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.header}>
          <h2>출퇴근 기록 수정하기</h2>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <select 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.select}
            >
              <option value="">직원명</option>
              {employees.map((employee) => (
                <option key={employee} value={employee}>
                  {employee}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.timeInputs}>
              <div className={styles.inputGroup}>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className={styles.timeInput}
                />
                <span className={styles.timeLabel} data-type="start">출근</span>
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={styles.timeInput}
                />
                <span className={styles.timeLabel} data-type="end">퇴근</span>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className={styles.workHoursText}>
              {workHours}
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