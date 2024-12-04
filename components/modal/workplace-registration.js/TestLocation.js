import AddressStep from "./steps/AddressStep";
import styles from "./BusinessRegistration.module.css"
import { RegistrationProvider } from "@/contexts/RegistrationContext";

export function LocationTestContent(){
    return(
        <div className={styles.container}>
            <AddressStep />
        </div>
    )
}

export default function LocationTest(){
    return(
        <RegistrationProvider>
            <LocationTestContent />
        </RegistrationProvider>
    )
}