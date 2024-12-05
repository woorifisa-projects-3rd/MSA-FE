import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import AddressSearch from "@/components/addsearch/AddressSearch";
import { getGeocode } from "@/utils/getGeocode";
import { useState } from "react";
import { KakaoMap } from "@/utils/kakao";
import { useEffect } from "react";

export default function AddressStep({mode, initialLatLng, initialAddress }){
    const { formData, setFormData, error, success } = useRegistration();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [latAndLng, setlatAndLng] = useState(initialLatLng || null);
    // const [showMap, setShowMap] = useState(false);
    const [showMap, setShowMap] = useState(!!initialLatLng);

    // 컴포넌트 마운트 시 edit 모드면 맵 표시
    useEffect(() => {
        if (mode === 'edit' && initialLatLng) {
            setlatAndLng(initialLatLng);
            setShowMap(true);
        }
    }, [mode, initialLatLng]);

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
                initialPostcodeAddress={initialAddress || ""} 
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
            {showMap && <KakaoMap latAndLng={latAndLng} isChange={mode === "edit"} />}
        </div>
    )
}