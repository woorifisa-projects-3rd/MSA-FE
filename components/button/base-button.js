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
    ...props 
}) => {
  return (
    <button 
        className={`${styles.baseButton} ${className || ''}`} 
        type={type}
        onClick={onClick}
        style={{
          backgroundColor: backgroundColor,
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