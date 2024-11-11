'use client';

import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import { useState } from 'react';


export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        출퇴근 기록 추가 모달 오픈
      </button>
      <ModalContainer
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        title="출퇴근 기록 추가하기"
      >
        <AttendanceModalBody/>
      </ModalContainer>
   
    </>
  );
}