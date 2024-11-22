import AddressSearch from "@/components/addsearch/AddressSearch";
import styles from "./workplace-registration.module.css"
import BaseButton from '@/components/button/base-button';
import AccountInputForm from "@/components/input/account-input";
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { nextClient } from "@/lib/nextClient";

const REQUIRED_ERROR = "필수 항목입니다.";

const WorkplaceModal = forwardRef(({ mode, workplaceData, onSubmit, refreshStores }, ref) => {
    
  const [formData, setFormData] = useState({
    storeId: workplaceData?.storeId || '',
    storeName: workplaceData?.storeName || '',
    businessNumber: workplaceData?.businessNumber || '',
    accountNumber: workplaceData?.accountNumber || '',
    bankCode: '020',
    postcodeAddress: workplaceData?.postcodeAddress || '',
    detailAddress: workplaceData?.detailAddress || '',
  });

  useEffect(() => {
    if (mode === 'edit' && workplaceData) {
        const { location, bankCode, accountNumber } = workplaceData;
        console.log(workplaceData);
        
        // location 문자열을 ', ' 기준으로 나누어 postcodeAddress와 detailAddress 설정
        const [postcodeAddress, ...detailParts] = location.split(', ');
        const detailAddress = detailParts.join(', ');

        setFormData({
            ...workplaceData,
            bankCode,
            accountNumber,
            postcodeAddress,
            detailAddress,
        });
    }
}, [mode, workplaceData]);

  const formRef = useRef();
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

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

    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value.trim() ? '' : REQUIRED_ERROR, // 입력값이 있으면 오류 제거
    }));
  };

  const handleAddressChange = (postcodeAddress, detailAddress) => {
      setFormData(prev => ({
          ...prev,
          postcodeAddress,
          detailAddress,
      }));

      if (isSubmitted) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          address:
            postcodeAddress.trim() && detailAddress.trim()
              ? ''
              : REQUIRED_ERROR, // 둘 중 하나라도 비어 있으면 오류 메시지
        }));
      }
  };

  const handleAccountChange = ({bankCode, accountNumber}) => {
    const wooriCode = '020';
    setFormData(prev => ({
        ...prev,
        bankCode: wooriCode,
        accountNumber: accountNumber,
    }));

    setFormErrors(prevErrors => ({
      ...prevErrors,
      accountNumber: accountNumber?.trim() ? '' : REQUIRED_ERROR,
    }));
};

  // 유효성 검사 함수
  const validateForm = (data) => {
    const errors = {};

    // 계좌 필드 유효성 검사
    if (data.accountNumber === '') {
      errors.accountNumber = REQUIRED_ERROR;
    }

    // 주소 필드 유효성 검사
    if (!data.postcodeAddress || !data.detailAddress) {
        errors.address = REQUIRED_ERROR;
    }

    // 각 필드에 대해 유효성 검사 수행
    Object.keys(validateRules).forEach(field => {
        const error = validateRules[field](data[field]);
        if (error) errors[field] = error;
    });

      return errors;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setIsSubmitted(true);

    // 유효성 검사 수행
    const errors = validateForm(formData);
    setFormErrors(errors);
    console.log(formData);
    

    // 오류가 없으면 제출
    if (Object.keys(errors).length === 0) {
      const { postcodeAddress, detailAddress, ...rest } = formData;

      const geoLocation = await geocodeAddress(postcodeAddress);
      const location = `${postcodeAddress}, ${detailAddress}`;

      const processedData = {
        ...rest,
        accountNumber: formData.accountNumber,
        location,
        latitude: geoLocation.lat,
        longitude: geoLocation.lng,
      };

      try {
        let response;
        if (mode === 'edit') {          
          response = await nextClient.put(`/mypage/store`, {
            ...processedData,
            storeid: workplaceData.storeId,
          });
          alert('가게가 수정 되었습니다.');
        } else {
          response = await nextClient.post('/mypage/store', processedData);
          alert('가게가 추가 되었습니다.');
        }
        
        if (response.data.success) {
          if (onSubmit) onSubmit(processedData);
          console.log("제출 데이터:", processedData);          
          // refreshStores();
          window.location.reload();
        } else {
          throw new Error(response.data.error || '가게 업데이트 실패');
        }
      } catch (error) {
        setError(error.response?.data?.error || error.message);
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

        {/* 현상황:mode가 create일 때는 사장으로 감, mode가 edit일때는 직원으로 감 */}
        {/* mode 상관없이 항상 accountInputform은 president = true 여야함 */}
        <div className={styles.formGroup}>
          <label>계좌 등록</label>
          <AccountInputForm
              isPresident={true}
              error={formErrors.accountNumber}
              onChange={handleAccountChange}
              bankCode={formData.bankCode}
              accountNumber={formData.accountNumber}
          />
        </div>
        {/* 주소 섹션 추가 */}
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>주소</h3>
          <AddressSearch
              initialPostcodeAddress={formData.postcodeAddress}
              initialDetailAddress={formData.detailAddress}
              onAddressChange={handleAddressChange} />
          {formErrors.address && (
              <span className={styles.error}>{formErrors.address}</span>
          )}
      </div>
      </form>
    </div>
  );
});

export default WorkplaceModal;