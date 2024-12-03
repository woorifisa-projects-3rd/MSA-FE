import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      const {
        name,
        birthDate,
        address,
        phoneNumber,
        email,
        password,
        termsAccept
        } = await request.json();

      const response = await springClient.post(`/user/president/regist`, {
        name,
        birthDate,
        address,
        phoneNumber,
        email,
        password,
        termsAccept
       });

      // 성공 응답 반환
      return NextResponse.json({ success: true });
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