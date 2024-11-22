'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';
import styles from "./account-input.module.css";
import BaseButton from '../button/base-button';
import { nextClient } from '@/lib/nextClient';

const AccountInputForm = ({ isPresident = false, onChange, error, name, bankCode, accountNumber: propAccountNumber }) => {
  const wooriBank = useMemo(() => bankCodeList.find(bank => bank.code === '020'), []);
  const [selectedBank, setSelectedBank] = useState(() => {
    if (isPresident) return wooriBank;
    if (bankCode) return bankCodeList.find(bank => bank.code === bankCode) || bankCodeList[0];
    return bankCodeList[0];
  });

  const [accountNumber, setAccountNumber] = useState(propAccountNumber || '');
  const [showBankList, setShowBankList] = useState(false);
  const [validationMessage, setValidationMessage] = useState(''); // 유효성 메시지 상태 추가
  const dropdownRef = useRef(null);

  // 초기값 설정
  useEffect(() => {
    if (isPresident) {
      setSelectedBank(wooriBank);
    } else if (bankCode) {
      const bank = bankCodeList.find(bank => bank.code === bankCode.toString());
      if (bank) setSelectedBank(bank);
    }
    if (propAccountNumber) {
      setAccountNumber(propAccountNumber);
    }
  }, [isPresident, bankCode, propAccountNumber, wooriBank]);

  useEffect(() => {
    if (isPresident && selectedBank.code !== '020') {
      setSelectedBank(wooriBank);
      setShowBankList(false);
    }
  }, [isPresident, selectedBank, wooriBank]);

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
        accountNumber
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
        accountNumber: value
      });
    }
  };

  const BankSelector = isPresident ? (
    <div className={styles.bankSelector}>
      <div 
        className={styles.bankIcon}
        dangerouslySetInnerHTML={{ __html: wooriBank.logoUrl }}
      />
      <span>{wooriBank.name}</span>
    </div>
  ) : (
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
  );

 // POST 요청 처리 함수 추가 (직원계좌확인 코드)
  const handleSubmit = async () => {
    try {
      // POST 요청: 선택한 은행 코드와 계좌 번호 전송
      console.log("next-server로 보낼 data",name, bankCode, accountNumber )
      const response = await nextClient.post('/user/employee-account-check', {
        name,
        bankCode: selectedBank.code,
        accountNumber
      });

      console.log("반환값",response.data);
      // 응답 처리
      if (response.data.success === true) {
        setValidationMessage('계좌가 유효합니다.'); // 성공 메시지
      } else {
        setValidationMessage('계좌가 유효하지 않습니다.'); // 실패 메시지
      }
    } catch (error) {
      console.error('Error checking account:', error); // 에러 출력
      setValidationMessage('계좌 확인 중 오류가 발생했습니다.'); // 에러 메시지
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.formGroup}>
        <div className="flex gap-2 items-center relative">
          {BankSelector}

          {!isPresident && showBankList && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                은행 선택
              </div>
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

          <BaseButton 
            text="계좌 확인"
            type="button"
            onClick={handleSubmit} // 버튼 클릭 시 handleSubmit 호출
          />
        </div>
        {error && <span className={`${styles.error} ${styles.errorMessage}`}>{error}</span>}
      </div>

      {validationMessage && (
        <div className={styles.validationMessage}>
          {validationMessage} {/* 유효성 메시지 출력 */}
        </div>
      )}

      {isPresident && (
        <div className={styles.bankLink}>
          <a 
            href="https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131" 
            className={styles.bankLinkText}
          >
            우리은행 사업자 계좌가 없으신가요?
          </a>
        </div>
      )}
    </div>
  );
};

export default AccountInputForm;
