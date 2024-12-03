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