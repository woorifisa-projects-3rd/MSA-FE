import styles from "./workplace-registration.module.css"
import BaseButton from '@/components/button/base-button';
import AccountInputForm from "@/components/input/account-input";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const WorkplaceModal = forwardRef(({ mode = "create", workplaceData, onSubmit }, ref) => {
  
  const [formData, setFormData] = useState({
    storeName: workplaceData?.storeName || '',
    businessNumber: workplaceData?.businessNumber || '',
    accountNumber: workplaceData?.accountNumber || '',
    bankCode: workplaceData?.bankCode || 20,
    // location: workplaceData?.location || '"서울시 강동구 명일동"',
    // latitude: workplaceData?.latitude || 37.499564,
    // longitude: workplaceData?.longitude || 127.0315094,
  });

  const formRef = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    console.log('handleSubmit 호출!');
    

    if (onSubmit) {
      const processedData = {
        ...formData,
        accountNumber: formData.accountNumber.accountNumber,
      };
      console.log('제출 데이터: ', processedData);
      
      onSubmit(formData);
    }
};

  useImperativeHandle(ref, () => ({
      handleSubmit,
  }));
      

  return (
    <div className={styles.formContainer}>
      <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>사업장 상호명</label>
          <div className={styles.inputGroup}>
            <input 
              type="text"
              name="storeName"
              placeholder="상호명을 입력하세요" 
              value={formData.storeName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>사업자 번호</label>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              name="businessNumber"
              placeholder="사업자 번호를 입력하세요" 
              value={formData.businessNumber}
              onChange={handleInputChange}
              disabled={mode === 'edit'} // edit 모드면 비활성화
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>계좌 등록</label>
          <AccountInputForm
              isPresident={true}
              onChange={(value) => setFormData((prevData) => ({ ...prevData, accountNumber: value }))}
          />
        </div>
      </form>
    </div>
  );
});

export default WorkplaceModal;