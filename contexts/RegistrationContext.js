import {createContext, useContext, useState } from "react";
import { nextClient } from "@/lib/nextClient";

export const RegistrationContext = createContext();

export const RegistrationProvider = ({ children, mode = "first"}) => {
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

    const steps = mode === 'first' 
    ? ['business', 'account', 'verification', 'pin', 'address']
    : ['business', 'account', 'pin', 'address'];
    
    const [verificationData, setVerificationData] = useState({
        name: "",
        email: "",
        pinNumber: "",
        verificationCode : ""
    })

    const [isEmailSent, setIsEmailSent] = useState(false);


    // Step 1: 사업자 정보 확인 
    const validateBusinessInfo = async () => {
        try {
            const response = await nextClient.post('/store/registration/businesscheck', {
                businessNumber: formData.businessNumber,
                storeName: formData.storeName
            });
            console.log("요청 왔다.",businessNumber, storeName );
            
            if (response.data) {
                setCurrentStep(2);
                return true;
            }
            // setError("사업자 정보 검증에 실패했습니다.");
            return false;
        } catch (error) {
            // setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 2: 계좌 인증
    const validateAccount = async () => {
        try {
            // 계좌 인증 API 호출 (예시)
            const response = await nextClient.post('/store/registration/accountcheck', {
                bankCode: formData.bankCode,
                accountNumber: formData.accountNumber,
                
            });
            
            if (response.data) {
                setCurrentStep(3);
                return true;
            }
            // setError("계좌 인증에 실패했습니다.");
            return false;
        } catch (error) {
            // setError("서버 오류가 발생했습니다.");
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
                return setIsEmailSent(true);
            }
            // setError("인증 코드 발송에 실패했습니다.");
            return false;
        } catch (error) {
            // setError("서버 오류가 발생했습니다.");
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
            console.log("스프링에서 프론트까지 전달",response.data);
            if (response.data) {
                setCurrentStep(4);
                return true;
            }
           // setError("인증 코드가 일치하지 않습니다.");
            return false;
        } catch (error) {
            //setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 4: PIN 번호 등록
    const registerPin = async () => {
        try {
            const response = await nextClient.post('/store/registration/pinnumbercheck', {
                email: verificationData.email,
                pinNumber: verificationData.pinNumber
            });
            
            if (response.data) {
                setCurrentStep(5);
                return true;
            }
            setError("PIN 번호 등록에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };

    // Step 5: 최종 가게 등록
    const finalizeRegistration = async () => {
        try {
            const response = await nextClient.post('/user/store', {
                ...formData,
                // location과 coordinates는 주소 입력 시 설정됨
            });
            
            if (response.data) {
                // 등록 완료 처리
                return true;
            }
            setError("가게 등록에 실패했습니다.");
            return false;
        } catch (error) {
            setError("서버 오류가 발생했습니다.");
            return false;
        }
    };


    return (
        <RegistrationContext.Provider value={{
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
            setIsEmailSent
        }}>
            {children}
        </RegistrationContext.Provider>
    )
}


export const useRegistration = () => useContext(RegistrationContext)