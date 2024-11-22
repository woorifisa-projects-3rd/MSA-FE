// refresh 관련 로직 나중에 해볼거임
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import springClient from '@/lib/springClient';
import { setAccessToken } from '@/utils/auth';

export async function GET() {
  try {
    // 저장된 리프레시 토큰 가져오기
    const refreshToken = cookies().get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json(
        { message: '리프레시 토큰이 없습니다.' },
        { status: 401 }
      );
    }

    // Spring Boot 서버에 리프레시 토큰으로 새 액세스 토큰 요청
    const response = await springClient.get('/user/president/refresh', {
        headers: {
            Authorization: `Bearer ${refreshToken}`
          }
    });

    const { accessToken} = response.data;

    // 새 토큰들을 쿠키에 저장
    setAccessToken(accessToken);

    return NextResponse.json({ success: true });

  } catch (error) {
     // 리프레시 토큰도 만료된 경우
     if (error.response?.status === 403) {
        cookies().delete('accessToken');
        cookies().delete('refreshToken');
        
        return NextResponse.json(
          { message: '재로그인이 필요합니다.' },
          { status: 403 }
        );
      }
  
      return NextResponse.json(
        { message: '토큰 갱신 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }
}