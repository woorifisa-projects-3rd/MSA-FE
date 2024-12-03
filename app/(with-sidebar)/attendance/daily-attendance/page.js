'use client';

import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import DefaultTable from '@/components/table/DefaultTable';
import { useEffect, useState} from 'react';
import { nextClient } from '@/lib/nextClient';

// 렌더링 전 서버에서 데이터 가져오기
async function fetchData(selectedDate) {
  let formattedList = [];
  
  if(selectedDate){
    try{
      const response = await nextClient.get(
        `/attendance/daily-attendance?storeid=1&commutedate=${selectedDate}`
      );
      console.log("client가 next-servr로부터 받은 data",response)
      
      formattedList = response.data.map((item, index) => ({
        no: (index + 1).toString().padStart(2, '0'),
        name: item.name,
        startTime: item.startTime.substring(11, 16),
        endTime: item.endTime.substring(11, 16),
        totalHours: item.totalHours,
        salary: `${item.salary}원`,
      }));
    } catch(error){
      console.error('서버에서 데이터를 가져오는 중 오류 발생:', error);
    }
  }
      
  return formattedList

}

export default function Form({searchParams}) {
  const selectedDate = searchParams?.date || null;
  const [attendanceList, setAttendanceList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [formData, setFormData] = useState({});
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

  // 데이터를 초기화합니다.
  useEffect(() => {
    fetchData(selectedDate).then(setAttendanceList);
  }, [selectedDate]);

  // 여기부터 출퇴근 기록 추가 post 요청 관련 함수
  const handleFormChange = (updatedData) => {
    setFormData(updatedData);
  };


  // post 요청은 ssr 이후에 처리 
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