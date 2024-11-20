import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try {

        // Spring Boot 서버로 요청
        const response = await ('http://localhost:8888/user/president/mypage', {
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