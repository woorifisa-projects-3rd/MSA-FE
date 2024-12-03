import React from 'react';
import styles from "./delete-commute-modal.module.css"

const DeleteModal = ({ isOpen, onClose, onDelete, deleteId, title, text }) => {
    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalOpen : ''}`}>
        <div
          className={styles.modalBackdrop}
          onClick={onClose} // 백드롭 클릭 시 모달 닫기
          aria-hidden="true"
        ></div>
        <span className={styles.modalCenterHelper} aria-hidden="true">&#8203;</span>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <div className={styles.modalIcon}>
              <svg
                className={styles.modalIconSvg}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className={styles.modalTitleContainer}>
              <h3 className={styles.modalTitle}>{title}</h3>
              <p className={styles.modalText}>
                {text}
              </p>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              취소
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(deleteId)}
            >
              삭제
            </button>
          </div>
        </div>
      </div>      
    );
  };
  
  export default DeleteModal;