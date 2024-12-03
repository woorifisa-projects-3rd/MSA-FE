import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      const body = await request.json();

      console.log(body);
  
      // Spring Boot로 요청 보내기
      const response = await springClient.post('/user/president/termaccept', body);
      console.log('Spring Boot 응답:', response.data);
  
      // 응답 처리
      if (response.data) {
        return NextResponse.json({ success: true }, { status: 200 });
      } 
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
  