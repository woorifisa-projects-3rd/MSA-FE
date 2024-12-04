import React, { useEffect, useState } from 'react';
import styles from './PresidentInfo.module.css';
import BaseButton from '@/components/button/base-button';
import { nextClient } from '@/lib/nextClient';
import PrimaryButton from '@/components/button/primary-button';

const PresidentInfo = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isEditingBirth, setIsEditingBirth] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({ birthDate: '', phoneNumber: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadMyPageData = async () => {
      try {
        const response = await nextClient.get('/mypage/president');
        const data = response.data;

        setName(data.name);
        setEmail(data.email);
        setBirthDate(data.birthDate);
        const formatPhoneNumber = (phoneNumber) => {
          return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        }
        setPhoneNumber(formatPhoneNumber(data.phoneNumber));
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
      return `${year}-${month}-${day}`;
    }
    return input;
  };

  const isValidBirthDate = (date) => {
    const regex = /^\d{4}(-\d{2}-\d{2}|\d{2}\d{2})$/; // YYYYMMDD 형식
    if (!regex.test(date)) return false;
  
    // 유효한 날짜인지 확인
    const formattedDate = date.includes('-')
      ? date
      : `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
    const timestamp = Date.parse(formattedDate);
    return !isNaN(timestamp);
  };
    
  const isValidPhoneNumber = (number) => {
    const regex = /^\d{10,11}$/; // 10-11자리 숫자
    return regex.test(number);
  };


  const handleSave = async () => {   
    if (isEditingBirth || isEditingPhone) {
      setErrorMessage('확인 버튼을 눌러 확인해주세요.');
      return;
    }

    try {
      // birthDate 값을 yyyy-mm-dd 형식으로 변환
      const formattedBirthDate = birthDate.replace(/[년월일\s]/g, '').replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      const formattedPhoneNumber = phoneNumber.replace(/-/g, '');

      // 유효성 검사
      if (!isValidBirthDate(formattedBirthDate)) {
        setErrorMessage('유효한 8자리 생년월일을 입력해주세요.');
        return;
      }

      if (!isValidPhoneNumber(phoneNumber.replace(/-/g, ''))) {
        setErrorMessage('유효한 전화번호를 입력해주세요.');
        return;
      }

      await nextClient.put('/mypage/president/modify', {
        phoneNumber: formattedPhoneNumber,
        birthDate: formattedBirthDate,
      });

      setOriginalData({
        birthDate,
        phoneNumber
      });
      setIsEditing(false);
      alert("변경 사항이 저장되었습니다.");
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
        <div className={styles.changeSection}>
          <div className={styles.fieldGroup}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>생년월일</label>
              <div className={styles.inputChange}>
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
              <BaseButton
                text={isEditingBirth ? '확인' : '생년월일 변경'}
                onClick={() => {
                  setIsEditingBirth(!isEditingBirth);
                  setErrorMessage('');
                }}
              />
              </div>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.inputWrapper}>
              <label className={styles.label}>전화번호</label>
              <div className={styles.inputChange}>
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
              <BaseButton
                  text={isEditingPhone ? '확인' : '전화번호 변경'}
                  onClick={() => {
                    setIsEditingPhone(!isEditingPhone);
                    setErrorMessage('');
                  }}
              />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.saveButton}>
          <PrimaryButton
            text="변경 사항 저장"
            onClick={handleSave}
          />
          {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage}
          </div>
          )}
        </div>
    </div>
  );
};

export default PresidentInfo;