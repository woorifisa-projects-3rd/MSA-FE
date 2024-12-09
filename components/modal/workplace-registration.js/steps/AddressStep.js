import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"
import AddressSearch from "@/components/addsearch/AddressSearch";
import { getGeocode } from "@/utils/getGeocode";
import { useState } from "react";
import { KakaoMap } from "@/utils/kakao";
import { useEffect } from "react";

export default function AddressStep({mode, initialLatLng }){
    const { formData, setFormData, error, success , setSuccess} = useRegistration();
    const [selectedAddress, setSelectedAddress] = useState('');
    const [latAndLng, setlatAndLng] = useState(initialLatLng || null);
    // const [showMap, setShowMap] = useState(false);
    const [showMap, setShowMap] = useState(!!initialLatLng);

    // location 문자열을 기본 주소와 상세 주소로 분리
    const parseAddress = (location) => {
        if (!location) return { base: '', detail: '' };
        const [base, detail] = location.split(',').map(str => str.trim());
        return { base, detail: detail || '' };
    };

    const { base: initialPostcode, detail: initialDetail } = parseAddress(formData.location);


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
            setSuccess("카카오맵을 통해 자세한 위치를 클릭해주세요.")
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
                initialPostcodeAddress={initialPostcode}
                initialDetailAddress={initialDetail}
            />


            {success && (
                <div className={styles.successText}>
                    {success}
                </div>
            )}

            {showMap && <KakaoMap latAndLng={latAndLng} isChange={mode === "edit"} />}

            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
        </div>
    )
}