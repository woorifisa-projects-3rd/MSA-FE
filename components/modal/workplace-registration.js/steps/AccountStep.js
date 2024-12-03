import { useRegistration } from "@/contexts/RegistrationContext";
import styles from "../BusinessRegistration.module.css";

export default function AccountStep(){

    const {formData, setFormData, error} = useRegistration();

    const handleInputChange = (e) => {
        const value = e.target.value;
        // 숫자와 하이픈만 입력 가능하도록
        if (/^[0-9-]*$/.test(value)) {
            setFormData(prev => ({
                ...prev,
                accountNumber: value
            }));
        }
    };
    
    return(
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>계좌 정보 입력</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>계좌번호</label>
                <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="계좌번호를 입력하세요"
                />
            </div>
            {error && (
                <div className={styles.errorText}>
                    {error}
                </div>
            )}
        </div>
    )
}