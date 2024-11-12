// components/WorkplaceModal.jsx
import Button from '@/components/button/button';
import Image from "next/image";
import styles from "./workplace-registrion.module.css"

export default function WorkplaceModal() {
  return (
    <div className={styles.formContainer}>
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
            <div className={styles.bankContainer}>
              <Image
                src="/images/woori.png"
                alt="우리은행 로고"
                width={24}
                height={24}
              />
              <span>우리은행</span>
            </div>
            <input type="text" placeholder="계좌 번호를 입력하세요" />
            <Button text="계좌 확인" color="#007bff" />
          </div>
        </div>

        <div className={styles.linkGroup}>
          <div>우리은행 사업자 계좌가 없으신가요?</div>
          <a href="https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131" className={styles.link}>
            우리계좌 개설하러가기
          </a>
        </div>

       
      </form>
    </div>
  );
}
