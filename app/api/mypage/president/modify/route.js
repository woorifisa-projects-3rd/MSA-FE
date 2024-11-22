import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function PUT(request) {
    try {
      const { phoneNumber, birthDate } = await request.json();
  
      const response = await springClient.put('/user/president/modify', { phoneNumber, birthDate });
      console.log("auth/login server response:", response.data);

      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      if (error.response) {
       
        return NextResponse.json(
          { message: error.response.data.message },
          { status: error.response.status }
        );
      }
      return NextResponse.json(
        { message: '서버와 통신 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
}