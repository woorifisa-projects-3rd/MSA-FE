export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function GET() {
    try {
      const response = await springClient.get('/user/store/storelist');

      // 응답 데이터 유효성 검사 추가 -> 바로 response.data 하면 build시 오류
      if (!response || !response.data) {
        return NextResponse.json(
          { message: 'No data received from Spring Boot' }, 
          { status: 404 }
        );
      }

      // 성공 응답 반환
      return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
      console.error('Spring Boot 직원 추가 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }