'use client';

import PrimaryButton from '@/components/button/primary-button';
import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import DefaultTable from '@/components/table/DefaultTable';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { nextClient } from '@/lib/nextClient';

export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date'); // 쿼리 파라미터에서 날짜 추출
  const [isLoading, setIsLoading] = useState(false);

  

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

// api 요청시 받아올 데이터 - 현재는 더미데이터
  // const list = [
  //   {
  //       no: "01",
  //       name: "정성윤",
  //       startTime: "14:00",
  //       endTime: "18:04",
  //       totalHours: "04:04",
  //       salary: "38000원",
  //   },
  //   {
  //       no: "02",
  //       name: "류혜리",
  //       startTime: "08:58",
  //       endTime: "15:03",
  //       totalHours: "06:05",
  //       salary: "60000원",
  //   },
  //   {
  //       no: "02",
  //       name: "류혜리",
  //       startTime: "08:58",
  //       endTime: "15:03",
  //       totalHours: "06:05",
  //       salary: "60000원",
  //   },
  //   {
  //       no: "02",
  //       name: "류혜리",
  //       startTime: "08:58",
  //       endTime: "15:03",
  //       totalHours: "06:05",
  //       salary: "60000원",
  //   },
  //   {
  //       no: "02",
  //       name: "류혜리",
  //       startTime: "08:58",
  //       endTime: "15:03",
  //       totalHours: "06:05",
  //       salary: "60000원",
  //   }
  // ];


  // const changedList = list.map((list)=>({
  //  ...list,
  //  edit:(
  //   <PrimaryButton
  //     text="편집"
  //     onClick={() => {
  //       setSelectedAttendance(list)
  //       setEditModalOpen(true)
  //     }}
  //   />
  //  )
  // }))
  // 일별로 출퇴근한 데이터 조회 관련 state 및 함수
  const [attendanceList, setAttendanceList] = useState([]);

  const fetchDailyAttendance = async () => {
    try {
      const response = await nextClient.get(
        `/attendance/daily-attendance?storeid=1&commutedate=${selectedDate}`
      );

      console.log("client가 next-servr로부터 받은 data",response)
      
      // 받아온 데이터를 테이블 형식에 맞게 변환
      const formattedList = response.data.map((item, index) => ({
        no: (index + 1).toString().padStart(2, '0'),
        name: item.name,
        startTime: item.startTime.substring(11, 16), // "2024-11-20T14:00:00" -> "14:00"
        endTime: item.endTime.substring(11, 16),
        totalHours: item.totalHours,
        salary: `${item.salary}원`,
      }));

      
      setAttendanceList(formattedList);
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
    }
  };

  // 선택된 날짜가 변경될 때마다 데이터 새로 조회
  useEffect(() => {
    if (selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedDate]);


  // 출퇴근 기록 추가 POST 요청 관련 state 및 함수 
  const [formData, setFormData] = useState({});


  const handleFormChange = (updatedData) => {
    setFormData(updatedData);
  };


  const handleSubmit = async () => {
    setIsLoading(true);

     // 날짜와 시간을 조합하여 ISO 문자열 형식으로 변환
     const formattedStartTime = `${formData.date}T${formData.startTime}:00`;
     const formattedEndTime = `${formData.date}T${formData.endTime}:00`;

     const requestData = {
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      commuteDate: formData.date
    };
 
    try {
      console.log("api/attendance/commute next server로 보내는 데이터:", requestData)
      
      const response = await nextClient.post(`/attendance/commute?seid=${formData.storeemployeeId}`, requestData);

      console.log("등록 성공:", response.data);
      
      setIsModalOpen(false);
      setFormData({});

    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };


 

  return (
    <>
      <button onClick={() => setIsModalOpen(true)}>
        출퇴근 기록 추가 모달 오픈
      </button>
      <div>
        오늘 날짜 : {selectedDate}
      </div>

      {/*등록 모달*/}
      <ModalContainer
        isOpen={isModalOpen}
        onClose={()=>setIsModalOpen(false)}
        title="출퇴근 기록 추가하기"
        onConfirm={handleSubmit}
      >
        <AttendanceModalBody mode="create" onChange={handleFormChange} />
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

      <DefaultTable tableName="출퇴근 조회" tableHeaders={tableHeaders} list={attendanceList}/>
   
    </>
  );
}