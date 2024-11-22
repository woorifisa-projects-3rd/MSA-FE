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

        {/* 현상황:mode가 create일 때는 사장으로 감, mode가 edit일때는 직원으로 감 */}
        {/* mode 상관없이 항상 accountInputform은 president = true 여야함 */}
        <div className={styles.formGroup}>
          <label>계좌 등록</label>
          <AccountInputForm 
              isPresident={true}  // create 모드일 때만 true
          />
        </div>

        
        {mode === 'create' ? (  // create 모드에서만 보이도록
          <div className={styles.linkGroup}>
          </div>
        ):(
          <div className={styles.linkGroup}>
          </div>
        )}
      </form>
    </div>
  );
}