// app/api/attendance/daily-attendance/route.js
import springClient from '@/lib/springClient';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // URL에서 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const storeid = searchParams.get('storeid');
    const commutedate = searchParams.get('commutedate');

    console.log('attendance/daily-attendance Next Server Params:', {
      storeid,
      commutedate
    });

    // Spring Boot 서버로 요청
    const springResponse = await springClient.get(
      `/attendance/commute/daily`,
      {
        params: {
          storeid,
          commutedate
        }
      }
    );

    console.log('Spring Server Response:', springResponse.data);

    // Spring Boot 서버의 응답을 클라이언트가 사용하기 좋은 형태로 변환
    const formattedResponse = springResponse.data.map(item => ({
      name: item.name,
      startTime: item.startTime,
      endTime: item.endTime,
      totalHours: calculateTotalHours(item.commuteDuration), // 분 단위를 시간:분 형식으로 변환
      salary: item.commuteAmount,
      employeeType: item.employeeType,
      commuteId: item.commuteId
    }));

    console.log("next server가 client에게 보내는 data", formattedResponse);

    return NextResponse.json(formattedResponse);

  } catch (error) {
    console.error('Error in daily attendance API:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    // 에러 응답
    return NextResponse.json(
      { 
        message: 'Failed to fetch daily attendance',
        error: error.message,
        details: error.response?.data 
      },
      { status: error.response?.status || 500 }
    );
  }
}

// 삭제 추가
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const commuteid = searchParams.get('commuteid');

    if (!commuteid) {
      return NextResponse.json(
        { message: 'commuteid가 없습니다: commuteid' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete commute with commuteid:', commuteid);

    const response = await springClient.delete(`/attendance/commute`, {
      params: { commuteid }
    });

    // 상태 코드가 200일 때만 성공 응답
    if (response.status === 200) {
      return NextResponse.json({ 
        success: true,
        message: '출퇴근 기록이 성공적으로 삭제되었습니다.' 
      });
    } else {
      throw new Error('삭제 실패');
    }

  } catch (error) {
    console.error('삭제 도중 서버에서 전달된 에러:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    return NextResponse.json(
      { 
        success: false,
        message: '출퇴근 기록 삭제에 실패했습니다.',
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