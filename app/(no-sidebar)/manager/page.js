'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { nextClient } from "@/lib/nextClient";
import PrimaryButton from '@/components/button/primary-button';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // /manager/check 요청을 보내 상태 코드를 확인
      const checkResponse = await nextClient.get('/manager/check');
      
      // 상태 코드가 200이 아닌 경우 /mypage로 리다이렉트
      if (checkResponse.data !== 200) {
        console.log('권한이 없습니다.');
        window.location.href = '/mypage';
        return;
      }
  
      // 상태 코드가 200일 경우, /manager 요청을 보내 데이터 가져오기
      const presidentsResponse = await nextClient.get('/manager');
      console.log('받아온 데이터: ', presidentsResponse.data);
      setUsers(presidentsResponse.data);  // 받아온 데이터로 상태 업데이트
  
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생: ', error);
      setUsers([]);  // 오류 발생 시 빈 배열 설정
    }
  };
  

  // 삭제 요청 처리
  const handleDeleteClick = async (presidentId) => {
    try {
      // DELETE 요청을 보냄
      const response = await nextClient.delete(`/manager`, {
        data: { presidentid: presidentId }, // JSON 본문에 presidentid 포함
      });
  
      if (response.data.success) {
        alert('사장님이 삭제되었습니다.');
        fetchUsers(); // 데이터 갱신
      } else {
        throw new Error(response.data.error || '사장님 삭제 실패');
      }
    } catch (error) {
      console.error('삭제 실패:', error.message);
      setError(error.response?.data?.error || error.message);
    }
  };
  

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>사용자</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>이메일</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.email}</td>
              <td>
              <PrimaryButton
                text="삭제"
                onClick={() => handleDeleteClick(user.presidentid)}
            />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}