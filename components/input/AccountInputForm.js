'use client'
import React, { useState } from 'react';
import { bankCodeList } from '@/constants/bankCodeList';

const AccountInputForm = () => {
  const [selectedBank, setSelectedBank] = useState(bankCodeList[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [showBankList, setShowBankList] = useState(false);

  const handleSubmit = () => {
    console.log({
      bankCode: selectedBank.code,
      bankName: selectedBank.name,
      accountNumber
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <h2 className="text-lg mb-4">계좌 등록</h2>
      <div className="flex gap-2 items-center relative">
        {/* 은행 선택 버튼 */}
        <div 
          onClick={() => setShowBankList(!showBankList)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 cursor-pointer bg-white"
        >
          <div 
            className="w-6 h-6 overflow-hidden text-gray-700 [&>svg]:w-full [&>svg]:h-full relative z-10"
            dangerouslySetInnerHTML={{ __html: selectedBank.logoUrl }}
          />
          <span>{selectedBank.name}</span>
        </div>

        {/* 은행 목록 드롭다운 */}
        {showBankList && (
          <div className="absolute top-full left-0 mt-1 w-72 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {bankCodeList.map((bank) => (
              <div
                key={bank.code}
                onClick={() => {
                  setSelectedBank(bank);
                  setShowBankList(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-white hover:bg-gray-50"
              >
                <div 
                  className="w-6 h-6 overflow-hidden text-gray-700 [&>svg]:w-full [&>svg]:h-full relative z-10"
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

      {/* 하단 링크 */}
      <div className="mt-2 text-sm text-gray-500">
        <a href="#" className="text-blue-500 hover:underline">우리은행 서비스 계좌가 없으신가요?</a>
        <span className="mx-2">|</span>
        <a href="#" className="text-blue-500 hover:underline">우리체크카드발급하러가기</a>
      </div>
    </div>
  );
};

export default AccountInputForm;
