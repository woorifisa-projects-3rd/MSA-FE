"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './employee-add.module.css';
import AccountInputForm from '@/components/input/account-input';
import AddressSearch from '@/components/addsearch/AddressSearch';
import { nextClient } from '@/lib/nextClient';
import { validateForm, commonValidateRules } from "@/utils/validation";
import { useAuth } from '@/contexts/AuthProvider';
import Loading from '@/components/loading/Loading';

const REQUIRED_ERROR = "필수 항목입니다.";

const EmployeeForm = forwardRef(({ mode, initialData, onSubmit }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        sex: true,
        phoneNumber: '',
        employmentType: 2,
        bankCode: 20,
        accountNumber: '',
        salary: '',
        paymentDate: '',
        postcodeAddress: '',
        detailAddress: '',
    });

    // name이 변경되면 AccountInputForm으로 name 값을 보내줄거임 


    const {storeId} = useAuth();

    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState('');
    const [isAccountValid, setIsAccountValid] = useState(false);
    const [loading, setLoading] = useState(false);

    // initialData가 변경될 때 formData를 업데이트 (수정 모드)
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            const { address, bankCode, accountNumber } = initialData;
            
            // address 문자열을 ', ' 기준으로 나누어 postcodeAddress와 detailAddress 설정
            const [postcodeAddress, ...detailParts] = address.split(', ');
            const detailAddress = detailParts.join(', ');

            setFormData({
                ...initialData,
                bankCode,
                accountNumber,
                postcodeAddress,
                detailAddress,
            });
        }
    }, [mode, initialData]);

    const handleAddressChange = (postcodeAddress, detailAddress) => {
        setFormData(prev => ({
            ...prev,
            postcodeAddress,
            detailAddress,
        }));
    };

    const handleAccountChange = ({ bankCode, accountNumber }) => {
        setFormData(prev => ({
            ...prev,
            bankCode,
            accountNumber,
        }));
        setFormErrors(prev => ({
            ...prev,
            accountNumber: bankCode && accountNumber ? '' : REQUIRED_ERROR,
        }));
    };

    const handleAccountValidation = (isValid) => {
        // isValid 값을 직접 설정
        setIsAccountValid(isValid);
    
        // 계좌 확인이 유효할 경우 에러 메시지 제거
        if (isValid) {
            setFormErrors((prev) => ({

                ...prev,
                accountNumber: '', // accountNumber 에러 메시지 제거
            }));
        }
    
        // isAccountValid 값 출력 (비동기적으로 반영되므로, 아래의 콘솔 출력은 최신 상태를 바로 반영하지 않음)
        console.log(isValid);
    };

    const validateRules = {
        name: commonValidateRules.required,
        email: commonValidateRules.email,
        phoneNumber: commonValidateRules.phoneNumber,
        accountNumber: commonValidateRules.required,
        salary: commonValidateRules.required,
        paymentDate: commonValidateRules.paymentDate,
        birthDate: commonValidateRules.birthDate,
        // address: (data) =>
        //   commonValidateRules.address(data.postcodeAddress, data.detailAddress),
      };

    const validateFormData = (data) => {
        const errors = validateForm(data, validateRules);
      
        // 주소 필드 유효성 검사 추가
        if (!data.postcodeAddress.trim() || !data.detailAddress.trim()) {
          errors.address = "필수 항목입니다.";
        }
      
        return errors;
      };

      const handleEmploymentTypeChange = (value) => {
        setFormData(prev => {
            const updatedData = { 
                ...prev, 
                employmentType: value === 'true' ? 2 : 1, // 시급(2) 또는 월급(1)
            };
    
            // 월급 선택 시 4대 보험 무조건 포함
            if (value === 'false') {
                updatedData.insuranceIncluded = true; // 월급일 경우 포함으로 강제 설정
            } else {
                // 시급 선택 시 기존 보험 포함 상태를 유지
                updatedData.insuranceIncluded = prev.insuranceIncluded;
            }
    
            return updatedData;
        });
    };
    
    
    const handleInsuranceChange = (value) => {
        setFormData(prev => {
            const updatedData = { 
                ...prev, 
                insuranceIncluded: value === 'true', 
            };
    
            // 시급 선택 시 4대 보험 여부에 따라 employmentType 설정
            if (prev.employmentType === 2 || prev.employmentType === 3) {
                updatedData.employmentType = value === 'true' ? 3 : 2;
            }
    
            return updatedData;
        });
    };
    

    // 제출 버튼 클릭시 유효성 검사 실행 
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
    
        // 유효성 검사 수행
        const errors = validateFormData(formData);
        setFormErrors(errors);

        if(!isAccountValid) {
            setFormErrors(prev => ({
                ...prev,
                accountNumber: '확인 버튼을 눌러 계좌를 확인해주세요.',
            }));
        }
        
        // 오류가 없으면 제출
        if (Object.keys(errors).length === 0 && isAccountValid) {
            const { postcodeAddress, detailAddress, ...rest } = formData;
            const updatedFormData = {
                ...rest,
                address: `${postcodeAddress}, ${detailAddress}`,  // address로 결합해서 제출
                storeId
            };

            setLoading(true);
            try {
                let response;
                // Axios 통해 API 요청
                if (mode === 'edit') {
                    // 수정 요청

                    console.log("next server로 보내는 직원 수정 데이터", updatedFormData, initialData.id)
                    response = await nextClient.put('/employee', {
                        ...updatedFormData,
                        seid: initialData.id, // 수정 대상 ID 전달
                    });
                    alert('직원 정보가 수정되었습니다.');
                } else {
                    
                    // 추가 요청
                    response = await nextClient.post('/employee', updatedFormData);
                    alert('직원이 추가되었습니다.');
                }
                if (response.data.success) {
                    // 성공 시 직원 관리 페이지로
                    if (onSubmit) onSubmit(updatedFormData);
                }
            } catch (error) {
                let errorMessage;
                if (error?.response?.status == '400') {
                    errorMessage = '가게에 이미 등록된 이메일입니다.'
                } else {
                    errorMessage = error.response?.data?.error || error.message;
                }
                setError(errorMessage);
                alert(errorMessage);
            } finally {
                setLoading(false);
            }
            
        } else {
            console.log("유효성 검사 실패 !!!");
            console.log(errors);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    // 입력 시 오류 제거
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: '' })); // 입력 시 오류 제거
    };

    return (
        <div className={styles.formContainer}>
            {loading && <Loading />}
            <h2 className={styles.formTitle}>{mode === 'edit' ? '직원 수정' : '직원 추가'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>직원 이름</label>
                    <input
                        type="text"
                        placeholder="ex) 홍길동"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                    {formErrors.name && <span className={styles.error}>{formErrors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>이메일</label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                    {formErrors.email && <span className={styles.error}>{formErrors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>전화번호</label>
                    <input
                        type="tel"
                        placeholder="010-1111-1111"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    />
                    {formErrors.phoneNumber && <span className={styles.error}>{formErrors.phoneNumber}</span>}
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>성별</label>
                        <select
                            value={formData.sex}
                            onChange={(e) => handleInputChange('sex', e.target.value)}
                        >
                            <option value="true">남자</option>
                            <option value="false">여자</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>생년월일</label>
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange('birthDate', e.target.value)}
                        />
                        {formErrors.birthDate && <span className={styles.error}>{formErrors.birthDate}</span>}
                    </div>
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>고용 형태</label>
                        <select
                            value={formData.employmentType === 1 ? 'false' : 'true'}
                            onChange={(e) => handleEmploymentTypeChange(e.target.value)}
                        >
                            <option value="true">시급</option>
                            <option value="false">월급</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>4대 보험 여부</label>
                        <select
                             value={formData.employmentType === 1 || formData.employmentType === 3 ? 'true' : 'false'}
                            onChange={(e) => handleInsuranceChange(e.target.value)}
                            disabled={formData.employmentType === 1} // 월급 선택 시 비활성화
                        >
                            <option value="true">포함</option>
                            <option value="false">미포함</option>
                        </select>
                    </div>


                    <div className={styles.formGroup}>
                        <label>금액</label>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value >= 0) { // 음수가 아닌 경우에만 업데이트
                                        handleInputChange('salary', value);
                                    }
                                }}
                            />
                            <span>원</span>
                        </div>
                        {formErrors.salary && <span className={styles.error}>{formErrors.salary}</span>}
                    </div>


                    <div className={styles.formGroup}>
                        <label>급여일</label>
                        <input
                            type="number"
                            placeholder='1부터 28까지 입력'
                            value={formData.paymentDate}

                            onChange={(e) => {
                                handleInputChange('paymentDate', e.target.value);
                            }}
                        />
                        {formErrors.paymentDate && <span className={styles.error}>{formErrors.paymentDate}</span>}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <p className={styles.accountSection}>직원도 우리 계좌를 사용하면, 우리가 0.1% 더해 보내 드려요!</p>
                    <div className={styles.formRow}>
                        <AccountInputForm
                            name={formData.name}
                            bankCode={formData.bankCode}
                            accountNumber={formData.accountNumber}
                            onChange={handleAccountChange}
                            checkValidation={handleAccountValidation}
                            error={formErrors.accountNumber}
                            />
                            
                    </div>
                </div>

                {/* 주소 섹션 추가 */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>주소</h3>
                    <AddressSearch
                        initialPostcodeAddress={formData.postcodeAddress}
                        initialDetailAddress={formData.detailAddress}
                        onAddressChange={handleAddressChange} />
                    {(formErrors.address) && (
                        <span className={styles.error}>{formErrors.address}</span>
                    )}
                    {formErrors.detailAddress && (
                        <span className={styles.error}>{formErrors.detailAddress}</span>
                    )}
                </div>
            </form>
        </div>
    );
});

EmployeeForm.displayName = "EmployeeForm";

export default EmployeeForm;
