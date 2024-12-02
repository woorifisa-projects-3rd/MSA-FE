import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StepProgress(){
    const { currentStep,  steps } = useRegistration();

    return(
        <div className={styles.progressBarContainer}>
            <div className={styles.progressBarWrapper} >
                <div className={styles.progressBar}>
                    {steps.map((step, index) => (
                        <div key={index} className={styles.step}>
                        <div className={`${styles.stepCircle} ${currentStep > index && styles.active}`}>
                            {index + 1}
                        </div>
                            <div className={styles.stepText}>{step}</div>
                        </div>
                    ))}
                    <div className={styles.progressLine}>
                        <div 
                            className={styles.progressLineFill}
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} 
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}