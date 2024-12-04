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

const statusColors = {
  '퇴근완료': '#808080',  // 회색
  '출근중': '#8CD3C5',    // 초록색
  '미퇴근': '#FF6B6B',    // 빨간색
};

export default function Calendar() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const { storeId } = useAuth(); // storeId 가져오기

  // 특정 달 데이터 가져오기
  const fetchMonthlyData = async (year, month) => {
    try {
      const response = await nextClient.get(`/attendance/calendar?storeid=${storeId}&year=${year}&month=${month}`);
      const data = response.data;
      console.log("Fetched data:", data);

      // API 데이터 -> 캘린더 이벤트 데이터로 변환
      const calendarEvents = data.map(item => ({
        id: String(item.id || Math.random()), // 고유 ID
        title: item.name, // 직원 이름
        date: item.commuteDate, // 날짜
        backgroundColor: statusColors[item.status] || statusColors['퇴근완료'], // 기본값은 퇴근완료
        borderColor: statusColors[item.status] || statusColors['퇴근완료']
      }));
      setEvents(calendarEvents);
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
    fetchMonthlyData(year, month); // 올바른 월 값으로 데이터 가져오기
  };


  // 날짜 선택 시 페이지로 이동
  const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr; // 선택된 날짜 (YYYY-MM-DD 형식)
    console.log(`Selected date: ${selectedDate}`);
    router.push(`/attendance/daily-attendance?date=${selectedDate}`);
  };

  // 초기 렌더링 시 현재 달 데이터 로드
  useEffect(() => {
    const today = new Date();
    fetchMonthlyData(today.getFullYear(), today.getMonth() + 1); // 현재 월에 +1 추가
  }, [storeId]);

  return (
    <div className={classes.calendarWrapper}>
      <div className={classes.legendContainer}>
       {Object.entries(statusColors).map(([status, color]) => (
         <div key={status} className={classes.legendItem}>
           <div 
             className={classes.colorBox} 
             style={{ backgroundColor: color }}
           />
           <span>{status}</span>
         </div>
       ))} </div>
      <div>
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
  events={events}
  datesSet={handleDatesSet}
  select={handleDateSelect}
  locale="ko"
  dayMaxEvents={3} // 한 셀에 최대 3개까지만 표시
  moreLinkContent={(args) => `+${args.num}  `} // 더보기 텍스트 커스텀
  moreLinkClick="popover" // 팝업으로 추가 이벤트 표시
  showNonCurrentDates={false}
  eventDisplay="block" // 블록 형태로 표시
  eventTimeFormat={{ // 시간 표시 형식
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false
  }}
/>
</div>
    </div>
  );

}
