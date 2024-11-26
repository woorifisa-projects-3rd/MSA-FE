import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StepProgress(){
    const { currentStep,  steps } = useRegistration();

    return(
        <div className={styles.container}>
            <div className={styles.progressBar}>
            {steps.map((step, index) => (
                <div key={index} className={styles.step}>
                <div className={`${styles.circle} ${currentStep > index && styles.active}`}>
                    {index + 1}
                </div>
                <span className={styles.label}>{step}</span>
                </div>
            ))}
            <div 
                className={styles.line}
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} 
            />
            </div>
        </div>
    )
}