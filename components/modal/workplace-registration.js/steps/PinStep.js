import { useRegistration } from "@/contexts/RegistrationContext"
import PinInput from "../common/PinInput";
import styles from "../BusinessRegistration.module.css"
import { useState } from "react";

export default function PinStep(){
    const { verificationData, setVerificationData, setCurrentStep, registerPin } = useRegistration();
    const [isPinComplete, setIsPinComplete] = useState(false);
    const [verificationSuccess, setVerificationSuccess] = useState(false);

    const handlePinComplete = (pin) => {
      setVerificationData(prev => ({
          ...prev,
          pinNumber: pin
      }));
      setIsPinComplete(true);
    };

    const handleVerification = async () => {
      const result = await registerPin();
      if (result) {
          setVerificationSuccess(true);
      }
    };

    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>PIN 번호 입력</h2>
            <p className={styles.verificationStepDescription}>
              6자리 PIN 번호를 입력해주세요
            </p>
            <PinInput  onPinComplete={handlePinComplete} />
            {isPinComplete && !verificationSuccess && (
                <button
                    onClick={handleVerification}
                    className={`${styles.button} ${styles.primaryButton}`}
                >
                    PIN 번호 인증하기
                </button>
            )}
               {verificationSuccess && (
                <div className={styles.successText}>
                    PIN 번호 인증에 성공했습니다!
                </div>
            )}
        </div>
    )
}