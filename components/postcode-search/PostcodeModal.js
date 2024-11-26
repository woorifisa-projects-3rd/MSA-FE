'use client';

import React from 'react';
import DaumPostcode from 'react-daum-postcode';
import styles from './PostcodeModal.module.css';

const PostcodeModal = ({ onComplete, onClose }) => {
  // 주소 선택 완료 시 호출
  const handleComplete = (data) => {
    onComplete(data.zonecode, data.address); // 우편번호와 주소 전달
    onClose();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <DaumPostcode onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default PostcodeModal;
