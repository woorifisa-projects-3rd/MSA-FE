import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import AddressSearch from "@/components/addsearch/AddressSearch";
import { getGeocode } from "@/utils/getGeocode";
import { useState } from "react";

export default function AddressStep(){
    const { formData, setFormData, error } = useRegistration();
    const [selectedAddress, setSelectedAddress] = useState('');

    const handleAddressComplete = async (postcodeAddress) => {
        try{
            const coordinates = await getGeocode(postcodeAddress);
            console.log(coordinates);

            setSelectedAddress(postcodeAddress);
            setFormData(prev => ({
                ...prev,
                location: postcodeAddress,
                latitude: coordinates.lat,
                longitude: coordinates.lng
            }))
        }catch (error) {
            console.error("주소 좌표 변환 실패:", error);
            setFormData(prev => ({
                ...prev,
                latitude: 0,
                longitude: 0
            }));
        }
    }

    // 상세 주소 변경 핸들러
    const handleDetailChange  = (updatedDetail) => {
        if (!selectedAddress) return;

        setFormData(prev => ({
            ...prev,
            location: updatedDetail  ? `${selectedAddress}, ${updatedDetail}` : selectedAddress
        }))
    }


    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>주소 입력</h2>
            <AddressSearch 
                onDetailChange={handleDetailChange}
                onAddressComplete={handleAddressComplete}
                initialPostcodeAddress=""
                initialDetailAddress=""
            />
        </div>
    )
}