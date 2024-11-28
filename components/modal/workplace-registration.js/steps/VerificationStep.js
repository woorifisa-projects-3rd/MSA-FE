import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import { useState } from "react";

export default function VerificationStep(){
       const { setCurrentStep ,verificationData, setVerificationData , sendVerificationEmail, isEmailSent, setIsEmailSent, verifyEmailCode} = useRegistration()
    
     
      const handleEmailVerification = () => {
        setIsEmailSent(true);
      };
     
      const handleCodeVerification = () => {
        setCurrentStep(prev => prev + 1);
      };
    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>본인 인증</h2>
            <div className={styles.verificationBox}>
            {!isEmailSent ? (
                <>
                <div className={styles.formGroup}>
                    <label className={styles.label}>이름</label>
                    <input
                    type="text"
                    value={verificationData.name}
                    onChange={(e) => setVerificationData(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    className={styles.input}
                    placeholder="이름을 입력하세요"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>이메일</label>
                    <input
                    type="email"
                    value={verificationData.email}
                    onChange={(e) => setVerificationData(prev => ({
                        ...prev,
                        email: e.target.value
                    }))}
                    className={styles.input}
                    placeholder="이메일을 입력하세요"
                    />
                </div>
                <button
                    onClick={sendVerificationEmail}
                    className={`${styles.button} ${styles.primaryButton}`}
                >
                    인증 메일 발송
                </button>
                </>
            ) : (
                <>
                <div className={styles.formGroup}>
                    <label className={styles.label}>인증 코드</label>
                    <input
                    type="text"
                    value={verificationData.verificationCode}
                    onChange={(e) => setVerificationData(prev => ({
                        ...prev,
                        verificationCode: e.target.value
                    }))}
                    className={styles.input}
                    placeholder="인증 코드 6자리"
                    maxLength={6}
                    />
                </div>
                <button
                    onClick={verifyEmailCode}
                    className={`${styles.button} ${styles.primaryButton}`}
                >
                    확인
                </button>
                </>
            )}
            </div>
        </div>
    )
}