import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import AddressSearch from "@/components/addsearch/AddressSearch";

export default function AddressStep(){
    const { formData, setFormData } = useRegistration();

   // 주소 변경 핸들러
   const handleAddressChange = (postcodeAddress, detailAddress) => {
    setFormData(prev => ({
        ...prev,
        location: `${postcodeAddress} ${detailAddress}`.trim()
        // 필요한 경우 latitude, longitude도 여기서 설정
    }));
};

    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>주소 입력</h2>
            <AddressSearch 
                onAddressChange={handleAddressChange}
                initialPostcodeAddress=""
                initialDetailAddress=""
            />
        </div>
    )
}