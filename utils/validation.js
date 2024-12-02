// 에러 메시지
export const REQUIRED_ERROR = "필수 항목입니다.";
export const DATE_ERROR = "잘못된 날짜입니다.";
export const PAYMENT_DATE_ERROR = "1부터 28 사이의 숫자를 입력해주세요.";
export const EMAIL_ERROR = "유효한 이메일을 입력해주세요. 예) abc@gmail.com"
export const PHONE_ERROR = "유효한 전화번호를 입력해주세요. 예) 010-1111-2222 또는 01011112222";
export const PASSWORD_ERROR = '비밀번호는 최소 8자리로 특수문자(!@#$%^&*(),.?":{}|<></>), 숫자, 영문자를 포함해야 합니다.';
export const PASSWORD_MISMATCH_ERROR = "비밀번호가 일치하지 않습니다.";

// 유효성 검사 규칙
export const commonValidateRules = {
  required: (value) => (value ? "" : REQUIRED_ERROR),

  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ? ""
      : EMAIL_ERROR,

  phoneNumber: (value) =>
    /^(\d{3}\d{7,8}|\d{3}-\d{3,4}-\d{4})$/.test(value)
      ? ""
      : PHONE_ERROR,

  password: (value) =>
    /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[a-zA-Z])(?=.*\d).{8,}$/.test(value)
      ? ""
      : PASSWORD_ERROR,

  confirmPassword: (value, data) =>
    value === data.password ? "" : PASSWORD_MISMATCH_ERROR,

  birthDate: (value) => {
    const today = new Date().toISOString().split("T")[0];
    return value
      ? value < today
        ? ""
        : DATE_ERROR
      : REQUIRED_ERROR;
  },

  // address: (postcode, basicAddress) =>
  //   postcode && basicAddress ? "" : REQUIRED_ERROR,

  paymentDate: (value) =>
    value && value >= 1 && value <= 28 ? "" : PAYMENT_DATE_ERROR,
};

// 유효성 검사 함수
export const validateForm = (data, customRules = {}) => {
  const errors = {};
  const rules = { ...commonValidateRules, ...customRules }; // 커스텀 규칙 병합

  Object.keys(data).forEach((field) => {
    const value = data[field];
    const rule = rules[field];
    if (rule) {
      const error = typeof rule === "function" ? rule(value, data) : rule;
      if (error) errors[field] = error;
    }
  });

  return errors;
};
