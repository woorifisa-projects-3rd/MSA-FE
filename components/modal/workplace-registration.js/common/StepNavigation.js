import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StepNavigation() {
    const {
        currentStep,
        setCurrentStep,
        mode,
        validateBusinessInfo,
        validateAccount,
        sendVerificationEmail,
        verifyEmailCode,
        registerPin,
        finalizeRegistration,
    } = useRegistration();
    const maxSteps = mode === "first" ? 5 : 4;

    const handleNext = async () => {
        console.log(`Current Step: ${currentStep}`); // 현재 단계 로그 출력
        try {
            switch (currentStep) {
                case 1:
                    await validateBusinessInfo();
                    break;
                case 2:
                    await validateAccount();
                    break;
                case 3:
                    await sendVerificationEmail();
                    break;
                case 4:
                    await verifyEmailCode();
                    break;
                case 5:
                    await registerPin();
                    break;
                case 6:
                    await finalizeRegistration();
                    break;
                default:
                    console.error("Invalid step.");
                    return;
            }
            // 다음 단계로 이동
            if (currentStep < maxSteps) {
                setCurrentStep((prev) => prev + 1);
                console.log(`Moving to Step: ${currentStep + 1}`);
            } else {
                console.log("All steps completed.");
            }
        } catch (error) {
           // console.error("Error in handleNext:", error);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                {currentStep > 1 && (
                    <button
                        onClick={() => {
                            console.log("Moving to previous step...");
                            setCurrentStep((prev) => prev - 1);
                        }}
                        className={styles.button}
                    >
                        이전
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className={`${styles.button} ${styles.primary}`}
                    disabled={currentStep === maxSteps}
                >
                    {currentStep === maxSteps ? "완료" : "다음"}
                </button>
            </div>
        </div>
    );
}
