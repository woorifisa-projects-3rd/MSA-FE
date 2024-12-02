export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function GET() {
    try {
      const response = await springClient.get('/user/store/storelist');
      // 성공 응답 반환
      return NextResponse.json(response.data);
    } catch (error) {
      console.error('Spring Boot 직원 추가 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }