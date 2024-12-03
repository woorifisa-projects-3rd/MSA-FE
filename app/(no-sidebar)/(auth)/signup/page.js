'use client';

import React, { useState } from 'react';
import styles from './signup.module.css';
import PostcodeModal from '@/components/postcode-search/PostcodeModal';
import { nextClient } from '@/lib/nextClient';
import { useRouter } from 'next/navigation';
import { validateForm, commonValidateRules } from "@/utils/validation";

export default function Signup() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    postcode: '',
    basicAddress: '',
    detailAddress: '',
    phoneNumber: '',
    email: '',
    emailConfirm: '',
    password: '',
    confirmPassword: '',
    isEmailConfirmed: false, // 이메일 인증 상태 확인
    termsAccept: false,
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState('');
  const [isEmailConfirmDisabled, setEmailConfirmDisabled] = useState(false);
  const [emailConfirmNumber, setEmailConfirmNumber] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormErrors((prevErrors) => {
      const error = validateField(name, value);
      if (error) {
        return { ...prevErrors, [name]: error };
      } else {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      }
    });
    
  };

  const handlePostcodeSelect = (selectedPostcode, selectedAddress) => {
    setFormData((prevData) => ({
      ...prevData,
      postcode: selectedPostcode,
      basicAddress: selectedAddress,
    }));

    setFormErrors((prevErrors) => {
      const { postcode, basicAddress, ...rest } = prevErrors;
      return rest;
    });

    setIsModalOpen(false);
  };

  // 유효성 검사 함수
  const validateRules = {
    name: commonValidateRules.required,
    birthDate: commonValidateRules.birthDate,
    postcode: commonValidateRules.required,
    basicAddress: commonValidateRules.required,
    detailAddress: commonValidateRules.required,
    phoneNumber: commonValidateRules.phoneNumber,
    email: commonValidateRules.email,
    emailConfirm: (value, data) =>
      commonValidateRules.required(value) ||
      (data.isEmailConfirmed ? "" : "이메일 인증을 완료해주세요."),
    password: commonValidateRules.password,
    confirmPassword: commonValidateRules.confirmPassword,
  };

  // 유효성 검사 수행
  const validateField = (name, value) => {
    return validateRules[name](value, formData);
  };

  const emailSendHandler = async (e) => {
    e.preventDefault();
  
    try {
      // 이메일 전송 요청
      const response = await nextClient.post('/auth/signup/email', {
        email: formData.email,
      });
  
      // 성공 응답 처리
      setEmailSuccess('이메일이 발송되었습니다. 확인해주세요.');
      setEmailConfirmNumber(response.data.pin); // PIN 설정
      setError(''); // 에러 상태 초기화
    } catch (error) {
      // 에러 처리
      const errorMessage = error.response?.data?.error || error.message;
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        email: errorMessage,
      }));
    }
  };
  

  // 이메일 인증 확인
  const handleEmailConfirm = () => {        
    if (emailConfirmNumber == formData.emailConfirm) {
      setEmailConfirmDisabled(true);
      setEmailSuccess('');
      setFormData((prevData) => ({
        ...prevData,
        isEmailConfirmed: true,
      }));

      // 인증 성공 시 에러 메시지 제거
      setFormErrors((prevErrors) => {
        const { emailConfirm, ...rest } = prevErrors;
        return rest;
      });
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        emailConfirm: '인증번호가 일치하지 않습니다. 다시 확인해주세요.',
      }));

      setFormData((prevData) => ({
        ...prevData,
        isEmailConfirmed: false,
      }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 유효성 검사 수행
    const errors = validateForm(formData, validateRules);
    setFormErrors(errors);
    
    // 오류가 없으면 제출
    if (Object.keys(errors).length === 0) {
      const fullAddress = `${formData.basicAddress}, ${formData.detailAddress}`;

      const submissionData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
        address: fullAddress,
        termsAccept: false,
      };

      try {
        const response = await nextClient.post('/auth/signup', submissionData);
        console.log(submissionData);
        alert('회원가입이 완료되었습니다!');
        router.push('/login');
        
      } catch (error) {
        let errorMessage;
        if (error.response.status == '400') {
          errorMessage = '이미 등록된 전화번호 혹은 이메일입니다.'
        } else {
          errorMessage = error.response?.data?.error || error.message;
        }
        setError(errorMessage);
        alert(errorMessage);
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h2 className={styles.title}>회원가입</h2>
        <form className={styles.form}>
          <div className={styles.formGrid}>
            {/* 왼쪽 섹션 */}
            <div className={styles.leftSection}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleChange}
                   />
                   {formErrors.name && <p className={styles.error}>{formErrors.name}</p>}
              </div>

              <div className={styles.inputGroup}>
                <input type="date"
                name="birthDate"
                placeholder="생년월일"
                value={formData.birthDate}
                onChange={handleChange}
                 />
                 {formErrors.birthDate && (
                  <p className={styles.error}>{formErrors.birthDate}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="postcode"
                  placeholder="우편번호"
                  value={formData.postcode}
                  readOnly
                  className={styles.readOnlyInput}
                />
                <button
                  type="button"
                  className={styles.addressButton}
                  onClick={() => setIsModalOpen(true)}
                >
                  우편번호찾기
                </button>
                {formErrors.postcode && (
                  <p className={styles.error}>{formErrors.postcode}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="basicAddress"
                  placeholder="주소"
                  value={formData.basicAddress}
                  readOnly
                  className={styles.readOnlyInput}
                />
                {formErrors.basicAddress && (
                  <p className={styles.error}>{formErrors.basicAddress}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="detailAddress"
                  placeholder="상세 주소"
                  value={formData.detailAddress}
                  onChange={handleChange}
                />
                {formErrors.detailAddress && (
                  <p className={styles.error}>{formErrors.detailAddress}</p>
                )}
              </div>
            </div>

            {/* 오른쪽 섹션 */}
            <div className={styles.rightSection}>

              <div className={styles.inputGroup}>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="전화번호"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                 />
                 {formErrors.phoneNumber && (
                  <p className={styles.error}>{formErrors.phoneNumber}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isEmailConfirmDisabled}
                 />
                <button type="button" className={styles.verifyButton} onClick={emailSendHandler} disabled={isEmailConfirmDisabled}>
                  인증번호 보내기
                </button>
                {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
                {!formErrors.email && emailSuccess && (
                  <p className={styles.success}>{emailSuccess}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="emailConfirm"
                  placeholder="email 인증번호"
                  value={formData.emailConfirm}
                  onChange={handleChange}
                  disabled={isEmailConfirmDisabled}
                  />
                <button
                  type="button"
                  className={styles.verifyButton}
                  disabled={isEmailConfirmDisabled}
                  onClick={handleEmailConfirm}
                >
                  {isEmailConfirmDisabled ? '확인 완료' : '확인'}
                </button>
                {formErrors.emailConfirm && <p className={styles.error}>{formErrors.emailConfirm}</p>}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {formErrors.password && (
                  <p className={styles.error}>{formErrors.password}</p>
                )}
              </div>

              <div className={styles.inputGroup}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="password 재입력"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                 />
                 {formErrors.confirmPassword && (
                  <p className={styles.error}>{formErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          <div className={styles.bottomSection}>
            <div className={styles.accountCheck}>
              <span>우리은행 사업자 계좌가 없으신가요?</span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={() =>
                  window.open(
                    'https://nbi.wooribank.com/nbi/woori?withyou=BISVC0131',
                    '_blank'
                  )
                }
              >
                우리계좌개설하러가기
              </button>
            </div>

            <button type="submit" onClick={submitHandler} className={styles.submitButton}>
              회원 가입
            </button>
          </div>
        </form>
      </div>

      {/* 우편번호 검색 모달 */}
      {isModalOpen && (
        <PostcodeModal
          onComplete={handlePostcodeSelect}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
