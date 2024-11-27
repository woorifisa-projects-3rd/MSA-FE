'use client';
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from './modal-container.module.css';  
import BaseButton from "../button/base-button";
import { X } from "lucide-react";

export default function ModalContainer({
    title, 
    isOpen, 
    onClose,
    onConfirm, 
    children, 
    confirmText = "확인",  
    showButtons = true 
  }) {
    const [mounted, setMounted] = useState(false); 

    useEffect(() => {  
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // 모달 열릴 때 body 스크롤 막기
    useEffect(() => {
      if (isOpen) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'unset';
      }

      return () => {
          document.body.style.overflow = 'unset';
      };
    }, [isOpen]);


    // esc키로 모달 닫기
    useEffect(() => {
        if (!isOpen) return;
        
        const handleEsc = (e) => {
          if (e.key === 'Escape') onClose();
        };
        
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
      }, [onClose]);

      // 브라우저 뒤로 가기로 모달 닫기, x버튼이 아닌 뒤로 가기로 모달 닫기 기능도 추가했음 
    useEffect(() => {
        if (isOpen) {
          // 현재 URL을 히스토리에 추가
          window.history.pushState(null, '', window.location.href);
          
          const handlePopState = () => {
            onClose();
          };
          
          window.addEventListener('popstate', handlePopState);
          return () => window.removeEventListener('popstate', handlePopState);
        }
      }, [isOpen, onClose]);

    const modalContent = (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    <X />
                </button>

                <h2 className={styles.modalHeader}>{title}</h2>
                
                <div className={styles.modalBody}>
                {children}
                </div>

                {/* 하단 취소/확인 버튼 */}
                {showButtons && (
                    <div className={styles.buttonGroup}>
                        <BaseButton text="취소" backgroundColor="black" onClick={onClose} />
                        <BaseButton text={confirmText} onClick={onConfirm} />
                    </div>
                )}
            </div>
        </div>
    );

    if (!mounted || !isOpen) return null;

    return createPortal(
        modalContent,
        document.body
    );
}
