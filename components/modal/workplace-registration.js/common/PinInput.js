import { useState } from "react";
import styles from "../BusinessRegistration.module.css";

export default function PinInput(){
    const [pin, setPin] = useState(['', '', '', '', '', '']);

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
          const newPin = [...pin];
          newPin[index] = value;
          setPin(newPin);
          
          if (value && index < 5) {
            document.querySelector(`input[name=pin-${index + 1}]`)?.focus();
          }
          
          if (index === 5 && value) {
          }
        }
      };

    return(
        <div className={styles.pinContainer}>
            {pin.map((digit, index) => (
                <input
                key={index}
                type="password"
                name={`pin-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength={1}
                />
            ))}
        </div>
    )
}