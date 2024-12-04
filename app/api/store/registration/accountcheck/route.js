import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { bankCode, accountNumber } = await request.json();
        console.log('프론트에서 왔다:', { bankCode, accountNumber });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/core/account/check', { bankCode, accountNumber });
        console.log('Spring Boot 에서 왔다.:', response.data);
        // 응답 처리
        if (response.data) {
            return NextResponse.json({ success: true }, { status: 200 });
        } 
    } catch (error) {
        // const errorMessage = error.response?.data.message || '서버 에러가 발생했습니다.';
        const errorMessage = error.response.data.message // 확인테스트
        const statusCode = error.response?.status || 500;
        console.log("2단계 오류메세지:", errorMessage)
        return NextResponse.json({ 
            success: false,
            error: errorMessage 
        }, { 
            status: statusCode 
        }); 

    }
}
    