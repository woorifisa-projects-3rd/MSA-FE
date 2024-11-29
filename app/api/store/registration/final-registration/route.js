import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        // 클라이언트에서 보낸 데이터 받기
        const formData = await request.json();
        console.log("next server로 온 response", formData);
        
        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/store', formData);

        console.log('store final registration Spring Boot 서버 응답:', response.data);
        console.log('서버 응답', response.data.code, response.data.message)

        // 응답 처리
        if (response.data) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json(
            { error: error.message }, 
            { status: 500 }
        );
    }
}