'use client'
import React, { useState, useEffect } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';

const AccountInputForm = ({ isPresident = false }) => {
  // 우리은행 정보 찾기
  const wooriBank = bankCodeList.find(bank => bank.code === '020');
  
  // isPresident면 무조건 우리은행으로 초기화
  const [selectedBank, setSelectedBank] = useState(isPresident ? wooriBank : bankCodeList[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  // isPresident 변경시 우리은행으로 강제 변경
  useEffect(() => {
    if (isPresident) {
      setSelectedBank(wooriBank);
      setShowBankList(false); // 드롭다운도 강제로 닫기
    }
  }, [isPresident]);

  const handleSubmit = () => {
    console.log({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      accountNumber
    });
  };

  // 은행 선택 버튼을 disabled div로 변경
  const BankSelector = isPresident ? (
    // 우리은행 고정 표시
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50">
      <div 
        className="w-6 h-6 overflow-hidden [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: wooriBank.logoUrl }}
      />
      <span>{wooriBank.name}</span>
    </div>
  ) : (
    // 일반 선택 버튼
    <button 
      type="button"
      onClick={() => setShowBankList(!showBankList)}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
    >
      <div 
        className="w-6 h-6 overflow-hidden [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: selectedBank.logoUrl }}
      />
      <span>{selectedBank.name}</span>
    </button>
  );

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-lg mb-4">계좌 등록</h2>
      <div className="flex gap-2 items-center relative">
        {/* 은행 선택 영역 */}
        {BankSelector}

        {/* 드롭다운 - isPresident가 아닐 때만 표시 가능 */}
        {!isPresident && showBankList && (
          <div className="absolute top-full left-0 mt-1 w-72 h-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-2 font-medium">
              은행 선택
            </div>
            {bankCodeList.map((bank) => (
              <div
                key={bank.code}
                onClick={() => {
                  setSelectedBank(bank);
                  setShowBankList(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"
              >
                <div 
                  className="w-6 h-6 overflow-hidden [&>svg]:w-full [&>svg]:h-full"
                  dangerouslySetInnerHTML={{ __html: bank.logoUrl }}
                />
                <span>{bank.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* 계좌번호 입력 */}
        <input
          type="text"
          placeholder="계좌번호"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 계좌 확인 버튼 */}
        <button 
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          계좌 확인
        </button>
      </div>

      {/* 하단 링크 - isPresident가 아닐 때만 표시 */}
      {!isPresident && (
        <div className="mt-2 text-sm text-gray-500">
          <a href="#" className="text-blue-500 hover:underline">우리은행 서비스 계좌가 없으신가요?</a>
          <span className="mx-2">|</span>
          <a href="#" className="text-blue-500 hover:underline">우리체크카드발급하러가기</a>
        </div>
      )}
    </div>
  );
};

export default AccountInputForm;