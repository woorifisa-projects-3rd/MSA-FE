import { RegistrationProvider, useRegistration } from "@/contexts/RegistrationContext"
import styles from "./StoreRegistration.module.css"
import StepProgress from "./common/StepProgress";
import StepNavigation from "./common/StepNavigation";
import StoreInfoStep from "./steps/StoreInfoStep";
import AccountStep from "./steps/AccountStep";
import PinStep from "./steps/PinStep";
import AddressStep from "./steps/AddressStep";

export default function AdditionalStoreRegistration(){
    const {currentStep} = useRegistration();

    return(
        <RegistrationProvider 
            mode="additional"
            initialStep={1}
        >
            <StepProgress />
            <div className={styles.content}>
                {currentStep === 1 && <StoreInfoStep />}
                {currentStep === 2 && <AccountStep />}
                {currentStep === 3 && <PinStep />}
                {currentStep === 4 && <AddressStep />}
            </div>
            <StepNavigation />
        </RegistrationProvider>
    )
}