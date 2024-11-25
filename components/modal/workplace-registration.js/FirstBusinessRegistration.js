import { useState } from 'react';
import styles from './FirstBusinessRegistration.module.css';

const PinInput = ({ onComplete }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  
  const handleChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      if (value && index < 5) {
        const nextInput = document.querySelector(`input[name=pin-${index + 1}]`);
        nextInput?.focus();
      }
      
      if (index === 5 && value) {
        onComplete(newPin.join(''));
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=pin-${index - 1}]`);
      prevInput?.focus();
    }
  };

  return (
    <div className={styles.pinContainer}>
      {pin.map((digit, index) => (
        <input
          key={index}
          type="password"
          name={`pin-${index}`}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={styles.pinInput}
          maxLength={1}
        />
      ))}
    </div>
  );
};

const FirstBusinessRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStep, setVerificationStep] = useState(0);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    businessNumber: '',
    accountNumber: '',
    name: '',
    email: '',
    verificationCode: '',
    address: '',
    addressDetail: '',
  });

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleEmailVerification = async () => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setError('올바른 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // API 호출 예시 (실제 구현 시 endpoint 수정 필요)
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setIsEmailSent(true);
        setSuccess('인증 코드가 이메일로 전송되었습니다.');
      } else {
        setError('이메일 전송에 실패했습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeVerification = async () => {
    if (!formData.verificationCode.trim()) {
      setError('인증 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      // API 호출 예시
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          code: formData.verificationCode 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setVerificationStep(1); // PIN 번호 입력 단계로 이동
        setSuccess('이메일 인증이 완료되었습니다.');
      } else {
        setError('잘못된 인증 코드입니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinComplete = async (pin) => {
    try {
      // API 호출 예시
      const response = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentStep(4); // 주소 입력 단계로 이동
      } else {
        setError('잘못된 PIN 번호입니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // 사업자 정보
        return (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>사업자 정보 입력</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업장 상호명</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="상호명을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업자 번호</label>
              <input
                type="text"
                name="businessNumber"
                value={formData.businessNumber}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="사업자 번호를 입력하세요"
              />
            </div>
          </div>
        );

      case 2: // 계좌번호 입력
        return (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>계좌 정보 입력</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>계좌번호</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="계좌번호를 입력하세요"
              />
            </div>
          </div>
        );

      case 3: // 본인 인증 (이메일)
        return (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>본인 인증</h2>
            <div className={styles.verificationBox}>
              {!isEmailSent ? (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>이름</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>이메일</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles.input}
                      placeholder="이메일을 입력하세요"
                    />
                  </div>
                </>
              ) : (
                <div className={styles.formGroup}>
                  <label className={styles.label}>인증 코드</label>
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className={`${styles.input} ${styles.verificationCodeInput}`}
                    placeholder="인증 코드 6자리"
                    maxLength={6}
                  />
                </div>
              )}
              
              {error && <p className={styles.errorText}>{error}</p>}
              {success && <p className={styles.successText}>{success}</p>}
              
              {isLoading ? (
                <div className={styles.loadingSpinner} />
              ) : (
                <button
                  onClick={!isEmailSent ? handleEmailVerification : handleCodeVerification}
                  className={`${styles.button} ${styles.primaryButton}`}
                >
                  {!isEmailSent ? '인증 메일 발송' : '인증 확인'}
                </button>
              )}
            </div>
          </div>
        );

      case 4: // PIN 번호 입력
        return (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>PIN 번호 입력</h2>
            <p className={styles.verificationStepDescription}>
              6자리 PIN 번호를 입력해주세요
            </p>
            <PinInput onComplete={handlePinComplete} />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>
        );

      case 5: // 주소
        return (
          <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>주소 입력</h2>
            <div className={styles.formGroup}>
              <label className={styles.label}>기본 주소</label>
              <div className={styles.flexRow}>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  className={`${styles.input} ${styles.flexGrow}`}
                  placeholder="주소 검색을 클릭하세요"
                  readOnly
                />
                <button className={styles.addressSearchButton}>
                  주소 검색
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>상세 주소</label>
              <input
                type="text"
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="상세 주소를 입력하세요"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.businessName && formData.businessNumber;
      case 2:
        return formData.accountNumber;
      case 3:
        return verificationStep === 1;
      case 4:
        return true; // PIN 입력은 완료 시 자동으로 다음으로 넘어감
      case 5:
        return formData.address && formData.addressDetail;
      default:
        return false;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar}>
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className={styles.step}>
                  <div className={`${styles.stepCircle} ${currentStep >= step ? styles.active : ''}`}>
                    {step}
                  </div>
                  <div className={styles.stepText}>
                    {step === 1 ? '사업자 정보' : 
                     step === 2 ? '계좌 정보' :
                     step === 3 ? '본인 인증' :
                     step === 4 ? 'PIN 입력' : '주소 입력'}
                  </div>
                </div>
              ))}
              <div className={styles.progressLine}>
                <div
                  className={styles.progressLineFill}
                  style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {renderStepContent()}

        <div className={styles.navigationContainer}>
          <div className={styles.navigationButtons}>
            <button
              onClick={() => {
                setCurrentStep(prev => Math.max(prev - 1, 1));
                if (currentStep === 3) {
                  setIsEmailSent(false);
                  setVerificationStep(0);
                }
              }}
              className={`${styles.button} ${styles.secondaryButton}`}
              style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            >
              이전
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
              disabled={!canProceed()}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {currentStep === 5 ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstBusinessRegistration;