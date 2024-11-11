'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Form() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    storeemployeeId: '',
    date: '',
    startTime: '',
    endTime: '',
    workTime: '00:00:00'
  });
  const [workHours, setWorkHours] = useState('총 근무시간: ');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = [
          {
            "storeemployeeId": 1,
            "name": "정성윤"
          },
          {
            "storeemployeeId": 2,
            "name": "박준현"
          },
          {
            "storeemployeeId": 3,
            "name": "임지혁"
          }
        ];
        setEmployees(response);
      } catch (error) {
        console.error('직원 데이터를 불러오는데 실패했습니다:', error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01T${formData.startTime}:00`);
      let end = new Date(`2024-01-01T${formData.endTime}:00`);
      
      if (end < start) {
        end = new Date(`2024-01-02T${formData.endTime}:00`);
      }
      
      const diff = end - start;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const timeFormat = `${formattedHours}:${formattedMinutes}:00`;
      
      setFormData(prev => ({
        ...prev,
        workTime: timeFormat
      }));
      
      if (hours === 0) {
        setWorkHours(`총 근무시간: ${minutes}분`);
      } else if (minutes === 0) {
        setWorkHours(`총 근무시간: ${hours}시간`);
      } else {
        setWorkHours(`총 근무시간: ${hours}시간 ${minutes}분`);
      }
    }
  }, [formData.startTime, formData.endTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.storeemployeeId) {
      alert('직원명을 선택해주세요');
      return;
    }
    if (!formData.date) {
      alert('날짜를 선택해주세요');
      return;
    }
    if (!formData.startTime) {
      alert('출근시간을 입력해주세요');
      return;
    }
    if (!formData.endTime) {
      alert('퇴근시간을 입력해주세요');
      return;
    }

      // formData 콘솔 출력
    console.log('formData:', {
      storeemployeeId: formData.storeemployeeId,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      workTime: formData.workTime
    });
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
              name="storeemployeeId"
              value={formData.storeemployeeId}
              onChange={handleChange}
              className={styles.select}
            >
              <option value="">직원명</option>
              {employees.map((employee) => (
                <option key={employee.storeemployeeId} value={employee.storeemployeeId}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <input 
              type="date" 
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={styles.dateInput}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.timeInputs}>
              <div className={styles.inputGroup}>
                <input 
                  type="time" 
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={styles.timeInput}
                />
                <span className={styles.timeLabel} data-type="start">출근</span>
              </div>
              <div className={styles.inputGroup}>
                <input 
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
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