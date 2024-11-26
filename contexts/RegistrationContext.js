import {createContext, useContext, useState } from "react";

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

    return (
        <RegistrationContext.Provider value={{
            formData,
            setFormData,
            currentStep, 
            setCurrentStep,
            steps
        }}>
            {children}
        </RegistrationContext.Provider>
    )
}


export const useRegistration = () => useContext(RegistrationContext)