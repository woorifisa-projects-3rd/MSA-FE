import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      const {
        email
        } = await request.json();

      const response = await springClient.post(`/user/president/check/email`, {
        email
       });

       const pinNumber = response.data;
       
      // 성공 응답 반환
      return NextResponse.json({ success: true, pin: pinNumber });
    } catch (error) {
      console.error('Spring Boot 이메일 전송 실패:', error.message);

      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }