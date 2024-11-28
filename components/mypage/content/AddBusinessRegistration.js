import { useState } from 'react';
import styles from './AddBusinessRegistration.module.css';

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

const AddBusinessRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState('');
  
  const handleAccountVerification = () => {
    setVerificationStep(1);
  };

  const handlePinComplete = (pin) => {
    if (pin === '123456') {
      setVerificationStep(2);
    } else {
      alert('잘못된 PIN 번호입니다.');
    }
  };

  const handleCodeVerification = () => {
    if (verificationCode.length === 6) {
      setVerificationStep(3);
    } else {
      alert('올바른 인증 코드를 입력해주세요.');
    }
  };

  const AccountVerificationContent = () => {
    switch (verificationStep) {
      case 0:
        return (
          <div className={styles.verificationBox}>
            <div className={styles.verificationTitle}>우리은행 계좌 인증</div>
            <div className={styles.verificationText}>
              등록하신 계좌의 실명 확인을 위해 인증이 필요합니다.
            </div>
            <input
              type="text"
              className={styles.input}
              placeholder="계좌번호를 입력하세요"
            />
            <button 
              onClick={handleAccountVerification}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              계좌 확인
            </button>
          </div>
        );
      
      case 1:
        return (
          <div className={styles.textCenter}>
            <h3 className={styles.verificationTitle}>PIN 번호 입력</h3>
            <p className={styles.verificationText}>
              계좌 인증을 위해 6자리 PIN 번호를 입력해주세요.
            </p>
            <PinInput onComplete={handlePinComplete} />
          </div>
        );
      
      case 2:
        return (
          <div className={styles.textCenter}>
            <h3 className={styles.verificationTitle}>이메일 인증</h3>
            <p className={styles.verificationText}>
              등록된 이메일로 전송된 6자리 인증 코드를 입력해주세요.
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className={styles.input}
              placeholder="인증 코드 6자리"
              maxLength={6}
            />
            <button
              onClick={handleCodeVerification}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              인증 확인
            </button>
          </div>
        );
      
      case 3:
        return (
          <div className={styles.textCenter}>
            <div className={styles.successIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={styles.verificationTitle}>인증 완료</h3>
            <p className={styles.verificationText}>
              계좌 인증이 성공적으로 완료되었습니다.
            </p>
          </div>
        );
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>사업자 정보 입력</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업장 상호명</label>
              <input
                type="text"
                className={styles.input}
                placeholder="상호명을 입력하세요"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>사업자 번호</label>
              <input
                type="text"
                className={styles.input}
                placeholder="사업자 번호를 입력하세요"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>계좌 인증</div>
            <AccountVerificationContent />
          </div>
        );
      
      case 3:
        return (
          <div className={styles.formContainer}>
            <div className={styles.formTitle}>주소 입력</div>
            <div className={styles.formGroup}>
              <label className={styles.label}>기본 주소</label>
              <div className={styles.flexRow}>
                <input
                  type="text"
                  className={`${styles.input} ${styles.flexGrow}`}
                  placeholder="주소 검색을 클릭하세요"
                  readOnly
                />
                <button className={`${styles.button} ${styles.secondaryButton}`}>
                  주소 검색
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>상세 주소</label>
              <input
                type="text"
                className={styles.input}
                placeholder="상세 주소를 입력하세요"
              />
            </div>
          </div>
        );
    }
  };

  const canProceed = currentStep === 2 ? verificationStep === 3 : true;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBarWrapper}>
            <div className={styles.progressBar}>
              {[1, 2, 3].map((step) => (
                <div key={step} className={styles.step}>
                  <div className={`${styles.stepCircle} ${currentStep >= step ? styles.active : ''}`}>
                    {step}
                  </div>
                  <div className={styles.stepText}>
                    {step === 1 ? '사업자 정보' : step === 2 ? '계좌 인증' : '주소 입력'}
                  </div>
                </div>
              ))}
              <div className={styles.progressLine}>
                <div
                  className={styles.progressLineFill}
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
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
                if (currentStep === 2) {
                  setVerificationStep(0);
                }
              }}
              className={`${styles.button} ${styles.secondaryButton}`}
              style={{ visibility: currentStep === 1 ? 'hidden' : 'visible' }}
            >
              이전
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, 3))}
              disabled={!canProceed}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              {currentStep === 3 ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBusinessRegistration;