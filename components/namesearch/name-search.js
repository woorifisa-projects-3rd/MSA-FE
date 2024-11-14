import React from 'react';
import styles from './name-search.module.css'

export default function NameSearch({ onChange }) {
    return (
        <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
                type="text" 
                className={styles.searchInput} 
                placeholder="이름으로 검색" 
                onChange={onChange}
            />
        </div>
    );
}
