import React from 'react';
import styles from './button.module.css';

export default function Button({
    text,
    color,
    textColor,
    size = 'medium',
    type = 'custom',
}) {
    // 버튼 스타일을 동적으로 설정
    const buttonStyle = {
        backgroundColor: type === 'custom' ? color : undefined,
        color: type === 'custom' ? textColor : undefined,
    };

    // 버튼의 클래스 이름을 동적으로 설정
    const buttonClass = `${styles.button} ${styles[size]} ${
        type === 'submit'
            ? styles['btn-submit']
            : type === 'cancel'
            ? styles['btn-cancel']
            : type === 'outline'
            ? styles['btn-outline']
            : ''
    }`;

    return (
        <button className={buttonClass} style={buttonStyle}>
            {text}
        </button>
    );
}
