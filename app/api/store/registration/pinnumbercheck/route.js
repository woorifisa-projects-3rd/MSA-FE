import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { pinNumber, email } = await request.json();
        console.log('프론트에서 왔다:', { pinNumber, email });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/core/account/pin', { pinNumber, email });
        console.log('Spring Boot 에서 왔다.:', response.data);

        // 응답 처리
        if (response.data.message === 'ok') {
            return NextResponse.json({ success: true }, { status: 200 });
        } 
    } catch (error) {
        const errorMessage = error.response.data.message // 확인테스트
        const statusCode = error.response?.status || 500;
        return NextResponse.json({ 
            success: false,
            error: errorMessage 
        }, { 
            status: statusCode 
        }); 
    }
}
    