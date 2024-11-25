'use client';

import React, { useState } from 'react';
import styles from './signup.module.css';
import AddressSearch from '@/components/addsearch/AddressSearch';
import PostcodeModal from '@/components/postcode-search/PostcodeModal';

export default function Signup() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // 상세 주소 입력 핸들러
  const handleDetailAddressChange = (e) => {
    setDetailAddress(e.target.value);
  };

  // 모달에서 선택된 값 처리
  const handlePostcodeSelect = (selectedPostcode, selectedAddress) => {
    setPostcode(selectedPostcode);
    setAddress(selectedAddress);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>회원가입</h2>
        <form className={styles.form}>
          <div className={styles.formGrid}>
            {/* 왼쪽 섹션 */}
            <div className={styles.leftSection}>
              <div className={styles.inputGroup}>
                <input type="text" placeholder="이름" />
              </div>

              <div className={styles.inputGroup}>
                <input type="date" placeholder="생년월일" />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="우편번호"
                  value={postcode}
                  readOnly
                  className={styles.readOnlyInput}
                />
                <button
                  type="button"
                  className={styles.addressButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  우편번호찾기
                </button>
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="주소"
                  value={address}
                  readOnly
                  className={styles.readOnlyInput}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  placeholder="상세 주소"
                  value={detailAddress}
                  onChange={handleDetailAddressChange}
                  className={styles.input}
                />
              </div>
            </div>

            {/* 오른쪽 섹션 */}
            <div className={styles.rightSection}>

              <div className={styles.inputGroup}>
                <input type="tel" placeholder="전화번호" />
              </div>

              <div className={styles.inputGroup}>
                <input type="email" placeholder="email" />
                <button type="button" className={styles.verifyButton}>
                  인증번호 보내기
                </button>
              </div>

              <div className={styles.inputGroup}>
                <input type="text" placeholder="email 인증번호" />
                <button type="button" className={styles.verifyButton}>
                  확인
                </button>
              </div>

              <div className={styles.inputGroup}>
                <input type="password" placeholder="password" />
              </div>

              <div className={styles.inputGroup}>
                <input type="password" placeholder="password 재입력" />
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.accountCheck}>
              <span>우리은행 사업자 계좌가 없으신가요?</span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() =>
                  window.open(
                    'https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131',
                    '_blank'
                  )
                }
              >
                우리계좌개설하러가기
              </button>
            </div>

            <button type="submit" className={styles.submitButton}>
              회원 가입
            </button>
          </div>
        </form>
      </div>

      {/* 우편번호 검색 모달 */}
      {isModalOpen && (
        <PostcodeModal
          onComplete={handlePostcodeSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
