import { useRegistration } from "@/contexts/RegistrationContext"
import PinInput from "../common/PinInput";
import styles from "../BusinessRegistration.module.css"

export default function PinStep(){
    const { setCurrentStep } = useRegistration();

    const handlePinComplete = async (pin) => {
        try {
          // PIN 검증 API 호출
          setCurrentStep(prev => prev + 1);
        } catch (error) {
          console.error('PIN 검증 실패');
        }
    };

    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>PIN 번호 입력</h2>
            <p className={styles.verificationStepDescription}>
            6자리 PIN 번호를 입력해주세요
            </p>
            <PinInput onComplete={handlePinComplete} />
        </div>
    )
}