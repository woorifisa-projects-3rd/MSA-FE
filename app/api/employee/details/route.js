import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function GET() {
    try {
      const storeid = 1;
      const response = await springClient.get(`/user/employee/details`, {
        params: {storeid : storeid},
       });
  
      // 성공 응답 반환
      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Spring Boot 직원 추가 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }