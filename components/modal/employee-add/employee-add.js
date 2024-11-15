"use client";

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import styles from './employee-add.module.css';
import AccountInputForm from '@/components/input/account-input';
import AddressSearch from '@/components/addsearch/AddressSearch';

const REQUIRED_ERROR = "필수 항목입니다.";
const DATE_ERROR = "잘못된 날짜입니다.";
const PAYMENT_DATE_ERROR = "1부터 28 사이의 숫자를 입력해주세요.";

const EmployeeForm = forwardRef(({ mode, initialData, onSubmit }, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        sex: true,
        phoneNumber: '',
        employmentType: true,
        bankCode: 20,
        accountNumber: '',
        salary: '',
        paymentDate: '',
        postcodeAddress: '',
        detailAddress: '',
    });

    const [formErrors, setFormErrors] = useState({});

    // initialData가 변경될 때 formData를 업데이트 (수정 모드)
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData({ ...initialData });
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

    // 제출 버튼 클릭시 유효성 검사 실행 
    const handleSubmit = (e) => {
        if (e) e.preventDefault();
    
        // 유효성 검사 수행
        const errors = validateForm(formData);
        setFormErrors(errors);
        
        // 오류가 없으면 제출
        if (Object.keys(errors).length === 0) {
            const { postcodeAddress, detailAddress, ...rest } = formData;
            const updatedFormData = {
                ...rest,
                address: `${postcodeAddress}, ${detailAddress}`,  // address로 결합해서 제출
            };
            if (onSubmit) onSubmit(updatedFormData);
            
        } else {
            console.log("유효성 검사 실패 !!!");
            console.log(errors);
            
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit,
    }));
    
    const validateRules = {
        name: value => value.trim() ? '' : REQUIRED_ERROR,
        email: value => value.trim() ? '' : REQUIRED_ERROR,
        phoneNumber: value => value.trim() ? '' : REQUIRED_ERROR,
        // bankCode: value => value ? '' : REQUIRED_ERROR,
        accountNumber: value => value.trim() ? '' : REQUIRED_ERROR,
        salary: value => value ? '' : REQUIRED_ERROR,
        paymentDate: value => {
            if (!value.trim()) return REQUIRED_ERROR;
            if (value < 1 || value > 28) return PAYMENT_DATE_ERROR;
            return '';
        },
        birthDate: value => {
            if (!value.trim()) return REQUIRED_ERROR;
            const inputDate = new Date(value);
            const today = new Date();
            if (inputDate >= today) return DATE_ERROR;
        },
        postcodeAddress: value => value.trim() ? '' : REQUIRED_ERROR,
        detailAddress: value => value.trim() ? '' : REQUIRED_ERROR,
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
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                    {formErrors.name && <span className={styles.error}>{formErrors.name}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>이메일</label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    {formErrors.email && <span className={styles.error}>{formErrors.email}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label>전화번호</label>
                    <input
                        type="tel"
                        placeholder="010-1111-1111"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                    {formErrors.phoneNumber && <span className={styles.error}>{formErrors.phoneNumber}</span>}
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label>성별</label>
                        <select
                            value={formData.sex}
                            onChange={(e) => setFormData({...formData, sex: e.target.value})}
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
                            onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
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
                                onChange={(e) => setFormData({ ...formData, salary: parseInt(e.target.value) })}
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
                                setFormData({ ...formData, paymentDate: e.target.value });
                            }}
                        />
                        {formErrors.paymentDate && <span className={styles.error}>{formErrors.paymentDate}</span>}
                    </div>
                </div>

                <div className={styles.formSection}>
                    <div className={styles.formRow}>
                        <AccountInputForm onChange={handleAccountChange} error={formErrors.accountNumber}/>
                    </div>
                </div>

                {/* 주소 섹션 추가 */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>주소</h3>
                    <AddressSearch onAddressChange={handleAddressChange} />
                    {(formErrors.postcodeAddress || formErrors.detailAddress) && (
                        <span className={styles.error}>{formErrors.postcodeAddress}</span>
                    )}
                </div>
                {/* <button type="submit" className={styles.submitButton}>직원 등록하기</button> */}
            </form>
        </div>
    );
});

export default EmployeeForm;
