'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRouter } from 'next/navigation'; 
import classes from "./calendar-wrapper.module.css";
import "./calendar.css"
import { nextClient } from '@/lib/nextClient';
import { useAuth } from '@/contexts/AuthProvider';



export default function Calendar (){
  const router = useRouter(); // router 정의
  const [events, setEvents] = useState([]);

  const {storeId} = useAuth();

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  console.log(events);


  // API 호출 및 이벤트 가공
  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        console.log(storeId);
        const response = await nextClient.get(`/attendance/calendar?storeid=${storeId}&year=${currentYear}&month=${currentMonth}`);
        const data = response.data;
        console.log("client calendar data", data);

        // API 데이터 -> 캘린더 이벤트 데이터로 변환
        const calendarEvents = data.map(item => ({
          id: String(item.id || Math.random()), // 고유 ID
          title: item.name, // 직원 이름
          date: item.commuteDate, // 날짜
          backgroundColor: '#8CD3C5', // 이벤트 배경색
          borderColor: '#8CD3C5', // 이벤트 테두리색
        }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Failed to fetch monthly data:', error);
      }
    };

    fetchMonthlyData();
    // 나중에 []에 currentYear, currentMonth 추가
  }, []);


   // 날짜 선택 시 페이지로 이동
   const handleDateSelect = (selectInfo) => {
    const selectedDate = selectInfo.startStr; // 선택된 날짜 (YYYY-MM-DD 형식)
    router.push(`/attendance/daily-attendance?date=${selectedDate}`);
  };

  


  return (
      <div className={classes.calendarWrapper}>
          <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                  left: '',
                  center: 'prev title next',
                  right: ''
              }}
              editable={true}
              selectable={true}
              events={events}
              select={handleDateSelect}
              locale="ko"  // 한글화
              dayMaxEvents={6}  
          />
      </div>
  )
}

