export const dynamic = 'force-dynamic'

import springClient from '@/lib/springClient'; // Spring Boot와 통신하는 Axios 클라이언트
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // 클라이언트로부터 전달받은 쿼리 파라미터 추출
    const { searchParams } = new URL(req.url);
    const storeid = searchParams.get('storeid');
    console.log(storeid);
    
    if (!storeid) {
      return NextResponse.json(
        { message: 'Missing required parameter: storeid' },
        { status: 400 }
      );
    }

    // Spring Boot 서버에 GET 요청
    const springResponse = await springClient.get(`/user/employee/details?storeid=${storeid}`);
    console.log("employee/details-response", springResponse.data )

    // Spring Boot에서 받은 데이터 반환
    return NextResponse.json(springResponse.data, { status: 200 });
  } catch (error) {
    const errorMessage = error.response?.data.message || '서버 에러가 발생했습니다.';
    const statusCode = error.response?.status || 500;

    return NextResponse.json({ 
        success: false,
        error: errorMessage 
    }, { 
        status: statusCode 
    }); 
  }
}
