import {createContext, useContext, useState, useEffect} from "react";
import { nextClient } from "@/lib/nextClient";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children, mode}) => {
    const [formData, setFormData] = useState({
        storeName: "",
        businessNumber: "",
        accountNumber: "",
        bankCode: "020",
        location: "",
        latitude : 0,
        longitude : 0
    })
    const [currentStep, setCurrentStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [storeId, setStoreId] = useState(null); 

    const getSteps = (mode) => {
        switch (mode) {
            case 'first':
                return ['사업자정보 입력', '계좌정보 입력', '본인 인증', 'PIN번호 입력', '주소등록'];
            case 'edit':
                return ['PIN번호 입력', '사업장정보 편집'];
            default:  // 추가 등록 모드
                return ['사업자정보 입력', '계좌정보 입력', 'PIN번호 입력', '주소등록'];
        }
    };

    const steps = getSteps(mode);

    // 수정 모드를 위한 초기 데이터 설정 함수 추가
    const  initializeEditStore = (store) => {
        if (store) {
            setStoreId(store.storeId);
            setFormData({
                storeName: store.storeName,
                businessNumber: store.businessNumber,
                accountNumber: store.accountNumber,
                location: store.location,
                latitude: store.latitude,
                longitude: store.longitude
            });
        }
    };


    const [verificationData, setVerificationData] = useState({
        name: "",
        email: "",
        pinNumber: "",
        verificationCode : ""
    })

    // 각 단계별 검증 상태
    // 3단계 인증 관련 state
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    // 3-2 email 관련 에러/성공 메세지 
    const [isEmailErrored, setIsEmailErrored] = useState("");
    const [isEmailNumSuccess, setIsEmailNumSuccess] = useState("")
    // 4단계 인증 관련 state
    const [isPinVerified, setIsPinVerified] = useState(false);

    // 5단계 등록 상태 state
    const [isSubmitting, setIsSubmitting] = useState(false);

  
    // currentStep이 변경될 때마다 실행되는 useEffect 추가
    useEffect(() => {
        console.log(`현재 스텝이 ${currentStep}로 변경되었습니다.`);
    }, [currentStep]);  // currentStep을 dependency로 지정


    // Step 1: 사업자 정보 확인 
    const validateBusinessInfo = async () => {
        try {
            setError("");
            const response = await nextClient.post('/store/registration/businesscheck', {
                businessNumber: formData.businessNumber,
                storeName: formData.storeName
            });
            
            console.log(response.data);
            
            if (response.data.success) {
                setError("");
                return true;
            } 
          
        } catch (error) {
            // 서버에서 전달된 에러메시지 사용
            setError(error.response.data.error);
            return false;
        }
    };

    // Step 2: 계좌 인증
    const validateAccount = async () => {
        try {
            // 계좌 인증 API 호출 (예시)
            const response = await nextClient.post('/store/registration/accountcheck', {
                bankCode: "020", //우리은행 고정 
                accountNumber: formData.accountNumber,
            });
            
            if (response.data) {
                setError(""); // 성공시 에러 초기화
                return true;
            }
        } catch (error) {
            console.log("2단계 계좌인증 실패", error.response.data);
            setError(error.response.data.error);
            return false;
        }
    };

    // Step 3-1: 이메일 인증 코드 발송
    const sendVerificationEmail = async () => {
        try {
            const response = await nextClient.post('/store/registration/emailcheck', {
                email: verificationData.email,
                name: verificationData.name
            });
            
            console.log("스프링에서 프론트까지 전달",response.data);
            
            if (response.data) {
                setError("");
                setSuccess("이메일로 전송된 6자리 인증번호를 입력해주세요.");
                return setIsEmailSent(true);
            }
        } catch (error) {
            setError(error.response.data.error);
            return false;
        }
    };

    // Step 3-2: 이메일 인증 코드 확인
    const verifyEmailCode = async () => {
        try {
            const response = await nextClient.post('/store/registration/emailpincheck', {
                email: verificationData.email,
                emailPinNumber: verificationData.verificationCode
            });
            if (response.data.success) {
                setIsEmailErrored("");
                setIsEmailNumSuccess("이메일 인증이 성공했습니다!")
                setIsEmailVerified(true);
                return true;
            }
           
        } catch (error) {
            if(!error.response.data.success)
            setIsEmailErrored(error.response.data.error)
            console.log("3-2 이메일 pinNumber 에러메세지", isEmailErrored)
            return false;
        }
    };

    // Step 3-3: 이메일 인증 완료 후 다음 단계 검증
    const validateEmailVerification = async () => {
        if (isEmailVerified) {
            setSuccess("");
            return true;
        }
        setError("이메일 인증을 먼저 완료해주세요.");
        return false;
    };

    // Step 4-1: PIN 번호 등록 및 검증 -> PinStep에서 사용
    const registerPin = async () => {
        try {
            if(mode === 'first'){
                const response = await nextClient.post('/store/registration/pinnumbercheck', {
                    email: verificationData.email,
                    pinNumber: verificationData.pinNumber
                });

                if (response.data) {
                    setError("");
                    setIsPinVerified(true);
                    return true;
                }
            } else {
                // 추가 등록용 PIN 확인 - pinNumber만 전송
                const response = await nextClient.post('/store/registration/additionalemailcheck',{
                    pinNumber: verificationData.pinNumber
                })

                if(response.data){
                    setError("");
                    setIsPinVerified(true);
                    return true;
                }
            }
        } catch (error) {
            setError(error.response.data.error);
            return false;
        }
    };

  
    // Step 5: 최종 가게 등록
    const finalizeRegistration = async (onClose, onSuccess) => {
        try {
            setIsSubmitting(true);
            console.log("최초가게등록 next-server로 요청할 데이터", formData)
            const response = await nextClient.post('/store/registration/final-registration', {
                ...formData,
                // location과 coordinates는 주소 입력 시 설정됨
            });
            
            if (response.data) {
                setError("");
                setSuccess("가게 등록에 성공했습니다!")
                setTimeout(() => {
                    if(onSuccess){
                        onSuccess();
                    }
                    if (onClose) {
                        onClose();
                    }
                    setIsSubmitting(false);
                }, 1000); // 2초 후 모달 닫기
                return true;
            }
        
        } catch (error) {
            setError(error.response.data.error);
            setIsSubmitting(false);
            return false;
        }
    };

    //  사업장 수정 API 호출 함수
    const updateStoreInfo = async (onClose, onSuccess) => {
        try{
            setIsSubmitting(true);
            const { id, businessNumber, bankCode, ...filteredFormData } = formData;

            console.log("가게 정보 수정 요청 데이터", filteredFormData);

            const response = await nextClient.put(`/store/edit?storeid=${id}`, {
                ...filteredFormData
            })

            if (response.data) {
                setError("");
                setSuccess("가게 정보가 수정되었습니다!");
                setTimeout(() => {
                    if(onSuccess) onSuccess();
                    if(onClose) onClose();
                    setIsSubmitting(false);
                }, 1000);
                return true;
            }
        } catch(error){
            setError(error.response.datass.error || "수정 중 오류가 발생했습니다");
            setIsSubmitting(false);
            return false;
        }
    }

    // 모든 필수 데이터 검증 함수
    const validateAllData = () => {
        console.log(formData)
        const requiredFields = {
            storeName: formData.storeName,
            businessNumber: formData.businessNumber,
            accountNumber: formData.accountNumber,
            bankCode: formData.bankCode,
            location: formData.location,
            latitude: formData.latitude,
            longitude: formData.longitude
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            setError(`다음 항목을 모두 입력해주세요: ${emptyFields.join(', ')}`);
            return false;
        }
        return true;
    };

    // Edit 모드에서만 사용하는 데이터 검증 함수
    const validateEditData = () => {
        console.log(formData);
        const requiredFields = {
            storeName: formData.storeName,
            accountNumber: formData.accountNumber,
            location: formData.location,
            latitude: formData.latitude,
            longitude: formData.longitude,
        };

        const emptyFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (emptyFields.length > 0) {
            setError(`다음 항목을 모두 입력해주세요: ${emptyFields.join(', ')}`);
            return false;
        }
        return true;
    };

    return (
        <RegistrationContext.Provider value={{
            mode,
            formData,
            setFormData,
            currentStep,
            setCurrentStep,
            steps,
            verificationData,
            setVerificationData,
            validateBusinessInfo,
            validateAccount,
            verifyEmailCode,
            registerPin,
            sendVerificationEmail,
            finalizeRegistration, // 모든 함수 포함
            isEmailSent,
            setIsEmailSent,
            error,
            setError,
            validateEmailVerification,
            isEmailVerified,
            isPinVerified,
            validateAllData,
            success,
            isEmailErrored,
            isEmailNumSuccess,
            isSubmitting,
            updateStoreInfo,
            storeId,
            initializeEditStore,
            validateEditData
        }}>
            {children}
        </RegistrationContext.Provider>
    )
}


export const useRegistration = () => useContext(RegistrationContext)