import { RegistrationProvider, useRegistration } from "@/contexts/RegistrationContext";
import styles from "./BusinessRegistration.module.css"
import StepProgress from "./common/StepProgress";
import PinStep from "./steps/PinStep";
import EditStoreForm from "./steps/EditStoreForm";
import StepNavigation from "./common/StepNavigation";
import { useEffect } from "react";

export function EditStoreRegistrationContent({onClose, onSuccess, initialData}){
    const {currentStep, initializeEditStore} = useRegistration();

    useEffect(()=>{
        if(initialData) {
            initializeEditStore(initialData);
        }
    }, [initialData])
  
    return(
        <div className={styles.container}>
            <StepProgress />
            <div className={styles.content}>
                {currentStep === 1 && <PinStep />}
                {currentStep === 2 && <EditStoreForm />}
            </div>
            <StepNavigation onClose={onClose} onSuccess={onSuccess} />
        </div>
    )

}


export default function EditStoreRegistration({onClose, onSuccess, initialData}){
    return(
        <RegistrationProvider mode="edit">
            <EditStoreRegistrationContent 
                onClose={onClose} 
                onSuccess={onSuccess}
                initialData={initialData}
            />
        </RegistrationProvider>
    )
}