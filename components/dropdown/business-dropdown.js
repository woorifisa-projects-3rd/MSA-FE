'use client'

import { useState } from 'react';
import styles from './business-dropdown.module.css';

const BusinessSelectDropdown = () => {
    const [selectedBusiness, setSelectedBusiness] = useState('짜글이집 상암IT타워점');
    const [isOpen, setIsOpen] = useState(false);

    const allBusinesses = [
        '짜글이집 상암IT타워점',
        '짜글이집 개봉점',
        '짜글이집 목동점', 
        '짜글이집 강남점'
    ];

    const filteredBusinesses = allBusinesses.filter(business => business !== selectedBusiness);

    const handleSelect = (business) => {
        setSelectedBusiness(business);
        setIsOpen(false);
    };

    return (
        <div className={styles.dropdown}>
            <button 
                className={`${styles.dropbtn} ${isOpen ? styles.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{selectedBusiness}</span>
                <span className={styles.arrow}>▼</span>
            </button>
            {isOpen && (
                <div className={styles.dropdownContent}>
                    {filteredBusinesses.map((business) => (
                        <div 
                            key={business}
                            onClick={() => handleSelect(business)}
                            className={styles.dropdownItem}
                        >
                            {business}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusinessSelectDropdown;