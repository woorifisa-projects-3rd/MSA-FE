import styles from "./workplace-registration.module.css"
import BaseButton from '@/components/button/base-button';
import AccountInputForm from "@/components/input/account-input";
import { useState } from "react";

export default function WorkplaceModal({
  mode="create", // 기본값
  workplaceData
}) {
  // mode가 edit인데 workplaceData가 없으면 에러 처리
  // if (mode === 'edit' && !workplaceData) {
  //   console.error('Edit mode requires workplace data');
  //   return <div>데이터를 불러올 수 없습니다.</div>;
  // }
  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div className={styles.formGroup}>
          <label>사업장 상호명</label>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="상호명을 입력하세요" 
              defaultValue={workplaceData?.storeName}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>사업자 번호</label>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              placeholder="사업자 번호를 입력하세요" 
              defaultValue={workplaceData?.businessNumber}
              disabled={mode === 'edit'}  // edit 모드면 비활성화
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>계좌 등록</label>
          <AccountInputForm 
              isPresident={mode === 'create'}  // create 모드일 때만 true
          />
        </div>

        {mode === 'create' ? (  // create 모드에서만 보이도록
          <div className={styles.linkGroup}>
          </div>
        ):(
          <div className={styles.linkGroup}>
            <a 
              href="https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131" 
              className={styles.bankLinkText}
            >
              우리은행 계좌 추가 개설을 원하시나요?
            </a>
          </div>
        )}
      </form>
    </div>
  );
}