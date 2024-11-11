import React from 'react';
import styles from './button.module.css';


export default function Button({text,color,textColor,
    width, height, size ,type, onClick}) {

        const buttonStyle = type === 'custom' ? {
            backgroundColor: color,
            color: textColor,
            width: width,
            height: height
        } : undefined;

        const typeStyles = {
            submit: styles['btn-submit'],
            cancel: styles['btn-cancel'],
            outline: styles['btn-outline'],
            custom: ''
        };

        const buttonClass = `${styles.button} ${size ? styles[size] : ''} ${typeStyles[type]}`;

        return (
            <button className={buttonClass} style={buttonStyle} onClick={onClick}>
                {text}
            </button>
        );

}
