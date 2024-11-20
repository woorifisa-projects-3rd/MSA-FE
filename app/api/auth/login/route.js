import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
      // 클라이언트에서 보낸 데이터 받기
      const { email, password } = await request.json();
  
      // Spring Boot로 로그인 요청
      const response = await springClient.post('/user/president/login', { email, password });
  
      const { accessToken } = response.data; // Spring Boot에서 받은 토큰
  
      // HTTP-Only 쿠키에 토큰 저장
      cookies().set('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS 환경에서만 사용
        sameSite: 'strict',
        maxAge: 3600, // 1시간
      });
  
      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Spring Boot 로그인 요청 실패:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }