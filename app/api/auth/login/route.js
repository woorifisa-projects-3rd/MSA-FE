import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';
import { setAccessToken } from '@/utils/auth';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
      // 클라이언트에서 보낸 데이터 받기
      const { email, password } = await request.json();

  
      // Spring Boot로 로그인 요청
      const response = await springClient.post('/user/president/login', { email, password });
      console.log("auth/login server response:", response.data)
      
    
      const { accessToken, refreshToken } = response.data; // Spring Boot에서 받은 토큰

      cookies().set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        // refresh token은 더 긴 유효기간 설정
        maxAge: 7 * 24 * 60 * 60 // 7일
      });
    
     
      setAccessToken(accessToken);

      // 성공 응답 반환
      return NextResponse.json({ success: true });
    } catch (error) {
       
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }  // 400, 404 등 Spring Boot에서 온 상태 코드 유지
      );
      
    }
}