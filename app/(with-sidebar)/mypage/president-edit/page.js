'use client';

import { useState } from 'react';
import styles from './page.module.css';

const ProfileEdit = () => {
  const [userData, setUserData] = useState({
    name: '임지혁 사장님',
    email: 'alexrawles@gmail.com',
    birthDate: '1999년 10월 20일',
    phone: '010-7611-4338'
  });

  const [businesses, setBusinesses] = useState([
    { name: '백다방', id: '#12548796', account: '1002-850-391601', rank: 3 },
    { name: '설렁탕', id: '#12548796', account: '1002-850-391601', rank: 2 },
    { name: '떡볶이', id: '#12548796', account: '1002-850-391601', rank: 1 }
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <button className={styles.activeTab}>프로필 편집</button>
        <button>알람 설정</button>
        <button>비밀번호 변경</button>
      </div>

      <div className={styles.profileSection}>
        <h3>임지혁 사장님</h3>
        <p className={styles.email}>{userData.email}</p>

        <div className={styles.infoBox}>
          <div className={styles.infoRow}>
            <span>생년월일</span>
            <span>{userData.birthDate}</span>
            <button className={styles.editButton}>생년월일 변경</button>
          </div>
          <div className={styles.infoRow}>
            <span>전화번호</span>
            <span>{userData.phone}</span>
            <button className={styles.editButton}>전화번호 변경</button>
            <button className={styles.verifyButton}>저장</button>
          </div>
        </div>
      </div>

      <div className={styles.businessSection}>
        <h3>보유하신 사업장</h3>
        <table className={styles.businessTable}>
          <thead>
            <tr>
              <th>사업장 상호명</th>
              <th>사업자 번호</th>
              <th>계좌번호</th>
              <th>직원 수</th>
              <th>편집 / 삭제</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((business, index) => (
              <tr key={index}>
                <td>{business.name}</td>
                <td>{business.id}</td>
                <td>{business.account}</td>
                <td>{business.rank}</td>
                <td>
                  <button className={styles.editBtn}>편집</button>
                  <button className={styles.deleteBtn}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileEdit;