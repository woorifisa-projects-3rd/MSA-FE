import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';
import { getAccessToken, deleteAccessToken, deleteRefreshToken } from '@/utils/auth';

export async function GET() {
  try {
    // 액세스 토큰 가져오기
    const accessToken = getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { message: '로그아웃할 사용자 정보가 없습니다.' },
        { status: 401 }
      );
    }

    // Spring Boot 서버로 로그아웃 요청 (액세스 토큰 사용)
    const response = await springClient.get('/user/president/logout');

    // 액세스 토큰과 리프레시 토큰 삭제
    deleteAccessToken();

    // 로그아웃 성공 응답 반환
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data.message },
        { status: error.response.status }  // Spring Boot에서 온 상태 코드 유지
      );
    }
    return NextResponse.json(
      { message: '서버와 통신 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}