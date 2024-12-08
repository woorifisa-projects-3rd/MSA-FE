'use client';

import styles from './button.module.css';

// 사용방법: baseButton에 커스텀 스타일을 추가하고 싶다면  props로 얼마든지 추가해도됨
// 사용예시  -> test/page.js 에서 확인 

const BaseButton = ({
    text, 
    onClick,
    type,
    backgroundColor = 'var(--main-orange)', 
    hoverColor = 'var(--light-orange)',
    className,
    disabled = false,
    ...props 
}) => {
  return (
    <button 
        className={`${styles.baseButton} ${className || ''}`} 
        type={type}
        onClick={onClick}
        style={{
          backgroundColor: disabled ? 'var(--disabled-gray)' : backgroundColor,  // 비활성화된 경우 스타일 변경
          cursor: disabled ? 'not-allowed' : 'pointer',  // 비활성화 시 커서 변경
          ...props
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = hoverColor}
        onMouseLeave={(e) => e.target.style.backgroundColor = backgroundColor}
      >
      {text}
    </button>
  );
};

export default BaseButton;