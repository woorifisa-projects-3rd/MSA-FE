
import springClient from '@/lib/springClient'; // Spring Boot와 통신하는 Axios 클라이언트
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 클라이언트로부터 전달받은 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const storeid = searchParams.get('storeid');

    if (!storeid) {
      return NextResponse.json(
        { message: 'Missing required parameter: storeid' },
        { status: 400 }
      );
    }

    // Spring Boot 서버에 GET 요청
    const springResponse = await springClient.get(`/user/employee/details?storeid=${storeid}`);
    // console.log("employee/details-response",springResponse.data )

    // Spring Boot에서 받은 데이터 반환
    return NextResponse.json(springResponse.data, { status: 200 });
  } catch (error) {
    console.error('Error fetching employee details from Spring Boot:', error.message);
    return NextResponse.json(
      { message: 'Failed to fetch employee details', error: error.message },
      { status: 500 }
    );
  }
}
