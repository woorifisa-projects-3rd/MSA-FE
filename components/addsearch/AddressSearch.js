'use client'

import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import styles from '@/components/addsearch/AddressSearch.module.css'

const AddressSearch = ({ onAddressChange, initialPostcodeAddress, initialDetailAddress , onDetailChange, onAddressComplete}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [postcodeAddress, setPostcodeAddress] = useState(initialPostcodeAddress || '');
  const [detailAddress, setDetailAddress] = useState(initialDetailAddress || '');

  // 초기값을 상태로 설정
  useEffect(() => {
    setPostcodeAddress(initialPostcodeAddress);
    setDetailAddress(initialDetailAddress);
  }, [initialPostcodeAddress, initialDetailAddress]);

  // Daum 우편번호 검색 완료 후 처리 함수
  const handleComplete = (data) => {
      const updatedAddress = data.address;
      setZipCode(data.zonecode);
      setPostcodeAddress(updatedAddress);
      setIsOpen(false);

      // 부모로 변경된 값 전달 -> 삭제해도될듯
      if (onAddressChange) {
        onAddressChange(updatedAddress, detailAddress);
      }
      // postcodeAddress 선택 완료시에만 geocoding API 호출
      if (onAddressComplete) {
        onAddressComplete(updatedAddress);
      }
  };

  // 상세 주소 입력 처리 함수 
  const handleDetailChange = (e) => {
    const updatedDetail = e.target.value;
    setDetailAddress(updatedDetail);

   if(onDetailChange){
    onDetailChange(updatedDetail);
   }
    
   if (onAddressChange) {
    onAddressChange(postcodeAddress, updatedDetail);
    }
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
        <button type='button' onClick={toggleOpen} className={styles['zip-code-button']}>
          우편번호 찾기
        </button>
      </div>
      {isOpen && (
        <div style={{ position: 'relative', zIndex: 100 }}>
          <DaumPostcode 
            onComplete={handleComplete} 
            autoClose={true}
            defaultQuery=""
            useSuggest={false}
            style={{ width: '100%', height: '400px' }}
            scripting="none"  // 스크립트 실행 제한
          />
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
          onChange={handleDetailChange}
          placeholder="상세 주소"
          className={styles['detailed-address-field']}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
