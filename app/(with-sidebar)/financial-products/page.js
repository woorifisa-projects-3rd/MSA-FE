// app/(with-sidebar)/financial-products/page.js
'use client';

import { financeProducts } from '@/constants/finance-product';
import styles from './page.module.css';
import NameSearch from '@/components/namesearch/name-search';
import { useState } from 'react';

const FinanceProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleApplyClick = (url) => {
    window.open(url, '_blank');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = financeProducts.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className={styles.container}>
      <div className={styles.contentHeader}>
        <h1 className={styles.title}>소상공인 맞춤형 금융 상품</h1>
        <p className={styles.subtitle}>
          소상공인을 위한 특별 지원 프로그램!<br/>
          창업자금, 재정 지원 서비스로 안정적인 사업 운영을 도와드립니다.
        </p>
        <NameSearch onChange={handleSearchChange} placeholder="상품명으로 검색"/>
      </div>

      <div className={styles.productGrid}>
        {filteredProducts.map((product, index) => (
          <div key={index} className={styles.productCard}>
            <div className={styles.productHeader}>
              <div className={styles.titleGroup}>
                <h2>{product.title}</h2>
                <p className={styles.subtitle}>{product.subtitle}</p>
              </div>
              <button 
                className={styles.applyButton}
                onClick={() => handleApplyClick(product.url)}
              >
                문의하러 가기
              </button>
            </div>
            
            <div className={styles.productInfo}>
              <div className={styles.infoRow}>
                <span className={styles.label}>대상</span>
                <span className={styles.value}>{product.target}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>한도</span>
                <span className={styles.value}>{product.limit}</span>
              </div>
              
              <div className={styles.infoRow}>
                <span className={styles.label}>기간</span>
                <span className={styles.value}>{product.term}</span>
              </div>

              {product.interestRate && (
                <div className={styles.infoRow}>
                  <span className={styles.label}>금리</span>
                  <div className={styles.rateTable}>
                    {product.interestRate.map((rate, i) => (
                      <div key={i} className={styles.rateRow}>
                        {rate.period && <span>{rate.period}</span>}
                        {rate.amount && <span>{rate.amount}</span>}
                        <span className={styles.rateValue}>{rate.rate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.tags}>
                {product.loanTypes.map((type, i) => (
                  <span key={i} className={styles.tag}>{type}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FinanceProducts;