import React, { useEffect, useState } from 'react';
import styles from './PresidentInfo.module.css';
import BaseButton from '@/components/button/base-button';
import { nextClient } from '@/lib/nextClient';

const PresidentInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('1999년 10월 20일');
  const [phoneNumber, setPhoneNumber] = useState('010-7611-4338');
  const [isEditingBirth, setIsEditingBirth] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ birthDate: '', phoneNumber: '' });

  useEffect(() => {
    const loadMyPageData = async () => {
      try {
        const response = await nextClient.get('/mypage/president');
        const data = response.data;

        setName(data.name);
        setEmail(data.email);
        setBirthDate(data.birthDate);
        setPhoneNumber(data.phoneNumber);
        setOriginalData({
          birthDate: data.birthDate,
          phoneNumber: data.phoneNumber
        });

      } catch (error) {
        console.error('마이페이지 정보 로드 에러:', error.message);
      }
    }

    loadMyPageData();
  },[])

  const formatBirthDate = (input) => {
    const numbers = input.replace(/[^0-9]/g, '');
    if (numbers.length >= 8) {
      const year = numbers.substring(0, 4);
      const month = numbers.substring(4, 6);
      const day = numbers.substring(6, 8);
      return `${year}년 ${month}월 ${day}일`;
    }
    return input;
  };


  const handleSave = async () => {
    try {
      await nextClient.put('/user/president/modify', {
        phoneNumber: phoneNumber.replace(/-/g, ''),
        birthDate: birthDate.replace(/[년월일\s]/g, '')
      });
      setIsEditing(false);
      setOriginalData({
        birthDate,
        phoneNumber
      });
    } catch (error) {
      console.error('정보 수정 에러:', error.message);
      // 에러 발생 시 원래 데이터로 되돌리기
      setBirthDate(originalData.birthDate);
      setPhoneNumber(originalData.phoneNumber);
    }
  };
  const formatPhoneNumber = (input) => {
    const numbers = input.replace(/[^0-9]/g, '');
    if (numbers.length >= 10) {
      return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return input;
  };

  return (
    <div className={styles.container}>
        <div className={styles.headerSection}>
            <h2 className={styles.title}> {name} 사장님</h2>
            <div className={styles.email}>{email}</div>
        </div>
        <div className={styles.fieldGroup}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>생년월일</label>
            {isEditingBirth ? (
              <input
                type="text"
                value={birthDate.replace(/[년월일\s]/g, '')}
                onChange={(e) => setBirthDate(formatBirthDate(e.target.value))}
                className={styles.input}
                placeholder="YYYYMMDD"
              />
            ) : (
              <div className={styles.displayText}>{birthDate}</div>
            )}
          </div>
          <BaseButton
              text={isEditingBirth ? '저장' : '생년월일 변경'}
              onClick={() => setIsEditingBirth(!isEditingBirth)}
              className={styles.button}
          />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.inputWrapper}>
            <label className={styles.label}>전화번호</label>
            {isEditingPhone ? (
              <input
                type="tel"
                value={phoneNumber.replace(/-/g, '')}
                onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                className={styles.input}
                placeholder="01012345678"
              />
            ) : (
              <div className={styles.displayText}>{phoneNumber}</div>
            )}
          </div>
          <BaseButton
              text={isEditingPhone ? '저장' : '전화번호 변경'}
              onClick={() => setIsEditingPhone(!isEditingPhone)}
              className={styles.button}
          />
          
        </div>
    </div>
  );
};

export default PresidentInfo;