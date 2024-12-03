import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const { storeName, businessNumber } = await request.json();
        console.log('프론트에서 왔다:', { storeName, businessNumber });

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/store/businesscheck', { storeName, businessNumber });

        // 응답 처리
        if (response.data === 'ok') {
            return NextResponse.json({ success: true }, { status: 200 });
        } 
    } catch (error) {
        // spring server에서 온 에러 메세지와 status code가 있다면 그대로 client에게 전달
        // 그게 아니면 형식적으로 '서버 에러가 발생했습니다' 와 500 status code 발생
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
