import React, { useState } from 'react';
import styles from './selector.module.css';

export default function MonthSelector({ onMonthChange }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}년 ${month}월`;
    };

    // 이전 달로 이동
    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        setCurrentDate(prevMonth);
        onMonthChange(prevMonth);
    };

    // 다음 달로 이동
    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setCurrentDate(nextMonth);
        onMonthChange(nextMonth);
    };

    return (
        <div className={styles.container}>
            <button onClick={handlePrevMonth} className={styles.navButton}>◀</button>
            <span className={styles.dateText}>{formatDate(currentDate)}</span>
            <button onClick={handleNextMonth} className={styles.navButton}>▶</button>
        </div>
    );
}
