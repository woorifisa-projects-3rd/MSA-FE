'use client'

import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styles from '@/components/addsearch/AddressSearch.module.css'

const AddressSearch = ({ onAddressChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [postcodeAddress, setPostcodeAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Daum 우편번호 검색 완료 후 처리 함수
  const handleComplete = (data) => {
    setZipCode(data.zonecode);
    setPostcodeAddress(data.address);
    setIsOpen(false);
  };

  // 상세 주소 입력 처리 함수
  const handleAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };


  // 우편번호 찾기 버튼 클릭 시 열기/닫기 토글 함수
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };


  useEffect(()=>{
    onAddressChange(postcodeAddress, detailAddress);
  }, [postcodeAddress, detailAddress]);

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
        <button type='button' onClick={toggleOpen} className={styles['zip-code-button']}>
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
        value={postcodeAddress}
        readOnly
        placeholder="주소"
        className={styles['address-field']}
      />
      <div className={styles['detailed-address-input']}>
        <input
          type="text"
          value={detailAddress}
          onChange={handleAddressChange}
          placeholder="상세 주소"
          className={styles['detailed-address-field']}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
