import React from 'react';
import styles from './name-search.module.css'

export default function NameSearch({ onChange, placeholder }) {
    return (
        <div className={styles.searchContainer}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
                type="text" 
                className={styles.searchInput} 
                placeholder={placeholder}
                onChange={onChange}
            />
        </div>
    );
}
