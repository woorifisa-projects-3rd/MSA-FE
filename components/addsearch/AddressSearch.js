'use client'

import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styles from '@/components/addsearch/AddressSearch.module.css'

const AddressSearch = ({ onAddressChange, initialPostcodeAddress, initialDetailAddress }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [postcodeAddress, setPostcodeAddress] = useState(initialPostcodeAddress || '');
  const [detailAddress, setDetailAddress] = useState(initialDetailAddress || '');

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

  // 주소 변경 시 부모 컴포넌트로 변경된 값 전달
  useEffect(()=>{
    onAddressChange(postcodeAddress, detailAddress);
  }, [postcodeAddress, detailAddress]);

  // 초기값 설정
  useEffect(() => {
    if (initialPostcodeAddress) {
      setPostcodeAddress(initialPostcodeAddress);
    }
    if (initialDetailAddress) {
      setDetailAddress(initialDetailAddress);
    }
  }, [initialPostcodeAddress, initialDetailAddress]);

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
