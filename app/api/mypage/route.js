import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {
        // 서버 사이드에서 안전하게 토큰 접근
        const token = cookies().get('accessToken')?.value;

        console.log('API Route에서 토큰:', token);
        const headers = new Headers(request.headers);
        
        // Spring Boot 서버로 요청
        const response = await fetch('http://localhost:8888/user/president/mypage', {
            headers
        });

        console.log('Spring Boot 응답 상태:', response.status);

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}