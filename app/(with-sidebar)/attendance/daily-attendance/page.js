'use client';

import PrimaryButton from '@/components/button/primary-button';
import AttendanceModalBody from '@/components/modal/attendance-modal/attendance-modal-body';
import ModalContainer from '@/components/modal/modal-container';
import DefaultTable from '@/components/table/DefaultTable';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { nextClient } from '@/lib/nextClient';
import DeleteModal from '@/components/modal/delete-commute-modal/delete-commute-modal';
import BaseButton from '@/components/button/base-button';
import classes from "./page.module.css";

export default function Form() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState(null);
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({});
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteCommuteId, setDeleteCommuteId] = useState(null);

  const tableHeaders = {
    no: 'No.',
    name: '직원이름',
    startTime: '출근시간',
    endTime: '퇴근시간',
    totalHours: '총 근무시간',
    salary: '급여금액',
    edit: '수정',
    delete: '삭제',
  };

  const [attendanceList, setAttendanceList] = useState([]);

  const timeToMinutes = (time) => {
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 0) hours = 24;  // 00:00은 24:00으로 처리
    return hours * 60 + minutes;
  };
  

  const isDateValid = (date) => {
    const today = new Date();
    const selectedDate = new Date(date);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() <= today.getTime();
  };

  const validateForm = (data, mode = 'create') => {
    // 수정 모드에서는 직원 ID와 날짜가 항상 있어야 하므로 검사를 생략
    if (mode === 'create' && !data.storeemployeeId) {
      setFormError('직원을 선택해주세요');
      return false;
    }
  
    const checkDate = data.date || data.commuteDate;
    if (!checkDate) {
      setFormError('날짜를 선택해주세요');
      return false;
    }
  
    if (!isDateValid(checkDate)) {
      setFormError('오늘 이후의 날짜는 선택할 수 없습니다');
      return false;
    }
  
    if (!data.startTime) {
      setFormError('출근시간을 입력해주세요');
      return false;
    }
  
    if (data.endTime) {
      const startMinutes = timeToMinutes(data.startTime);
      const endMinutes = timeToMinutes(data.endTime);
    
      // 종료 시간이 시작 시간보다 빠르다면 유효하지 않다고 판단
      if (endMinutes < startMinutes && data.endTime !== '00:00') {
        setFormError('퇴근 시간이 출근 시간보다 빠를 수 없습니다');
        return false;
      }
    }
  
    setFormError('');
    return true;
  };
  
  
  const handleFormChange = (updatedData) => {
    if (
      (updatedData.storeemployeeId && formError === '직원을 선택해주세요') ||
      (updatedData.date && (formError === '날짜를 선택해주세요' || formError === '오늘 이후의 날짜는 선택할 수 없습니다')) ||
      (updatedData.startTime && formError === '출근시간을 입력해주세요') ||
      (updatedData.endTime && formError === '퇴근시간은 출근시간보다 빠를 수 없습니다')
    ) {
      console.log("에러");
      setFormError('');
    }

    setFormData(updatedData);
  };
  const fetchDailyAttendance = async () => {
    try {
      const response = await nextClient.get(
        `/attendance/daily-attendance?storeid=1&commutedate=${selectedDate}`
      );
  
      const formattedList = response.data.map((item, index) => ({
        no: (index + 1).toString().padStart(2, '0'),
        name: item.name,
        storeemployeeId: item.storeemployeeId,  // 직원 ID 추가
        commuteId: item.commuteId,  // 출퇴근 기록 ID 추가
        startTime: item.startTime.substring(11, 16),
        endTime: item.endTime ? item.endTime.substring(11, 16) : '미퇴근',
        totalHours: item.totalHours,
        salary: `${item.salary}원`,
        commuteDate: item.commuteDate || selectedDate,  // 날짜 정보 추가
        edit: (
          <PrimaryButton onClick={() => handleEditClick(item)} text="수정"/>
        ),
        delete: (
          <PrimaryButton onClick={() => handleDelete(item.commuteId)} text="삭제"/>
        ),
      }));
  
      setAttendanceList(formattedList);
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
    }
  };


  const handleSubmit = async () => {
    console.log("제출 전 폼 데이터:", formData); // 데이터 확인용 로그
  
    if (!validateForm(formData)) {
      console.log("폼 검증 실패:", formError); // 실패한 검증 내용 로그
      return;
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
      console.log("서버로 전송할 데이터:", requestData);
      
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
      console.error("서버 요청 중 오류 발생:", error.response?.data || error.message); 
      setFormError('데이터 저장 중 오류가 발생했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (item) => {
    console.log("Edit 버튼 클릭 시, item:", item);
  
    const editData = {
      commuteId: item.commuteId,  // 수정된 id로 설정
      name: item.name,
      date: item.startTime.substring(0, 10),
      startTime: item.startTime.substring(11, 16),
      endTime: item.endTime ? item.endTime.substring(11, 16) : ''
    };
  
    setEditModalData(editData);
    setEditModalOpen(true);
  };
  
  const handleEditSubmit = async () => {
    console.log("수정 전 폼 데이터:", editModalData);
  
    // 수정 폼 검증
    if (!validateForm(editModalData, 'edit')) {
      console.log("수정 폼 검증 실패:", formError); // 실패한 검증 내용 로그
      return;
    }
  
    const requestData = {
      startTime: editModalData.date + 'T' + editModalData.startTime + ':00',
      endTime: editModalData.endTime
        ? editModalData.date + 'T' + editModalData.endTime + ':00'
        : null,
      commuteDate: editModalData.date
    };
  
    console.log("서버로 보낼 데이터:", requestData, "id", editModalData.commuteId);
  
    try {
      const response = await nextClient.put(
        `/attendance/commute?commuteid=${editModalData.commuteId}`,
        requestData
      );
  
      if (response.data.success) {
        console.log('수정 성공:', response.data.message);
        await fetchDailyAttendance();
        setEditModalOpen(false);
        setFormError('');
      } else {
        console.error('수정 실패:', response.data.message);
      }
    } catch (error) {
      console.error("수정 중 오류 발생:", error.response?.data || error.message);
      setFormError('수정 중 오류가 발생했습니다');
    }
  };
  
  
  const handleDelete = (commuteId) => {
    setDeleteCommuteId(commuteId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await nextClient.delete(
        `/attendance/daily-attendance?commuteid=${deleteCommuteId}`
      );
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

  useEffect(() => {
    if (selectedDate) {
      fetchDailyAttendance();
    }
  }, [selectedDate]);

  return (
    <>
      <div className={classes.attendanceHeader}>
        <div className={classes.selectedDate}>{selectedDate}</div>
        <BaseButton onClick={() => setIsModalOpen(true)} text="기록 추가"/>
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
          error={formError}
        />
      </ModalContainer>

      <ModalContainer
        title="출퇴근 기록 수정하기"
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setFormError('');
        }}
        onConfirm={handleEditSubmit}
      >
        <AttendanceModalBody 
          mode="edit" 
          attendanceData={editModalData} 
          onChange={(updatedData) => {
            setEditModalData(updatedData);
          }} 
          error={formError}
        />
      </ModalContainer>

      <DefaultTable
        tableHeaders={tableHeaders}
        list={attendanceList}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleDeleteConfirm}
        deleteId={deleteCommuteId}
        title="출퇴근 기록 삭제"
        text="해당 출퇴근 기록을 정말 삭제하시겠습니까?"
      />
    </>
  );
}