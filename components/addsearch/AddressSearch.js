'use client'

import React, { useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styles from '@/components/addsearch/AddressSearch.module.css'

const AddressSearch = ({ onSelectAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');

  // Daum 우편번호 검색 완료 후 처리 함수
  const handleComplete = (data) => {
    setZipCode(data.zonecode);
    setAddress(data.address);
    setIsOpen(false);
  };

  // 상세 주소 입력 처리 함수
  const handleAddressChange = (e) => {
    setDetailedAddress(e.target.value);
  };

  // 주소 선택 후 부모 컴포넌트에 전달하는 함수
  const handleSubmit = () => {
    onSelectAddress(zipCode, address, detailedAddress);
    setIsOpen(false);
  };

  // 우편번호 찾기 버튼 클릭 시 열기/닫기 토글 함수
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.address}>
      <div className={styles['address-input']}>
        <input
          type="text"
          value={zipCode}
          readOnly
          placeholder="우편번호"
          className={styles['zip-code-field']}
        />
        <button onClick={toggleOpen} className={styles['zip-code-button']}>
          우편번호 찾기
        </button>
      </div>
      {isOpen && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <DaumPostcode onComplete={handleComplete} />
        </div>
      )}
      <input
        type="text"
        value={address}
        readOnly
        placeholder="주소"
        className={styles['address-field']}
      />
      <div className={styles['detailed-address-input']}>
        <input
          type="text"
          value={detailedAddress}
          onChange={handleAddressChange}
          placeholder="상세 주소"
          className={styles['detailed-address-field']}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
