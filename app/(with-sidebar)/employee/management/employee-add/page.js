"use client";

import { useState } from 'react';
import styles from './page.module.css';

const REQUIRED_ERROR = "필수 항목입니다.";
const DATE_ERROR = "잘못된 날짜입니다.";
const PAYMENT_DATE_ERROR = "1부터 28 사이의 숫자를 입력해주세요.";

export default function EmployeeForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        birthDate: '',
        sex: true,
        phoneNumber: '',
        employmentType: true,
        bankCode: '',
        accountNumber: '',
        salary: '',
        paymentDate: '',
        baseAddress: '서울특별시 용산구 한남동', // 주소찾기 로직 완료 후 빈 문자열로 수정해야 함
        detailAddress: ''
    });

    const [formErrors, setFormErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
    
        // 유효성 검사 수행
        const errors = validateForm(formData);
        setFormErrors(errors);
        
        // 오류가 없으면 제출
        if (Object.keys(errors).length === 0) {
            const fullAddress = `${formData.baseAddress} ${formData.detailAddress}`;
            const { baseAddress, detailAddress, ...rest } = formData;
            const updatedFormData = { ...rest, address: fullAddress };
            console.log(updatedFormData);
        } else {
            console.log("유효성 검사 실패 !!!");
        }
    };
    
    const validateRules = {
        name: value => value.trim() ? '' : REQUIRED_ERROR,
        email: value => value.trim() ? '' : REQUIRED_ERROR,
        phoneNumber: value => value.trim() ? '' : REQUIRED_ERROR,
        bankCode: value => value.trim() ? '' : REQUIRED_ERROR,
        accountNumber: value => value.trim() ? '' : REQUIRED_ERROR,
        salary: value => value ? '' : REQUIRED_ERROR,
        baseAddress: value => value.trim() ? '' : REQUIRED_ERROR,
        detailAddress: value => value.trim() ? '' : REQUIRED_ERROR,
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
        }
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

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>직원 추가</h2>
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
                    <h3 className={styles.sectionTitle}>계좌 정보</h3>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>은행 선택</label>
                            <select
                                value={formData.bankCode}
                                onChange={(e) => setFormData({...formData, bankCode: e.target.value})}
                            >
                                <option value="">은행을 선택하세요</option>
                                <option value="KB">국민은행</option>
                                <option value="shinhan">신한은행</option>
                                <option value="woori">우리은행</option>
                                <option value="hana">하나은행</option>
                                <option value="nh">농협은행</option>
                                <option value="ibk">기업은행</option>
                                <option value="kakao">카카오뱅크</option>
                            </select>
                            {formErrors.bankCode && <span className={styles.error}>{formErrors.bankCode}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label>계좌번호</label>
                            <input
                                type="text"
                                placeholder="'-' 없이 입력해주세요"
                                value={formData.accountNumber}
                                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                            />
                            {formErrors.accountNumber && <span className={styles.error}>{formErrors.accountNumber}</span>}
                        </div>
                    </div>
                </div>

                {/* 주소 섹션 추가 */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>주소</h3>
                    <div className={styles.formGroup}>
                        <div className={styles.postcodeRow}>
                            <input
                                type="text"
                                placeholder="우편번호"
                                value={formData.postcode}
                                readOnly
                                className={styles.postcodeInput}
                            />
                            <button type="button" className={styles.searchButton}>
                                우편번호 찾기
                            </button>
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="기본주소"
                            value={formData.address}
                            readOnly
                            className={styles.addressInput}
                        />
                        {formErrors.baseAddress && <span className={styles.error}>{formErrors.baseAddress}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="상세주소를 입력해주세요"
                            value={formData.detailAddress}
                            onChange={(e) => setFormData({...formData, detailAddress: e.target.value})}
                            className={styles.addressInput}
                        />
                        {formErrors.detailAddress && <span className={styles.error}>{formErrors.detailAddress}</span>}
                    </div>
                </div>

                <button type="submit" className={styles.submitButton} >추가</button>
            </form>
        </div>
    );
}
