import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const formData = await request.json();
        console.log("next server로 온 response", formData);
        
        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/store', formData);

        console.log('store final registration Spring Boot 서버 응답:', response);

        // 성공인 경우 서버에서 response.data를  안 보내주고 오히려 실패하면 response.dtaa에 code와 message를 보내줌
        // 최종 등록 후 client측에서 최종 등록됐습니다~ 처리 해야함

        // 응답 처리
        if (response.status === 200) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
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