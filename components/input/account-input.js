'use client'
import React, { useState, useEffect } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';
import classes from "./account-input.module.css";

const AccountInput = ({ isPresident = false }) => {
  const wooriBank = bankCodeList.find(bank => bank.code === '002');
  
  const [selectedBank, setSelectedBank] = useState(isPresident ? wooriBank : bankCodeList[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  useEffect(() => {
    if (isPresident) {
      setSelectedBank(wooriBank);
      setShowBankList(false);
    }
  }, [isPresident]);

  const handleSubmit = () => {
    console.log({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      accountNumber
    });
  };

    // SVG를 안전하게 렌더링하는 컴포넌트
    const BankLogo = ({ logo }) => (
      <div className={classes.bankLogo}
        dangerouslySetInnerHTML={{ 
          __html: logo.replace('<svg', '<svg width="100%" height="100%"')
        }}
      />
    );

  const BankSelector = isPresident ? (
    <div className={classes.bankSelectorDisabled}>
      <BankLogo logo={wooriBank.logoUrl} />
      <span>{wooriBank.name}</span>
    </div>
  ) : (
    <button
      type="button"
      onClick={() => setShowBankList(!showBankList)}
      className={classes.bankSelector}
    >
      <BankLogo logo={selectedBank.logoUrl} />
      <span>{selectedBank.name}</span>
    </button>
  );

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>계좌 등록</h2>
      <div className={classes.inputContainer}>
        {BankSelector}

        {!isPresident && showBankList && (
          <div className={classes.dropdown}>
            <div className={classes.dropdownHeader}>
              은행 선택
            </div>
            {bankCodeList.map((bank) => (
              <div
                key={bank.code}
                onClick={() => {
                  setSelectedBank(bank);
                  setShowBankList(false);
                }}
                className={classes.dropdownItem}
              >
                <BankLogo logo={bank.logoUrl} />
                <span>{bank.name}</span>
              </div>
            ))}
          </div>
        )}

        <input
          type="text"
          placeholder="계좌번호"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className={classes.accountInput}
        />

        <button
          onClick={handleSubmit}
          className={classes.submitButton}
        >
          계좌 확인
        </button>
      </div>

      {!isPresident && (
        <div className={classes.linkContainer}>
          <a href="#" className={classes.link}>우리은행 서비스 계좌가 없으신가요?</a>
          <span className={classes.divider}>|</span>
          <a href="#" className={classes.link}>우리체크카드발급하러가기</a>
        </div>
      )}
    </div>
  );
};

export default AccountInput;