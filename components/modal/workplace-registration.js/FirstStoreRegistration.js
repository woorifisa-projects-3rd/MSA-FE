import { RegistrationProvider , useRegistration} from "@/contexts/RegistrationContext"
import styles from "./BusinessRegistration.module.css"
import StepProgress from "./common/StepProgress"
import StepNavigation from "./common/StepNavigation"
import StoreInfoStep from "./steps/StoreInfoStep";
import AccountStep from "./steps/AccountStep";
import VerificationStep from "./steps/VerificationStep";
import PinStep from "./steps/PinStep";
import AddressStep from "./steps/AddressStep";

export function FirstStoreRegistrationContent({onClose, onSuccess}){
    const {currentStep} = useRegistration();
    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <StepProgress />
                <div className={styles.content}>
                    {currentStep === 1 && <StoreInfoStep />}
                    {currentStep === 2 && <AccountStep />}
                    {currentStep === 3 && <VerificationStep />}
                    {currentStep === 4 && <PinStep />}
                    {currentStep === 5 && <AddressStep />}
                </div>
                <StepNavigation onClose={onClose} onSuccess={onSuccess} />
            </div>
        </div>
    )
}

export default function FirstStoreRegistration({onClose, onSuccess}){
   
    return(
        <RegistrationProvider mode="first">
            <FirstStoreRegistrationContent 
                onClose={onClose} 
                onSuccess={onSuccess}
            />
        </RegistrationProvider>
    )
}