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