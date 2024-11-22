import React, { useState, useEffect, useMemo, useRef } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';
import styles from "./account-input.module.css";
import BaseButton from '../button/base-button';
import { nextClient } from '@/lib/nextClient';

const AccountInputForm = ({ isPresident = false, onChange, error, name, accountNumber: propAccountNumber }) => {
  const wooriBank = useMemo(() => bankCodeList.find(bank => bank.code === '020'), []);
  const [selectedBank, setSelectedBank] = useState(() =>
    isPresident ? wooriBank : bankCodeList[0] // 사장님이면 우리은행 고정, 아니면 첫 은행 기본값
  );
  const [accountNumber, setAccountNumber] = useState(propAccountNumber || '');
  const [showBankList, setShowBankList] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const dropdownRef = useRef(null);

  // 초기값 설정
  useEffect(() => {
    if (isPresident) {
      setSelectedBank(wooriBank); // 사장님 계좌는 우리은행 고정
    }
  }, [isPresident, wooriBank]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBankList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 은행 선택 핸들러
  const handleBankChange = (bank) => {
    setSelectedBank(bank);
    setShowBankList(false);
    if (onChange) {
      onChange({
        bankCode: bank.code,
        bankName: bank.name,
        accountNumber,
      });
    }
  };

  // 계좌번호 변경 핸들러
  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    setAccountNumber(value);
    if (onChange) {
      onChange({
        bankCode: selectedBank.code,
        bankName: selectedBank.name,
        accountNumber: value,
      });
    }
  };

  // API 호출 함수: 사장님 계좌 확인
  const handlePresidentSubmit = async () => {
    try {
      const response = await nextClient.post('/user/account-check', {
        bankCode: '020', // 우리은행 고정
        accountNumber,
      });

      if (response.data.success) {
        setValidationMessage('사장님 계좌가 유효합니다.');
      } else {
        setValidationMessage('사장님 계좌가 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('사장님 계좌 확인 오류:', error);
      setValidationMessage('사장님 계좌 확인 중 오류가 발생했습니다.');
    }
  };

  // API 호출 함수: 직원 계좌 확인
  const handleEmployeeSubmit = async () => {
    try {
      const response = await nextClient.post('/user/employee-account-check', {
        name,
        bankCode: selectedBank.code,
        accountNumber,
      });

      if (response.data.success) {
        setValidationMessage('직원 계좌가 유효합니다.');
      } else {
        setValidationMessage('직원 계좌가 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('직원 계좌 확인 오류:', error);
      setValidationMessage('직원 계좌 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.formGroup}>
        {/* 은행 선택 UI */}
        <div className="flex gap-2 items-center relative">
          {isPresident ? (
            // 사장님 모드: 은행 고정
            <div className={styles.bankSelector}>
              <div
                className={styles.bankIcon}
                dangerouslySetInnerHTML={{ __html: wooriBank.logoUrl }}
              />
              <span>{wooriBank.name}</span>
            </div>
          ) : (
            // 직원 모드: 드롭다운 표시
            <button
              type="button"
              onClick={() => setShowBankList(!showBankList)}
              className={styles.bankButton}
            >
              <div
                className={styles.bankIcon}
                dangerouslySetInnerHTML={{ __html: selectedBank.logoUrl }}
              />
              <span>{selectedBank.name}</span>
            </button>
          )}

          {!isPresident && showBankList && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <div className={styles.dropdownHeader}>은행 선택</div>
              {bankCodeList.map((bank) => (
                <div
                  key={bank.code}
                  onClick={() => handleBankChange(bank)}
                  className={styles.dropdownItem}
                >
                  <div
                    className={styles.bankIcon}
                    dangerouslySetInnerHTML={{ __html: bank.logoUrl }}
                  />
                  <span>{bank.name}</span>
                </div>
              ))}
            </div>
          )}

          <input
            type="text"
            placeholder="계좌번호"
            value={accountNumber}
            onChange={handleAccountNumberChange}
            className={styles.input}
          />

          {/* 버튼: API 호출 */}
          <BaseButton
            text="계좌 확인"
            type="button"
            onClick={isPresident ? handlePresidentSubmit : handleEmployeeSubmit}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <span className={`${styles.error} ${styles.errorMessage}`}>{error}</span>
        )}
      </div>

      {/* 유효성 메시지 출력 */}
      {validationMessage && (
        <div className={styles.validationMessage}>{validationMessage}</div>
      )}

      {/* 사장님 모드에서 추가 링크 */}
      {isPresident && (
        <div className={styles.bankLink}>
          <a
            href="https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131"
            className={styles.bankLinkText}
          >
            우리은행 계좌 추가 개설을 원하시나요?
          </a>
        </div>
      )}
    </div>
  );
};

export default AccountInputForm;
