'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';
import styles from "./account-input.module.css";
import BaseButton from '../button/base-button';
import { nextClient } from '@/lib/nextClient';

// AccountInputForm 컴포넌트
const AccountInputForm = ({ 
  isPresident = false, 
  onChange, 
  checkValidation,
  error, 
  name, 
  bankCode, 
  accountNumber: propAccountNumber 
}) => {
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

  // POST 요청 처리 함수 (사업장 및 추가 사업장 수정)
  const presidentSubmit = async () => {
    try {
      const response = await nextClient.post('/user/account-check', {
        bankCode: "020",
        accountNumber
      });
      console.log("사장", bankCode, accountNumber )
      console.log(response.data);
      
      if (response.data.success) {
        setValidationMessage({text: '사업장 계좌가 유효합니다.' , color: 'green'});
      } else {
        setValidationMessage({text: '사업장 계좌가 유효하지 않습니다.' , color: 'red'});
      }
      checkValidation(response.data.success);
    } catch (error) {
      console.error('Error checking account:', error);
      setValidationMessage({text: '사업장 계좌 확인 중 오류가 발생했습니다.' , color: 'red'});
    }
  };

  // POST 요청 처리 함수 (직원 추가 및 수정)
  const employeeSubmit = async () => {
    try {
      const response = await nextClient.post('/user/employee-account-check', {
        name,
        bankCode: selectedBank.code,
        accountNumber
      });
      console.log("직원",name, bankCode, accountNumber )
      console.log(response.data);
      
      if (response.data.success) {
        setValidationMessage({text: '직원 계좌가 유효합니다.', color:'green'});
      } else {
        setValidationMessage({text: '직원 계좌가 유효하지 않습니다.', color:'red'});
      }
      checkValidation(response.data.success);
    } catch (error) {
      console.error('Error checking employee account:', error);
      setValidationMessage({text: '직원 계좌 확인 중 오류가 발생했습니다.', color:'red'});
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
            onClick={isPresident ? presidentSubmit : employeeSubmit} 
          />
        </div>
        {error && <span className={`${styles.error} ${styles.errorMessage}`}>{error}</span>}
      </div>

      {validationMessage && (
      <p style={{ color: validationMessage.color }}>
          {validationMessage.text}
      </p>
      )}

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
