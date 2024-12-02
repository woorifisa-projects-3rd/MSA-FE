import springClient from '@/lib/springClient'; // Spring Boot와 통신하는 Axios 클라이언트
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const seid = searchParams.get('seid');
    const requestData = await req.json();
    console.log('Next Server received:', {
        seid,
        requestData
      });

    // Spring Boot로 데이터 POST 요청
    const springResponse = await springClient.post(
        `/attendance/commute?seid=${seid}`, // seid를 쿼리 파라미터로 전달
        requestData // 시작시간, 종료시간, 일자 데이터를 body로 전달
    );

    console.log('Spring Server response:', springResponse.data);

    // 성공 응답 반환
    return NextResponse.json(springResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error communicating with Spring Boot:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

    return NextResponse.json(
      { message: 'Failed to communicate with Spring Boot', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const commuteid = searchParams.get('commuteid');
    const { startTime, endTime, commuteDate } = await req.json();

    if (!commuteid) {
      return NextResponse.json(
        { message: 'commuteid가 없습니다: commuteid' },
        { status: 400 }
      );
    }

    console.log('Attempting to update commute with commuteid:', commuteid);

    const response = await springClient.put(`/attendance/commute`, 
      // Request Body
      {
        startTime,
        endTime,
        commuteDate
      },
      // URL Parameter
      {
        params: {
          commuteid: commuteid
        }
      }
    );

    console.log('Spring 서버 응답 상태코드:', response.status);
    console.log('Spring 서버 응답 데이터:', response.data);
    console.log('Spring 서버 응답 헤더:', response.headers);
    console.log('Spring 서버 전체 응답:', response);

    console.log('Spring 서버 응답 전체:', response);

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: '출퇴근 기록이 성공적으로 수정되었습니다.'
      });
    } else {
      throw new Error('수정 실패');
    }
  } catch (error) {
    console.error('수정 도중 서버에서 전달된 에러:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    return NextResponse.json(
      {
        success: false,
        message: '출퇴근 기록 수정에 실패했습니다.',
        error: error.message,
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}

// 근무 시간을 계산하는 헬퍼 함수
function calculateTotalHours(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
}