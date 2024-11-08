'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Button from '@/components/button/button';

export default function Workplace() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2>사업장 등록</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label>사업장 상호명</label>
                <input type="text" placeholder="상호명을 입력하세요" />
              </div>

              <div className={styles.formGroup}>
                <label>사업자 번호</label>
                <div className={styles.inputGroup}>
                    <input type="text" placeholder="사업자 번호를 입력하세요" />
                    <Button text="번호 확인" color="#007bff" />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>계좌 등록</label>
                <div className={styles.inputGroup}>
                    <select>
                    <option>우리은행</option>
                    <option>하나은행</option>
                    <option>국민은행</option>
                    </select>
                    <input type="text" placeholder="계좌 번호를 입력하세요" />
                    <Button text="계좌 확인" color="#007bff" />
                </div>
              </div>

              <div className={styles.linkGroup}>
                <div>우리은행 사업자 계좌가 없으신가요?</div>
                <a href="https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131" className={styles.link}>우리계좌 개설하러가기</a>
              </div>

              <div className={styles.buttonGroup}>
                {/* 취소 및 확인 버튼에 onClick 추가 */}
                <Button text="취소" color="#f5f5f5" onClick={closeModal} />
                <Button text="확인" color="#007bff" />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
