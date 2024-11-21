import AddressSearch from "@/components/addsearch/AddressSearch";
import styles from "./workplace-registration.module.css"
import BaseButton from '@/components/button/base-button';
import AccountInputForm from "@/components/input/account-input";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const REQUIRED_ERROR = "필수 항목입니다.";

const WorkplaceModal = forwardRef(({ mode = "create", workplaceData, onSubmit }, ref) => {
  
  const [formData, setFormData] = useState({
    storeName: workplaceData?.storeName || '',
    businessNumber: workplaceData?.businessNumber || '',
    accountNumber: workplaceData?.accountNumber || '',
    bankCode: workplaceData?.bankCode || 20,
    postcodeAddress: workplaceData?.postcodeAddress || '',
  });

  const formRef = useRef();
  const [formErrors, setFormErrors] = useState({});

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      } else {
        throw new Error("해당 주소에 대응되는 위도, 경도 결과를 찾지 못함");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddressChange = (postcodeAddress, detailAddress) => {
      setFormData(prev => ({
          ...prev,
          postcodeAddress,
          detailAddress,
      }));
  };

  // 유효성 검사 함수
  const validateForm = (data) => {
    const errors = {};

    // 각 필드에 대해 유효성 검사 수행
    Object.keys(validateRules).forEach(field => {
        const error = validateRules[field](data[field]);
        if (error) errors[field] = error;
    });

      return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // 유효성 검사 수행
    const errors = validateForm(formData);
    setFormErrors(errors);

    // 오류가 없으면 제출
    if (Object.keys(errors).length === 0) {
      try {
        const { postcodeAddress, detailAddress, ...rest } = formData;

        const location = await geocodeAddress(postcodeAddress);

        if (onSubmit) {
          const processedData = {
            ...rest,
            accountNumber: formData.accountNumber.accountNumber,
            location: postcodeAddress,
            latitude: location.lat,
            longitude: location.lng,
          };

          console.log("제출 데이터:", processedData);
          onSubmit(processedData);
        }
      } catch (error) {
        alert("주소 변환에 실패했습니다. 다시 시도해주세요.");
      }
    } else {
      console.log('유효성 검사 실패!!!');
      console.log(errors);
      
    }
  };

  useImperativeHandle(ref, () => ({
      handleSubmit,
  }));

  const validateRules = {
      storeName: value => value.trim() ? '' : REQUIRED_ERROR,
      businessNumber: value => value.trim() ? '' : REQUIRED_ERROR,
      accountNumber: value => value ? '' : REQUIRED_ERROR,
      postcodeAddress: value => value.trim() ? '' : REQUIRED_ERROR,
      detailAddress: value => value.trim() ? '' : REQUIRED_ERROR,
  };
      
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
          {formErrors.storeName && <span className={styles.error}>{formErrors.storeName}</span>}
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
          {formErrors.businessNumber && <span className={styles.error}>{formErrors.businessNumber}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>계좌 등록</label>
          <AccountInputForm
              isPresident={true}
              error={formErrors.accountNumber}
              onChange={(value) => setFormData((prevData) => ({ ...prevData, accountNumber: value }))}
          />
        </div>
        {/* 주소 섹션 추가 */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>주소</h3>
          <AddressSearch
              initialPostcodeAddress={formData.postcodeAddress}
              initialDetailAddress={formData.detailAddress}
              onAddressChange={handleAddressChange} />
          {(formErrors.postcodeAddress || formErrors.detailAddress) && (
              <span className={styles.error}>{formErrors.detailAddress}</span>
          )}
      </div>
      </form>
    </div>
  );
});

export default WorkplaceModal;