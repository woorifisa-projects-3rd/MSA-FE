import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function StepNavigation() {
    const {
        currentStep,
        setCurrentStep,
        mode,
        validateBusinessInfo,
        validateAccount,
        finalizeRegistration,
        validateEmailVerification,
        isEmailVerified,
        isPinVerified,
        validateAllData
    } = useRegistration();

    const maxSteps = mode === "first" ? 5 : 4;

    console.log("step navigation 내 log mode?", mode)
    const handleNext = async () => {
        console.log(`Current Step: ${currentStep}`); // 현재 단계 로그 출력

        try {
            let validationSuccess = false;

            switch (currentStep) {
                case 1:
                    validationSuccess = await validateBusinessInfo();
                    break;
                case 2:
                    validationSuccess = await validateAccount();
                    break;
                case 3:
                    validationSuccess = await validateEmailVerification();
                    break;
                case 4:
                    validationSuccess =  isPinVerified;
                    break;
                case 5:
                    // 먼저 데이터 검증
                    if (!validateAllData()) {
                        return;
                    }
                    validationSuccess = await finalizeRegistration();
                    break;
                default:
                    console.error("Invalid step.");
                    return;
            }

            // 검증이 성공했을 때만 다음 단계로 이동
            if (validationSuccess && currentStep < maxSteps) {
                console.log(`Moving to Step: ${currentStep + 1}`);
                setCurrentStep((prev) => prev + 1);
                console.log(maxSteps)
            } else if (validationSuccess && currentStep === maxSteps) {
                console.log("All steps completed successfully.");
            } else {
                console.log("Validation failed. Staying on current step.");
            }
        } catch (error) {
           // console.error("Error in handleNext:", error);
        }
    };

    const handlePrevious = () => {
        console.log("Moving to previous step...");
        setCurrentStep((prev) => prev - 1);
    };


    // 다음 버튼 비활성화 조건 추가
    const isNextButtonDisabled = () => {
        if (currentStep === 3 && !isEmailVerified) {
            return true;
        }
        if (currentStep === 4 && !isPinVerified) {
            return true;
        }
        return false;
    };

  

    return (
        <div className={styles.navigationContainer}>
            <div className={styles.navigationButtons}>
                {currentStep > 1 && (
                    <button
                        onClick={handlePrevious}
                        className={`${styles.button} ${styles.secondaryButton}`}
                    >
                        이전
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className={`${styles.button} ${styles.primaryButton}`}
                    disabled={isNextButtonDisabled()}
                >
                    {currentStep === maxSteps ? "가게 등록" : "다음"}
                </button>
            </div>
        </div>
    );
}
