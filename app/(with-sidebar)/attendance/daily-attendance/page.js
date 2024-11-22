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
  const [editModalData, setEditModalData] = useState(null);
  const [totalWorkHours, setTotalWorkHours] = useState('');
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

  const fetchDailyAttendance = async () => {
    try {
      const response = await nextClient.get(
        `/attendance/daily-attendance?storeid=1&commutedate=${selectedDate}`
      );

      const formattedList = response.data.map((item, index) => ({
        no: (index + 1).toString().padStart(2, '0'),
        name: item.name,
        startTime: item.startTime.substring(11, 16),
        endTime: item.endTime ? item.endTime.substring(11, 16) : '미퇴근',
        totalHours: item.totalHours,
        salary: `${item.salary}원`,
        edit: (
          <button onClick={() => handleEditClick(item)}>수정</button>
        ),
        delete: (
          <button onClick={() => handleDelete(item.commuteId)}>삭제</button>
        ),
      }));

      setAttendanceList(formattedList);
    } catch (error) {
      console.error('Error fetching daily attendance:', error);
    }
  };

  const handleEditClick = (item) => {
    setEditModalData({
      ...item,
      startTime: item.startTime || '',
      endTime: item.endTime || '',
      commuteDate: item.commuteDate || new Date().toISOString().split('T')[0],
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {

      console.log("startime", editModalData.startTime );
      console.log("startime", editModalData.endTime);
      console.log("startime", editModalData.commuteDate );


      const response = await nextClient.put(
        `/attendance/commute?commuteid=${editModalData.commuteId}`,
        {
          startTime: editModalData.startTime,
          endTime: editModalData.endTime,
          commuteDate: editModalData.commuteDate,
        }
      );
  
      if (response.data.success) {
        console.log('수정 성공:', response.data.message);
        await fetchDailyAttendance();
        setEditModalOpen(false);
      } else {
        console.error('수정 실패:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating commute:', error.response?.data || error.message);
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
      <button onClick={() => setIsModalOpen(true)}>출퇴근 기록 추가 모달 오픈</button>
      <div>오늘 날짜: {selectedDate}</div>

      <ModalContainer
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError('');
          setFormData({});
        }}
        title="출퇴근 기록 추가하기"
        onConfirm={() => console.log('등록')}
      >
        <AttendanceModalBody
          mode="create"
          onChange={(data) => setFormData(data)}
        />
      </ModalContainer>

      <ModalContainer
        title="출퇴근 기록 수정하기"
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onConfirm={handleEditSubmit}
      >
        <AttendanceModalBody mode="edit" attendanceData={editModalData} />
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
        commuteId={deleteCommuteId}
      />
    </>
  );
}
