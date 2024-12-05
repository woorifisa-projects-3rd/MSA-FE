"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './employee-add.module.css';
import AccountInputForm from '@/components/input/account-input';
import AddressSearch from '@/components/addsearch/AddressSearch';
import { nextClient } from '@/lib/nextClient';
import { validateForm, commonValidateRules } from "@/utils/validation";
import { useAuth } from '@/contexts/AuthProvider';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import ko from 'date-fns/locale/ko';
import './employeeAdd.css';

const REQUIRED_ERROR = "필수 항목입니다.";

const EmployeeForm = forwardRef(({ mode, initialData, onSubmit }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: new Date(),
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
        // if (!data.postcodeAddress.trim() || !data.detailAddress.trim()) {
        //   errors.address = "필수 항목입니다.";
        // }
      
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

          // detailAddress 유효성 검사 추가
        if (!formData.detailAddress.trim()) {
            errors.detailAddress = "상세 주소를 입력해주세요.";
        }

        setFormErrors(errors);
        
        // 오류가 없으면 제출
        if (Object.keys(errors).length === 0) {
            const { postcodeAddress, detailAddress, ...rest } = formData;
            const updatedFormData = {
                ...rest,
                address: `${postcodeAddress}, ${detailAddress}`,  // address로 결합해서 제출
                storeId
            };
            console.log('직원 수정 데이터: ',formData);

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
                    Router.push('/employee/management');
                } else {
                    throw new Error(response.data.error || '요청 처리 실패');
                }
            } catch (error) {
                setError(error.response?.data?.error || error.message);
            }
            
        } else {
            console.log("유효성 검사 실패 !!!");
            console.log(errors);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));

    const handleInputChange = (field, value) => {
        // 입력 값에서 모든 공백을 제거
        const sanitizedValue = value.replace(/\s/g, '');
    
        setFormData(prev => ({
            ...prev,
            [field]: sanitizedValue
        }));
    
        setFormErrors(prev => ({
            ...prev,
            [field]: ''
        }));
    };
      
    const handleDateChange = (date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setFormData(prev => ({
          ...prev,
          birthDate: formattedDate
        }));
        console.log('Formatted Date:', formattedDate);
      };

    return (
        <div className={styles.formContainer}>
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
                        <ReactDatePicker
                            locale={ko}
                            selected={formData.birthDate ? new Date(formData.birthDate) : null}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="날짜를 선택하세요"
                            showYearDropdown
                            showMonthDropdown
                            scrollableYearDropdown
                            yearDropdownItemNumber={100} 
                            minDate={new Date(1930, 0, 1)} // 시작 연도 설정
                            maxDate={new Date()} // 현재 날짜까지 설정
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
                            value={formData.insuranceIncluded ? 'true' : 'false'}
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
                                 const value = e.target.value;
                                 if ( value >= 1) {  // 급여일이 1일 이상으로만 입력 되도록
                                handleInputChange('paymentDate', e.target.value);
                                 }
                            }}
                        />
                        {formErrors.paymentDate && <span className={styles.error}>{formErrors.paymentDate}</span>}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formRow}>
                        <AccountInputForm
                            name={formData.name}
                            bankCode={formData.bankCode}
                            accountNumber={formData.accountNumber}
                            onChange={handleAccountChange}
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
                    {/* {(formErrors.address) && (
                        <span className={styles.error}>{formErrors.address}</span>
                    )} */}
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
