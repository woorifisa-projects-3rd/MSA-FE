import { useRegistration } from "@/contexts/RegistrationContext"
import styles from "../BusinessRegistration.module.css"

export default function AddressStep(){
    const { formData, setFormData } = useRegistration();

    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>주소 입력</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>기본 주소</label>
                <div className={styles.flexRow}>
                    <input
                    type="text"
                    name="address"
                    value={formData.address}
                    className={`${styles.input} ${styles.flexGrow}`}
                    placeholder="주소 검색을 클릭하세요"
                    readOnly
                    />
                    <button className={styles.addressSearchButton}>
                    주소 검색
                    </button>
                </div>
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>상세 주소</label>
                <input
                    type="text"
                    name="addressDetail"
                    value={formData.addressDetail}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="상세 주소를 입력하세요"
                />
            </div>
        </div>
    )
}