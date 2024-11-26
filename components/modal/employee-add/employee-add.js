"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './employee-add.module.css';
import AccountInputForm from '@/components/input/account-input';
import AddressSearch from '@/components/addsearch/AddressSearch';
import { nextClient } from '@/lib/nextClient';
import { validateForm, commonValidateRules } from "@/utils/validation";

const REQUIRED_ERROR = "필수 항목입니다.";

const EmployeeForm = forwardRef(({ mode, initialData, onSubmit }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        sex: true,
        phoneNumber: '',
        employmentType: 1,
        bankCode: 20,
        accountNumber: '',
        salary: '',
        paymentDate: '',
        postcodeAddress: '',
        detailAddress: '',
    });

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
        address: (data) =>
          commonValidateRules.address(data.postcodeAddress, data.detailAddress),
      };

    const validateFormData = (data) => {
        const errors = validateForm(data, validateRules);
      
        // 주소 필드 유효성 검사 추가
        if (!data.postcodeAddress.trim() || !data.detailAddress.trim()) {
          errors.address = "필수 항목입니다.";
        }
      
        return errors;
      };

    // 제출 버튼 클릭시 유효성 검사 실행 
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
    
        // 유효성 검사 수행
        const errors = validateFormData(formData);
        setFormErrors(errors);
        
        // 오류가 없으면 제출
        if (Object.keys(errors).length === 0) {
            const { postcodeAddress, detailAddress, ...rest } = formData;
            const updatedFormData = {
                ...rest,
                address: `${postcodeAddress}, ${detailAddress}`,  // address로 결합해서 제출
            };

            try {
                let response;
                // Axios 통해 API 요청
                if (mode === 'edit') {
                    // 수정 요청
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

    // 입력 시 오류 제거
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setFormErrors(prev => ({ ...prev, [field]: '' })); // 입력 시 오류 제거
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
                            value={formData.employmentType}
                            onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                        >
                            <option value="true">시급</option>
                            <option value="false">월급</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>금액</label>
                        <div className={styles.inputWithUnit}>
                            <input
                                type="number"
                                value={formData.salary}
                                onChange={(e) => handleInputChange('salary', e.target.value)}
                            />
                            <span>원</span>
                        </div>
                        {formErrors.salary && <span className={styles.error}>{formErrors.salary}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label>급여날짜</label>
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
                    <div className={styles.formRow}>
                        <AccountInputForm
                            bankCode={formData.bankCode}
                            accountNumber={formData.accountNumber}
                            onChange={handleAccountChange}
                            error={formErrors.accountNumber}/>
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
                </div>
            </form>
        </div>
    );
});

EmployeeForm.displayName = "EmployeeForm";

export default EmployeeForm;
