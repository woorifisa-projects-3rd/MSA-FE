'use client';

import PrimaryButton from '@/components/button/primary-button';
import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import DefaultTable from '@/components/table/DefaultTable';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { nextClient } from '@/lib/nextClient';
import DeleteModal from '@/components/modal/delete-commute-modal/delete-commute-modal';

export default function Form() {
 const [isModalOpen, setIsModalOpen] = useState(false); 
 const [isEditModalOpen, setEditModalOpen] = useState(false);
 const [selectedAttendance, setSelectedAttendance] = useState(null);
 const [totalWorkHours, setTotalWorkHours] = useState(''); 
 const searchParams = useSearchParams();
 const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
 const [isLoading, setIsLoading] = useState(false);
 const [formError, setFormError] = useState(''); 
 const [formData, setFormData] = useState({});
 const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCommuteid, setDeleteCommuteid] = useState(null);

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

 const [attendanceList, setAttendanceList] = useState([]);

 const fetchDailyAttendance = async () => {
   try {
     const response = await nextClient.get(
       `/attendance/daily-attendance?storeid=1&commutedate=${selectedDate}`
     );
     
     const formattedList = response.data.map((item, index) => ({
      no: (index + 1).toString().padStart(2, '0'),
      name: item.name,
      startTime: item.startTime.substring(11, 16),
      endTime: item.endTime ? item.endTime.substring(11, 16) : "미퇴근",
      totalHours: item.totalHours,
      salary: `${item.salary}원`,
      delete: (
        <button onClick={() => handleDelete(item.commuteId)}>삭제</button>
      )
    }));
     
     setAttendanceList(formattedList);
   } catch (error) {
     console.error('Error fetching daily attendance:', error);
   }
 };

 useEffect(() => {
   if (selectedDate) {
     fetchDailyAttendance();
   }
 }, [selectedDate]);

 const calculateWorkHours = (startTime, endTime, date) => {
   if (!startTime || !endTime || !date) return '';

    // 시간을 24시간 형식의 분으로 변환하는 helper 함수
    const timeToMinutes = (time) => {
      let [hours, minutes] = time.split(':').map(Number);
      // 오전 12시는 24시로 변환
      if (hours === 0) hours = 24;
      return hours * 60 + minutes;
    };

  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  // 퇴근시간이 출근시간보다 작으면 invalid 반환
  if (endMinutes < startMinutes) {
    return 'invalid';
  }

  // 시간 차이 계산
  const diffInMinutes = endMinutes - startMinutes;
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
 };

 const isDateValid = (date) => {
  const today = new Date();
  const selectedDate = new Date(date);

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  
  // Date 객체를 timestamp로 변환하여 비교
  return selectedDate.getTime() <= today.getTime();
};

 const validateForm = (data) => {
   // 직원 선택 검사
   if (!data.storeemployeeId) {
     setFormError('직원을 선택해주세요');
     return false;
   }

   // 날짜 검사
   if (!data.date) {
     setFormError('날짜를 선택해주세요');
     return false;
   } 
   
   if (!isDateValid(data.date)) {
     setFormError('오늘 이후의 날짜는 선택할 수 없습니다');
     return false;
   }

   // 출근시간 검사
   if (!data.startTime) {
     setFormError('출근시간을 입력해주세요');
     return false;
   }

   // 퇴근시간이 있는 경우 유효성 검사
   if (data.endTime) {
     const workHours = calculateWorkHours(
       data.startTime,
       data.endTime,
       data.date
     );
     if (workHours === 'invalid') {
       setFormError('퇴근시간은 출근시간보다 빠를 수 없습니다');
       return false;
     }
   }

   setFormError('');  // 모든 검증 통과
   return true;
 };

 const handleFormChange = (updatedData) => {
   setFormData(updatedData);

   if (
    (updatedData.storeemployeeId && formError === '직원을 선택해주세요') ||
    (updatedData.date && (formError === '날짜를 선택해주세요' || formError === '오늘 이후의 날짜는 선택할 수 없습니다')) ||
    (updatedData.startTime && formError === '출근시간을 입력해주세요') ||
    (updatedData.endTime && formError === '퇴근시간은 출근시간보다 빠를 수 없습니다')
    ) {
    setFormError('');
    }

    setFormData(updatedData);

   // 근무시간 계산 (퇴근시간이 있는 경우만)
   if (updatedData.startTime && updatedData.endTime && updatedData.date) {
     const workHours = calculateWorkHours(
       updatedData.startTime,
       updatedData.endTime,
       updatedData.date
     );
     if (workHours !== 'invalid') {
       setTotalWorkHours(workHours);
     } else {
       setTotalWorkHours('');
     }
   } else {
     setTotalWorkHours('');
   }
 };

 const handleDelete = (commuteid) => {
  setDeleteCommuteid(commuteid);
  setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await nextClient.delete(`/attendance/daily-attendance?commuteid=${deleteCommuteid}`);
      if (response.data.success) {
        console.log(response.data.message);
        await fetchDailyAttendance();
      } else {
        console.error(response.data.message);
      }
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting commute:', error);
    }
  };

 const handleSubmit = async () => {
   // 유효성 검사 실행
   if (!validateForm(formData)) {
     return; // 유효성 검사 실패시 여기서 중단
   }

   setIsLoading(true);

   const formattedStartTime = `${formData.date}T${formData.startTime}:00`;
   const formattedEndTime = formData.endTime 
     ? `${formData.date}T${formData.endTime}:00` 
     : null;

   const requestData = {
     startTime: formattedStartTime,
     endTime: formattedEndTime,
     commuteDate: formData.date
   };

   try {
     console.log("api/attendance/commute next server로 보내는 데이터:", requestData)
     
     const response = await nextClient.post(
       `/attendance/commute?seid=${formData.storeemployeeId}`, 
       requestData
     );

     console.log("등록 성공:", response.data);
     
     setIsModalOpen(false);
     setFormData({});
     setFormError('');
     window.location.reload();

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

     <ModalContainer
       isOpen={isModalOpen}
       onClose={() => {
         setIsModalOpen(false);
         setFormError('');
         setFormData({});
       }}
       title="출퇴근 기록 추가하기"
       onConfirm={handleSubmit}
     >
       <AttendanceModalBody 
         mode="create" 
         onChange={handleFormChange}
         maxDate={new Date().toISOString().split('T')[0]}
       />
       {totalWorkHours && (
         <div className="mt-4 text-sm">
           총 근무시간: {totalWorkHours}
         </div>
       )}
       {formError && (
         <div className="mt-4 text-sm text-red-500">
           {formError}
         </div>
       )}
     </ModalContainer>

     <ModalContainer
       title="출퇴근 기록 수정하기"
       isOpen={isEditModalOpen}
       onClose={()=>setEditModalOpen(false)}
       onConfirm={()=>console.log("나중에 submit 할 것")}
     >
       <AttendanceModalBody mode='edit' attendanceData={selectedAttendance} />
     </ModalContainer>

     <DefaultTable 
       tableName="출퇴근 조회" 
       tableHeaders={tableHeaders} 
       list={attendanceList}
     />

    <DeleteModal
      isOpen={isDeleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onDelete={handleDeleteConfirm}
      commuteid={deleteCommuteid}
    />
   </>
 );
}