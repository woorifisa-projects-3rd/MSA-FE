import { NextResponse } from 'next/server';
import springClient from '@/lib/springClient';

export async function POST(request) {
    try {
        const body = await request.json();

        // Spring Boot로 요청 보내기
        const response = await springClient.post('/user/president/termaccept', body);
        console.log('Spring Boot 응답:', response.data);

        // 응답 처리
        if (response.data.status) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            return NextResponse.json({ success: false }, { status: 400 });
        }
    } catch (error) {
        console.error('Spring Boot 요청 실패:', error.message, error.response?.data);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
    