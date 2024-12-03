import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { emailPinNumber, email } = await request.json();
        console.log('프론트에서 왔다:', { emailPinNumber, email });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/core/account/email/pin', { emailPinNumber, email });
        console.log('Spring Boot 에서 왔다.:', response.data);

        if (response.data === true) {
            return NextResponse.json({ success: true }, { status: 200 });
        }
    } catch (error) {
        const errorMessage = error.response?.data.message || '서버 에러가 발생했습니다.';
        const statusCode = error.response?.status || 500;
       
        return NextResponse.json({ 
            success: false,
            error: errorMessage 
        }, { 
            status: statusCode 
        }); 

    }
}
    