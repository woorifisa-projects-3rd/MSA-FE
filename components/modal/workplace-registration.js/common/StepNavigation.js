import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StepNavigation (){
    const { currentStep, setCurrentStep, mode, formData } = useRegistration();
    const maxSteps = mode === 'first' ? 5 : 4;



    return(
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                {currentStep > 1 && (
                    <button 
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className={styles.button}
                    >
                        이전
                    </button>
                )}
                <button 
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className={`${styles.button} ${styles.primary}`}
                    disabled={currentStep === maxSteps}
                >
                    {currentStep === maxSteps ? '완료' : '다음'}
                </button>
            </div>
        </div>
    )
}