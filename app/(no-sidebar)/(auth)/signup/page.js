'use client';

import React, { useState } from 'react';
import styles from './signup.module.css';
import PostcodeModal from '@/components/postcode-search/PostcodeModal';
import { nextClient } from '@/lib/nextClient';
import { useRouter } from 'next/navigation';

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
    password: '',
    confirmPassword: '',
    isEmailConfirmed: false, // 이메일 인증 상태 확인
    termsAccept: true,
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [isEmailConfirmDisabled, setEmailConfirmDisabled] = useState(false);

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
    name: (value) => (!value ? '이름을 입력해주세요.' : ''),
    birthDate: (value) => {
      const today = new Date().toISOString().split('T')[0];
      return !value ? '생년월일을 입력해주세요.' : value >= today ? '유효한 생년월일을 입력해주세요.' : '';
    },
    postcode: (value) => (!value ? '우편번호 찾기를 눌러 우편변호를 입력해주세요.' : ''),
    basicAddress: (value) => (!value ? '주소를 입력해주세요.' : ''),
    detailAddress: (value) => (!value ? '상세주소를 입력해주세요.': ''),
    phoneNumber: (value) =>
      !/^(\d{3}\d{7,8}|\d{3}-\d{3,4}-\d{4})$/.test(value)
        ? '유효한 전화번호를 입력해주세요. 예) 010-1111-2222 또는 01011112222'
        : '',
    email: (value) =>
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? '유효한 이메일을 입력해주세요. 예) abc@gamil.com' : '',
    emailConfirm: (value, data) =>
      !data.isEmailConfirmed ? '이메일 인증을 완료해주세요.' : '',
    password: (value) =>
      !/^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value)
        ? '비밀번호는 최소 8자리로 특수문자(!@#$%^&*(),.?":{}|<>), 숫자, 영문자를 포함해야 합니다.'
        : '',
    confirmPassword: (value, data) =>
      value !== data.password ? '비밀번호가 일치하지 않습니다.' : '',
  };

  // 유효성 검사 수행
  const validateField = (name, value) => {
    return validateRules[name](value, formData);
  };

  const validateForm = (data) => {
    const errors = {};
    Object.keys(validateRules).forEach((field) => {
      const error = validateRules[field](data[field], data);
      if (error) errors[field] = error;
    });
    return errors;
  };

  // 이메일 인증 확인
  const handleEmailConfirm = () => {
    // 실제 인증 요청을 서버로 보내고 확인
    // 현재는 버튼 비활성화와 확인 상태만 처리
    setEmailConfirmDisabled(true);
    setFormData((prevData) => ({
      ...prevData,
      isEmailConfirmed: true,
    }));

    setFormErrors((prevErrors) => {
      const { emailConfirm, ...rest } = prevErrors;
      return rest;
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // 유효성 검사 수행
    const errors = validateForm(formData);
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
        termsAccept: true,
      };

      try {
        const response = await nextClient.post('/auth/signup', submissionData);
        
        if (response.data.success) {
          console.log(submissionData);
          alert('회원가입이 완료되었습니다!');
          router.push('/login');
        } else {
          throw new Error(response.data.error || '회원가입 실패');
        }
      } catch (error) {
        if (error.response?.status === 409) {
          alert('이미 존재하는 이메일 / 전화번호입니다.');
        }
        setError(error.response?.data?.error || error.message);
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
                 />
                <button type="button" className={styles.verifyButton}>
                  인증번호 보내기
                </button>
                {formErrors.email && <p className={styles.error}>{formErrors.email}</p>}
              </div>

              <div className={styles.inputGroup}>
                <input type="text" placeholder="email 인증번호" />
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
