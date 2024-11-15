// components/input/AccountInputForm.jsx
'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';
import styles from "./account-input.module.css";
import BaseButton from '../button/base-button';

const AccountInputForm = ({ isPresident = false, onChange }) => {
  const wooriBank = useMemo(() => bankCodeList.find(bank => bank.code === '020'), []);
  const [selectedBank, setSelectedBank] = useState(isPresident ? wooriBank : bankCodeList[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleSubmit = () => {
    console.log({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      accountNumber
    });
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

  return (
    <div className={styles.form}>
      {/* <h2 className="text-lg mb-4">계좌 등록</h2> */}
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
                onClick={() => {
                  handleBankChange(bank)
                }}
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
          onClick={handleSubmit}
        />
     
      </div>
      </div>

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