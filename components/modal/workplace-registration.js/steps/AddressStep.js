import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import AddressSearch from "@/components/addsearch/AddressSearch";
import { getGeocode } from "@/utils/getGeocode";
import { useState } from "react";
import { KakaoMap } from "@/utils/kakao";

export default function AddressStep(){
    const { formData, setFormData, error, success } = useRegistration();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [latAndLng, setlatAndLng] = useState(null);

    const [showMap, setShowMap] = useState(false);

    const handleAddressComplete = async (postcodeAddress) => {
        try{
            const coordinates = await getGeocode(postcodeAddress);
            console.log(coordinates);

            
            setlatAndLng({
                lat: coordinates.lat,
                lng: coordinates.lng
            })
            setShowMap(true)

            setSelectedAddress(postcodeAddress);
            setFormData(prev => ({
                ...prev,
                location: postcodeAddress
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

            {success && (
                <div className={styles.successText}>
                    {success}
                </div>
            )}

            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
            {showMap && <KakaoMap latAndLng={latAndLng} />}
        </div>
    )
}