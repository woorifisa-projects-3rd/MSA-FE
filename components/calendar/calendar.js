'use client';

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import classes from "./calendar-wrapper.module.css";
import "./calendar.css"



export default function Calendar (){

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const formattedMonth = currentMonth < 10 ? `0${currentMonth}` : currentMonth;

    // 이벤트 더미데이터 
  
    const [events, setEvents] = useState([
      {
          id: '1',
          title: '류혜리',
          date: '2024-11-14',
          backgroundColor: '#8CD3C5', // 초록색 (진행중)
          borderColor: '#8CD3C5'
      },
      {
          id: '2',
          title: '프로젝트 마감',
          date: '2024-11-14',
          backgroundColor: '#8CD3C5', // 초록색 (진행중)
          borderColor: '#8CD3C5'
      },
      {
          id: '3',
          title: '휴가',
          start: '2024-11-25',
          end: '2024-11-27',
          backgroundColor: '#8CD3C5', // 초록색 (진행중)
          borderColor: '#8CD3C5'
      },
      {
          id: '4',
          title: '정성윤',
          date: '2024-11-05',
          backgroundColor: '#D3D3D3', // 회색 (지난 이벤트)
          borderColor: '#D3D3D3'
      },
      {
          id: '5',
          title: '이원아',
          date: '2024-11-06',
          backgroundColor: '#D3D3D3', // 회색 (지난 이벤트)
          borderColor: '#D3D3D3'
      },
      {
          id: '6',
          title: '강세빈',
          date: '2024-11-07',
          backgroundColor: '#D3D3D3', // 회색 (지난 이벤트)
          borderColor: '#D3D3D3'
      },
      {
          id: '7',
          title: '박준혁',
          date: '2024-11-20',
          backgroundColor: '#8CD3C5', // 초록색 (진행중)
          borderColor: '#8CD3C5'
      }
  ]);

  console.log(events)
  
  // 날짜 선택 시 새 이벤트 추가
  const handleDateSelect = (selectInfo) => {
    const title = prompt('일정을 입력하세요:');
    if (title) {
      const newEvent = {
        id: String(Date.now()),  // 고유 ID 생성
        title,
        date: selectInfo.startStr  // 선택한 날짜
      };
      setEvents([...events, newEvent]);
    }
  };


  return (
      <div className={classes.calendarWrapper}>
          <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView='dayGridMonth'
              headerToolbar={{
                  left: 'prev,next',
                  center: 'title',
                  right: ''
              }}
              editable={true}
              selectable={true}
              events={events}
              select={handleDateSelect}
              locale="ko"  // 한글화
              dayMaxEvents={8}  
          />
      </div>
  )
}

