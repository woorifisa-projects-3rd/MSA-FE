'use client';

import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import DefaultTable from '@/components/table/DefaultTable';
import { useState } from 'react';


export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const tableHeaders = {
    no: "No.",
    name: "직원이름",
    startTime: "출근시간",
    endTime: "퇴근시간", 
    totalHours: "총 근무시간",
    salary: "급여금액",
    edit: "수정",
    delete: "삭제"
};

const list = [
  {
      no: "01",
      name: "정성윤",
      startTime: "14:00",
      endTime: "18:04",
      totalHours: "04:04",
      salary: "38000원",
  },
  {
      no: "02",
      name: "류혜리",
      startTime: "08:58",
      endTime: "15:03",
      totalHours: "06:05",
      salary: "60000원",
  },
  {
      no: "02",
      name: "류혜리",
      startTime: "08:58",
      endTime: "15:03",
      totalHours: "06:05",
      salary: "60000원",
  },
  {
      no: "02",
      name: "류혜리",
      startTime: "08:58",
      endTime: "15:03",
      totalHours: "06:05",
      salary: "60000원",
  },
  {
      no: "02",
      name: "류혜리",
      startTime: "08:58",
      endTime: "15:03",
      totalHours: "06:05",
      salary: "60000원",
  }
];

 
  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        출퇴근 기록 추가 모달 오픈
      </button>

      {/*등록 모달*/}
      <ModalContainer
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        title="출퇴근 기록 추가하기"
      >
        <AttendanceModalBody/>
      </ModalContainer>

      {/* 수정 모달 */}
      <ModalContainer
                title="출퇴근 기록 수정하기"
                isOpen={isEditModalOpen}
                onClose={()=>setEditModalOpen(false)}
                onConfirm={()=>console.log("나중에 submit 할 것")}
            >
              <AttendanceModalBody mode='edit' attendanceData={selectedAttendance} />
      </ModalContainer>

      <DefaultTable tableName="출퇴근 조회" tableHeaders={tableHeaders} list={list}/>
   
    </>
  );
}