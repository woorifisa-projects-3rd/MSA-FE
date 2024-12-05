'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation';
import classes from "./calendar-wrapper.module.css";
import "./calendar.css";
import { nextClient } from '@/lib/nextClient';
import { useAuth } from '@/contexts/AuthProvider';

export default function Calendar() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null); // 선택된 월 상태 추가
  const [selectedMonth, setSelectedMonth] = useState(null); // 선택된 월 상태 추가
  const { storeId } = useAuth(); // storeId 가져오기

  // 특정 달 데이터 가져오기
  const fetchMonthlyData = async (year, month) => {
    if (!storeId) return; // storeId가 없을 경우 종료
    try {
      const response = await nextClient.get(`/attendance/calendar?storeid=${storeId}&year=${year}&month=${month}`);
      const data = response.data;
      console.log("Fetched data:", data);

      // API 데이터 -> 캘린더 이벤트 데이터로 변환
      const calendarEvents = data.map(item => ({
        id: String(item.id || Math.random()), // 고유 ID
        title: item.name, // 직원 이름
        date: item.commuteDate, // 날짜
        backgroundColor: item.status === '퇴근완료' ? '#808080' : '#8CD3C5',
        borderColor: item.status === '퇴근완료' ? '#808080' : '#8CD3C5',
      }));
      setEvents(calendarEvents); // 이벤트 상태 업데이트
    } catch (error) {
      console.error('Failed to fetch monthly data:', error);
    }
  };

  // FullCalendar 날짜 범위 변경 이벤트 핸들러
  const handleDatesSet = (dateInfo) => {
    const startDate = dateInfo.view.currentStart;
    const year = startDate.getFullYear(); // 연도
    const month = startDate.getMonth() + 1; // 0부터 시작하므로 +1 필요
    console.log(`Year: ${year}, Month: ${month}`); // 디버깅 로그

    setSelectedYear(year);
    setSelectedMonth(month);
    fetchMonthlyData(year, month); // 올바른 월 값으로 데이터 가져오기
  };

  // 날짜 선택 시 페이지로 이동
  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr; // 선택된 날짜 (YYYY-MM-DD 형식)
    console.log(`Selected date: ${selectedDate}`);
    router.push(`/attendance/daily-attendance?date=${selectedDate}`);
  };

  // storeId 변경 시 현재 달 데이터 로드
  useEffect(() => {
    console.log('storeId:', storeId);
    if (!storeId) return; // storeId가 없을 경우 실행하지 않음
    setEvents([]); // storeId 변경 시 이전 이벤트 초기화
    const today = new Date();

    // 만약 selectedYear와 selectedMonth가 설정되어 있다면, 해당 연도와 월에 맞춰서 데이터 로드
    if (selectedYear && selectedMonth) {
      fetchMonthlyData(selectedYear, selectedMonth);
    } else {
      // selectedYear나 selectedMonth가 없으면 현재 연도와 월 데이터 로드
      fetchMonthlyData(today.getFullYear(), today.getMonth() + 1); // 현재 월에 +1 추가
    }
  }, [storeId, selectedYear, selectedMonth]); // storeId, selectedYear, selectedMonth가 변경될 때마다 실행

  return (
    <div className={classes.calendarWrapper}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: '',
          center: 'prev title next',
          right: ''
        }}
        editable={true}
        selectable={true}
        events={events} // 이벤트 데이터 설정
        datesSet={handleDatesSet} // 날짜 범위 변경 이벤트 연결
        select={handleDateSelect} // 날짜 선택 이벤트 연결
        locale="ko" // 한글화
        dayMaxEvents={6} // 최대 표시 이벤트 수 제한
        showNonCurrentDates={false} // 현재 달 외의 날짜를 숨김
      />
    </div>
  );
}
