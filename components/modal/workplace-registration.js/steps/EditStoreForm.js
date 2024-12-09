import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";
import AddressStep from "./AddressStep";


export default function EditStoreForm() {
    const { formData, setFormData, error } = useRegistration();

    const initialLatLng = {
        lat: formData.latitude,
        lng: formData.longitude
    };

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 상호명 중복 체크 핸들러
    const handleStoreNameCheck = async () => {
        try {
            // 상호명 중복 체크 로직 구현
        } catch (error) {
            console.error('상호명 중복 체크 실패:', error);
        }
    };

    // 계좌 인증 핸들러
    const handleAccountVerification = async () => {
        try {
            // 계좌 인증 로직 구현
        } catch (error) {
            console.error('계좌 인증 실패:', error);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>사업장 정보 수정</h2>
            
            {/* 사업자 정보 영역 */}
            <div className={styles.formSection}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>사업장 상호명</label>
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            name="storeName"
                            value={formData.storeName}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.flexGrow}`}
                            placeholder="상호명을 입력하세요"
                        />
                        <button 
                            onClick={handleStoreNameCheck}
                            className={styles.verificationButton}
                        >
                            중복확인
                        </button>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>사업자 번호</label>
                    <input
                        type="text"
                        name="businessNumber"
                        value={formData.businessNumber}
                        className={styles.input}
                        disabled
                    />
                </div>
            </div>

            {/* 계좌 정보 영역 */}
            <div className={styles.formSection}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>계좌번호</label>
                    <div className={styles.inputWithButton}>
                        <input
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleChange}
                            className={`${styles.input} ${styles.flexGrow}`}
                            placeholder="계좌번호를 입력하세요"
                        />
                        <button 
                            onClick={handleAccountVerification}
                            className={styles.verificationButton}
                        >
                            인증
                        </button>
                    </div>
                </div>
            </div>

            {/* 주소 정보 영역 */}
            <div className={styles.formSection}>
                <AddressStep mode="edit" initialLatLng={initialLatLng} />
            </div>

            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
        </div>
    );
}