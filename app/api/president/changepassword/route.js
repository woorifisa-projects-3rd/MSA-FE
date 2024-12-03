import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function PUT(request) {
  try {
      // 클라이언트에서 보낸 데이터 받기
      const requestBody = await request.json(); // JSON 데이터를 먼저 파싱
      const { beforePassword, newPassword } = requestBody; // 이후 destructuring
      console.log("클라에서 넘어 왔다.", request.data);

      // Spring Boot로 로그인 요청
      const response = await springClient.put('/user/president/change-password', { beforePassword, newPassword });
      console.log("Next server에서 Spring Boot에서 받은 response:", response);

      if (response.status === 200) {
          return NextResponse.json({ success: true }, { status: 200 });
      } else {
          return NextResponse.json({ success: false }, { status: 400 });
      }
  } catch (error) {
      console.error('Spring Boot 로그인 요청 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
