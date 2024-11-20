import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function PUT(request) {
    try {
      // 클라이언트에서 보낸 데이터 받기
      console.log(request);
      const { beforePassword, newPassword } = await request.json();
  
      // Spring Boot로 로그인 요청
      const response = await springClient.put('/user/president/change-password', { beforePassword, newPassword });
      console.log("next server에서 spring boot에서 받은 response",response);
      if (response.data.status === true) {
        return NextResponse.json({ success: true }, { status: 200 });
      } else {
        return NextResponse.json({ success: false }, { status: 200 });
      }
    } catch (error) {
      console.error('Spring Boot 로그인 요청 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }